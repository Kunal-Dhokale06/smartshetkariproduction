import { env } from '../config/env.config';

async function testGeminiVision() {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

  const samplePixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

  const models = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.5-pro', 'gemini-3.5-flash'];

  for (const model of models) {
    try {
      console.log(`Testing Gemini Vision with model: ${model}...`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const payload = {
        contents: [
          {
            parts: [
              {
                text: 'You are an expert OCR and bill parsing system. Analyze this image and extract details in JSON with keys: vendorName, invoiceNumber, billDate, items, totalAmount.',
              },
              {
                inline_data: {
                  mime_type: 'image/png',
                  data: samplePixelBase64,
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

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data: any = await res.json();
      if (res.ok && data?.candidates && data.candidates.length > 0) {
        console.log(`✅ Success with ${model}!`);
        console.log('Result JSON:', data.candidates[0].content.parts[0].text);
        return model;
      } else {
        console.log(`Response for ${model}:`, JSON.stringify(data));
      }
    } catch (err: any) {
      console.error(`Error with ${model}:`, err?.message);
    }
  }

  return null;
}

testGeminiVision();
