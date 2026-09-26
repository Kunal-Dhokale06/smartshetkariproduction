import { analyzeBillWithGemini } from '../services/gemini-ocr.service';

async function testGeminiIntegration() {
  console.log('--- Testing Gemini Vision Bill Extraction ---');

  // Minimal 1x1 transparent PNG as test image
  const testBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

  const result = await analyzeBillWithGemini(testBase64, 'image/png');
  console.log('Gemini Extraction Output:');
  console.log(JSON.stringify(result, null, 2));

  if (result && typeof result === 'object') {
    console.log('✅ Gemini Vision API successfully connected and returned structured JSON response!');
  } else {
    console.error('❌ Failed to get valid response from Gemini Vision');
    process.exit(1);
  }
}

testGeminiIntegration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
