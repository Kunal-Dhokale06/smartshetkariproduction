import { env } from '../config/env.config';

async function testWorkingGeminiModels(): Promise<string | null> {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  const testModels = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-flash-latest'];

  for (const model of testModels) {
    try {
      console.log(`Testing model: ${model}...`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: 'नमस्कार, कापसावरील बोंडअळी नियंत्रणासाठी काय उपाय करावा? २ ओळीत सांगा.' }],
            },
          ],
        }),
      });

      const data: any = await response.json();
      if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log(`✅ SUCCESS WITH ${model}!`);
        console.log('Gemini Answer:\n', data.candidates[0].content.parts[0].text);
        return model;
      } else {
        console.log(`❌ Error for ${model}:`, JSON.stringify(data));
      }
    } catch (e: any) {
      console.log(`Exception for ${model}:`, e?.message);
    }
  }
  return null;
}

testWorkingGeminiModels().then(m => console.log('Finished testing, chosen model:', m));
