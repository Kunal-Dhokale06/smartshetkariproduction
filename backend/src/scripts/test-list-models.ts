import { env } from '../config/env.config';

async function listGeminiModels() {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  console.log('Querying ListModels with key:', apiKey.slice(0, 10) + '...');

  const endpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`,
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Checking endpoint: ${endpoint}...`);
      const res = await fetch(endpoint);
      const data: any = await res.json();
      if (res.ok && data?.models) {
        console.log(`✅ Available models from ${endpoint}:`);
        data.models.forEach((m: any) => {
          console.log(` - ${m.name} (${m.supportedGenerationMethods?.join(', ')})`);
        });
        return;
      } else {
        console.log('Response:', JSON.stringify(data));
      }
    } catch (err: any) {
      console.error('Error fetching models:', err?.message);
    }
  }
}

listGeminiModels();
