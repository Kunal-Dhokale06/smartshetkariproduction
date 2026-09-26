import { env } from '../config/env.config';

async function testGeminiApiKey() {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  console.log('Testing Gemini API Key:', apiKey.slice(0, 8) + '...');

  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

  for (const model of models) {
    try {
      console.log(`Trying model: ${model}...`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: 'Hello, respond with {"status": "ok"} in JSON format.' }],
            },
          ],
        }),
      });

      const data: any = await response.json();
      if (response.ok && data?.candidates && data.candidates.length > 0) {
        console.log(`✅ Success with model ${model}!`);
        console.log('Response:', data.candidates[0].content.parts[0].text);
        return model;
      } else {
        console.log(`❌ Model ${model} returned:`, JSON.stringify(data));
      }
    } catch (err: any) {
      console.log(`❌ Model ${model} failed with exception:`, err?.message);
    }
  }

  return null;
}

testGeminiApiKey()
  .then((m) => {
    console.log('Result:', m);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
