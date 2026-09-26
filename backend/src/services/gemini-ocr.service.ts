import { env } from '../config/env.config';
import { runOcr as runTesseractOcr, parseBillText as parseTesseractBillText } from './ocr.service';

export interface ExtractedBillItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  amount: number;
}

export interface ExtractedBillData {
  vendorName: string | null;
  vendorPhone: string | null;
  vendorAddress: string | null;
  invoiceNumber: string | null;
  billDate: string | null;
  items: ExtractedBillItem[];
  tax: number | null;
  discount: number | null;
  totalAmount: number | null;
  category: string | null;
  rawText: string;
}

const GEMINI_VISION_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.7-flash',
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
];

const BILL_EXTRACTION_PROMPT = `
You are an expert OCR and financial receipt analysis engine specialized in Indian agricultural invoices, bills, cash memos, and receipts.
Examine the provided image carefully and extract all billing details into a structured JSON object.

STRICT ACCURACY RULES:
1. Extract ONLY information that is genuinely and clearly visible in the image.
2. NEVER guess, hallucinate, simulate, or use dummy/hard-coded values.
3. If any field (e.g. vendor name, invoice number, tax, discount, date) is unreadable, blurred, or absent, set that field to null.
4. If no individual line items are distinguishable, return an empty array [] for items.
5. All amounts, quantities, tax, discount, and totals must be numeric (e.g. 1450.00, not "₹1,450").
6. Dates should be standardized as "YYYY-MM-DD" string if identifiable, otherwise null.

Respond strictly with a JSON object adhering to this schema:
{
  "vendorName": string | null,
  "vendorPhone": string | null,
  "vendorAddress": string | null,
  "invoiceNumber": string | null,
  "billDate": string | null,
  "items": [
    {
      "name": string,
      "quantity": number,
      "unit": string,
      "price": number,
      "amount": number
    }
  ],
  "tax": number | null,
  "discount": number | null,
  "totalAmount": number | null,
  "category": "FERTILIZER" | "SEEDS" | "PESTICIDE" | "MACHINERY" | "LABOR" | "IRRIGATION" | "OTHER" | null,
  "rawText": string | null
}
`;

/**
 * Perform AI Bill Scanning via Google Gemini Vision API
 */
export async function analyzeBillWithGemini(
  imageBase64: string,
  mimeType = 'image/jpeg'
): Promise<ExtractedBillData> {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY is not set. Falling back to local OCR engine.');
    return fallbackToTesseract(imageBase64, mimeType);
  }

  // Clean base64 string
  const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '').trim();
  const normalizedMime = mimeType.toLowerCase().includes('png') ? 'image/png' : 'image/jpeg';

  let lastError: any = null;

  for (const model of GEMINI_VISION_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const requestPayload = {
        contents: [
          {
            parts: [
              {
                text: BILL_EXTRACTION_PROMPT,
              },
              {
                inline_data: {
                  mime_type: normalizedMime,
                  data: cleanBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.1,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      const responseJson: any = await response.json();

      if (!response.ok) {
        console.warn(`Gemini model ${model} returned HTTP ${response.status}:`, JSON.stringify(responseJson?.error || responseJson));
        lastError = responseJson?.error || new Error(`HTTP ${response.status}`);
        continue; // Try next model
      }

      const candidate = responseJson?.candidates?.[0];
      const responseText = candidate?.content?.parts?.[0]?.text;

      if (!responseText) {
        console.warn(`Gemini model ${model} returned empty response`);
        continue;
      }

      // Parse JSON returned by Gemini
      let parsed: any;
      try {
        // Strip markdown code fences if model included them
        const cleanedText = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
        parsed = JSON.parse(cleanedText);
      } catch (parseErr) {
        console.error('Failed to parse Gemini JSON output:', responseText);
        continue;
      }

      // Sanitize items list
      const sanitizedItems: ExtractedBillItem[] = [];
      if (Array.isArray(parsed.items)) {
        for (const item of parsed.items) {
          if (item && typeof item.name === 'string' && item.name.trim().length > 0) {
            sanitizedItems.push({
              name: item.name.trim(),
              quantity: typeof item.quantity === 'number' && !isNaN(item.quantity) ? item.quantity : 1,
              unit: typeof item.unit === 'string' && item.unit.trim() ? item.unit.trim() : 'unit',
              price: typeof item.price === 'number' && !isNaN(item.price) ? item.price : 0,
              amount: typeof item.amount === 'number' && !isNaN(item.amount) ? item.amount : 0,
            });
          }
        }
      }

      const result: ExtractedBillData = {
        vendorName: parsed.vendorName && typeof parsed.vendorName === 'string' ? parsed.vendorName.trim() : null,
        vendorPhone: parsed.vendorPhone && typeof parsed.vendorPhone === 'string' ? parsed.vendorPhone.trim() : null,
        vendorAddress: parsed.vendorAddress && typeof parsed.vendorAddress === 'string' ? parsed.vendorAddress.trim() : null,
        invoiceNumber: parsed.invoiceNumber && typeof parsed.invoiceNumber === 'string' ? parsed.invoiceNumber.trim() : null,
        billDate: parsed.billDate && typeof parsed.billDate === 'string' ? parsed.billDate.trim() : null,
        items: sanitizedItems,
        tax: typeof parsed.tax === 'number' && !isNaN(parsed.tax) ? parsed.tax : null,
        discount: typeof parsed.discount === 'number' && !isNaN(parsed.discount) ? parsed.discount : null,
        totalAmount: typeof parsed.totalAmount === 'number' && !isNaN(parsed.totalAmount) ? parsed.totalAmount : null,
        category: parsed.category && typeof parsed.category === 'string' ? parsed.category.toUpperCase() : null,
        rawText: parsed.rawText && typeof parsed.rawText === 'string' ? parsed.rawText : responseText,
      };

      return result;
    } catch (err: any) {
      console.warn(`Error connecting to Gemini model ${model}:`, err?.message || err);
      lastError = err;
    }
  }

  console.warn('All Gemini models failed, falling back to local OCR engine:', lastError?.message || lastError);
  return fallbackToTesseract(cleanBase64, mimeType);
}

/**
 * Fallback to Tesseract OCR if cloud Gemini API is unavailable
 */
async function fallbackToTesseract(imageBase64: string, mimeType: string): Promise<ExtractedBillData> {
  try {
    const rawText = await runTesseractOcr(imageBase64, mimeType);
    const parsed = parseTesseractBillText(rawText);

    return {
      vendorName: parsed.vendorName,
      vendorPhone: parsed.vendorPhone,
      vendorAddress: parsed.vendorAddress,
      invoiceNumber: parsed.invoiceNumber,
      billDate: parsed.billDate,
      items: parsed.items,
      tax: null,
      discount: null,
      totalAmount: parsed.totalAmount || null,
      category: null,
      rawText: parsed.rawText,
    };
  } catch (err: any) {
    console.error('Tesseract fallback also failed:', err);
    return {
      vendorName: null,
      vendorPhone: null,
      vendorAddress: null,
      invoiceNumber: null,
      billDate: null,
      items: [],
      tax: null,
      discount: null,
      totalAmount: null,
      category: null,
      rawText: '',
    };
  }
}
