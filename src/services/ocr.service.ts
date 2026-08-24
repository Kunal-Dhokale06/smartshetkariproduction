import Tesseract from 'tesseract.js';
import * as fs from 'fs';
import * as path from 'path';

// ─── OCR ENGINE ─────────────────────────────────────────────────────────────

/**
 * Runs OCR on a base64-encoded image using tesseract.js.
 * Supports JPEG, PNG, WebP, BMP image formats.
 */
export async function runOcr(imageBase64: string, mimeType?: string): Promise<string> {
  const ext = mimeType === 'image/png' ? 'png' : 'jpg';
  // Strip any data URI prefix if present
  const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '').trim();
  const buffer = Buffer.from(cleanBase64, 'base64');
  const tempPath = path.join(process.cwd(), 'uploads', `_ocr_tmp_${Date.now()}.${ext}`);

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  fs.writeFileSync(tempPath, buffer);

  try {
    const result = await Tesseract.recognize(tempPath, 'eng', {
      logger: () => {}, // suppress verbose console spam
    });

    return result.data.text ? result.data.text.trim() : '';
  } catch (err) {
    console.error('Tesseract OCR error:', err);
    throw err;
  } finally {
    // Clean up temporary OCR file
    try {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    } catch {
      /* ignore */
    }
  }
}

// ─── BILL TEXT PARSER ────────────────────────────────────────────────────────

export interface ParsedBillItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  amount: number;
}

export interface ParsedBill {
  vendorName: string | null;
  vendorPhone: string | null;
  vendorAddress: string | null;
  invoiceNumber: string | null;
  billDate: string | null;
  items: ParsedBillItem[];
  totalAmount: number;
  rawText: string;
}

/**
 * Parse raw OCR text into a structured bill object strictly from detected text.
 * No dummy fallbacks or synthetic values are generated.
 */
export function parseBillText(rawText: string): ParsedBill {
  if (!rawText || rawText.trim().length === 0) {
    return {
      vendorName: null,
      vendorPhone: null,
      vendorAddress: null,
      invoiceNumber: null,
      billDate: null,
      items: [],
      totalAmount: 0,
      rawText: '',
    };
  }

  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // --- Vendor Name (First non-generic header line in top 6 lines) ---
  let vendorName: string | null = null;
  const skipVendorKeywords = /^(tax\s*invoice|invoice|bill|cash\s*memo|receipt|estimate|challan|credit|debit|gst|retail\s*invoice|date|phone|mob|tel)/i;

  for (const line of lines.slice(0, 6)) {
    if (skipVendorKeywords.test(line)) continue;
    if (line.length >= 3 && /[A-Za-z]/.test(line)) {
      const cleaned = line.replace(/[^A-Za-z0-9\s\.\-&,]/g, '').trim();
      if (cleaned.length >= 3) {
        vendorName = cleaned;
        break;
      }
    }
  }

  // --- Vendor Phone (10-digit Indian phone number) ---
  let vendorPhone: string | null = null;
  const phoneMatch =
    rawText.match(/(?:mob|phone|tel|ph|contact|cell)[.:\s]*([6-9]\d{9})/i) ||
    rawText.match(/\b([6-9]\d{9})\b/);
  if (phoneMatch && phoneMatch[1]) {
    vendorPhone = phoneMatch[1];
  }

  // --- Vendor Address ---
  let vendorAddress: string | null = null;
  const addrMatch = rawText.match(
    /(?:\d+[,\s]+[A-Za-z\s]+(?:road|rd|street|st|nagar|colony|ward|market|yard|lane|marg|chowk|pune|mumbai|nashik|kolhapur|solapur|satara|aurangabad|nagpur|jalgaon|amravati|akola|latur|dhule|ahmednagar)[^,\n]*)/i
  );
  if (addrMatch && addrMatch[0]) {
    vendorAddress = addrMatch[0].trim();
  }

  // --- Invoice / Bill Number ---
  let invoiceNumber: string | null = null;
  const billNoMatch = rawText.match(
    /(?:bill\s*no|invoice\s*no|inv\s*no|receipt\s*no|voucher\s*no|bill\s*#|inv\s*#|bill\s*:|invoice\s*:)\s*[:\-#]?\s*([A-Z0-9\-\/]{2,20})/i
  );
  if (billNoMatch && billNoMatch[1]) {
    invoiceNumber = billNoMatch[1].trim();
  }

  // --- Date ---
  let billDate: string | null = null;
  const datePatterns = [
    /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/, // DD/MM/YYYY or DD-MM-YYYY
    /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]+(\d{2,4})/i, // DD Mon YYYY
  ];

  for (const pattern of datePatterns) {
    const m = rawText.match(pattern);
    if (m && m[1] && m[2] && m[3]) {
      try {
        if (pattern.source.includes('jan')) {
          const months: Record<string, number> = {
            jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
            jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
          };
          const monthKey = m[2].toLowerCase().slice(0, 3);
          const monthIdx = months[monthKey] ?? 0;
          const d = new Date(parseInt(m[3], 10), monthIdx, parseInt(m[1], 10));
          if (!isNaN(d.getTime())) {
            const formatted = d.toISOString().split('T')[0];
            billDate = formatted ?? null;
          }
        } else {
          const day = parseInt(m[1], 10);
          const month = parseInt(m[2], 10) - 1;
          const yearStr = m[3];
          const year = yearStr.length === 2 ? 2000 + parseInt(yearStr, 10) : parseInt(yearStr, 10);
          const d = new Date(year, month, day);
          if (!isNaN(d.getTime())) {
            const formatted = d.toISOString().split('T')[0];
            billDate = formatted ?? null;
          }
        }
        break;
      } catch {
        /* ignore invalid parse */
      }
    }
  }

  // --- Total Amount ---
  let totalAmount = 0;
  const totalPatterns = [
    /(?:grand\s*total|net\s*amount|total\s*amount|total\s*payable|net\s*payable|final\s*amount|total)\s*[:\-]?\s*[₹Rs.]*\s*([\d,]+(?:\.\d{1,2})?)/i,
    /[₹Rs.]\s*([\d,]+(?:\.\d{1,2})?)\s*(?:only|\/\-)?$/im,
  ];

  for (const pattern of totalPatterns) {
    const m = rawText.match(pattern);
    if (m && m[1]) {
      const val = parseFloat(m[1].replace(/,/g, ''));
      if (!isNaN(val) && val > 0) {
        totalAmount = val;
        break;
      }
    }
  }

  // --- Line Items Extraction ---
  const items: ParsedBillItem[] = [];
  const UNIT_PATTERN = /\b(kg|gm|g|ltr|l|ml|bag|bags|pkt|packet|packets|unit|units|nos|no|bottle|bottles|quintal|qt|ton|can|tin)\b/i;

  for (const line of lines) {
    // Skip headers and meta lines
    if (/^(item|description|product|particulars|total|amount|qty|quantity|price|rate|sl|sr|s\.no|hsn|gst|tax)/i.test(line)) continue;
    if (/^(thank|visit|cgst|sgst|igst|batch|mfg|exp|invoice|bill|date|address|phone|mob|sign|rupees)/i.test(line)) continue;

    // Pattern: Item Name | Qty | Unit | Price | Amount
    const tabMatch = line.match(/^(.+?)\s{2,}(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)$/);
    if (tabMatch && tabMatch[1] && tabMatch[2] && tabMatch[3] && tabMatch[4]) {
      const name = tabMatch[1].trim();
      const qty = parseFloat(tabMatch[2]);
      const price = parseFloat(tabMatch[3]);
      const amount = parseFloat(tabMatch[4]);
      const unitM = name.match(UNIT_PATTERN);
      if (name.length >= 2 && qty > 0 && price > 0) {
        items.push({
          name: name.replace(UNIT_PATTERN, '').trim(),
          quantity: qty,
          unit: unitM && unitM[1] ? unitM[1] : 'unit',
          price,
          amount: amount || qty * price,
        });
      }
      continue;
    }

    // Pattern: Line ending with price numbers
    const parts = line.split(/\s{2,}|\t/).filter(Boolean);
    if (parts.length >= 3) {
      const lastStr = parts[parts.length - 1];
      const secondLastStr = parts[parts.length - 2];
      const thirdLastStr = parts.length >= 3 ? parts[parts.length - 3] : undefined;

      const lastNum = lastStr ? parseFloat(lastStr.replace(/,/g, '')) : NaN;
      const secondLastNum = secondLastStr ? parseFloat(secondLastStr.replace(/,/g, '')) : NaN;
      const thirdLastNum = thirdLastStr ? parseFloat(thirdLastStr.replace(/,/g, '')) : NaN;

      if (!isNaN(lastNum) && !isNaN(secondLastNum) && lastNum > 0) {
        const nameCandidate = parts.slice(0, -2).join(' ').trim() || parts[0] || '';
        const unitM = nameCandidate.match(UNIT_PATTERN);
        if (nameCandidate.length >= 2 && !/^(total|net|tax|amount)/i.test(nameCandidate)) {
          items.push({
            name: nameCandidate.replace(UNIT_PATTERN, '').trim(),
            quantity: !isNaN(thirdLastNum) && thirdLastNum > 0 ? thirdLastNum : 1,
            unit: unitM && unitM[1] ? unitM[1] : 'unit',
            price: secondLastNum,
            amount: lastNum,
          });
        }
      }
    }
  }

  // If no explicit total found but items were extracted, calculate sum
  if (totalAmount === 0 && items.length > 0) {
    totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  }

  return {
    vendorName,
    vendorPhone,
    vendorAddress,
    invoiceNumber,
    billDate,
    items,
    totalAmount,
    rawText,
  };
}
