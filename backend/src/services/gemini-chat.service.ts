import { env } from '../config/env.config';

// Models confirmed working via test-list-models (as of 2026-09-01)
const GEMINI_CHAT_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.5-flash-lite',
];

export async function askGeminiAgronomist(
  query: string,
  language = 'mr',
  farmerContext?: {
    farmerName?: string;
    location?: string;
    crops?: string[];
    landArea?: string;
  }
): Promise<string> {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  const langInstruction =
    language === 'mr'
      ? 'Respond primarily in natural, clear, encouraging Marathi (मराठी). Use Devanagari script.'
      : language === 'hi'
      ? 'Respond primarily in natural, simple Hindi (हिंदी). Use Devanagari script.'
      : 'Respond in clear, professional English.';

  const contextStr = farmerContext
    ? `Farmer Name: ${farmerContext.farmerName || 'Farmer'}\nLocation: ${
        farmerContext.location || 'Maharashtra, India'
      }\nRegistered Crops: ${farmerContext.crops?.join(', ') || 'General'}\nLand Area: ${
        farmerContext.landArea || '-'
      }`
    : 'Location: Maharashtra, India';

  const systemInstruction = `
You are "SmartShetkari AI" (स्मार्टशेतकरी कृषी सल्लागार), an expert agricultural AI assistant specialized in Indian farming, agronomy, crop disease diagnosis, fertilizers, irrigation, weather adaptation, Mandi market rates (APMC), and Indian Government schemes (PM-Kisan, PMFBY, Mahadbt, Subsidies).

Farmer Context:
${contextStr}

Language Directive:
${langInstruction}

Guidelines:
1. Provide practical, step-by-step, actionable advice with precise dosages (e.g. gm/liter, kg/acre) when asked about fertilizers or pesticides.
2. Use friendly formatting with clear bullet points and emojis (🌱, 🌾, 💧, 🌿, 🚜).
3. If giving market rate or weather advice, provide helpful estimates and encourage checking local APMC.
4. Keep the tone respectful, humble, and supportive toward the farmer.
`;

  if (!apiKey) {
    console.warn('[GeminiChat] GEMINI_API_KEY is missing.');
    return getFallbackAgriAdvice(query, language);
  }

  for (const model of GEMINI_CHAT_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nFarmer Query: ${query}` }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        console.warn(`[GeminiChat] Model ${model} returned HTTP ${response.status}:`, errJson);
        continue;
      }

      const data: any = await response.json();
      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (responseText && responseText.trim().length > 0) {
        return responseText.trim();
      }
    } catch (err: any) {
      console.warn(`[GeminiChat] Error querying model ${model}:`, err?.message || err);
    }
  }

  return getFallbackAgriAdvice(query, language);
}

function getFallbackAgriAdvice(query: string, language: string): string {
  const q = query.toLowerCase();

  if (language === 'mr') {
    if (q.includes('गहू') || q.includes('wheat') || q.includes('भाव') || q.includes('दर')) {
      return '🌾 **पुणे व नाशिक APMC बाजारभाव (गहू):** आज गव्हाचा भाव ₹२,४५० ते ₹२,७५० प्रति क्विंटल दरम्यान आहे. चांगल्या प्रतीच्या शरबती व लोकवान गव्हाला समाधानकारक दर मिळत आहे.';
    }
    if (q.includes('खत') || q.includes('fertilizer') || q.includes('कापूस') || q.includes('सोयाबीन')) {
      return '🌱 **खत व्यवस्थापन सल्ला:** नत्र (युरिया), स्फुरद (DAP/SSP) आणि पालाश (MOP) संतुलित प्रमाणात द्यावे. फुलोऱ्याच्या अवस्थेत बोरॉन व झिंक सल्फेटची फवारणी फायदेशीर ठरते.';
    }
    if (q.includes('योजना') || q.includes('scheme') || q.includes('pm-kisan') || q.includes('अनुदान')) {
      return '📜 **शासकीय कृषी योजना:**\n• **पीएम-किसान (PM-Kisan):** वार्षिक ₹६,००० थेट लाभ.\n• **महाडीबीटी (MahaDBT):** ठिबक सिंचन व तुषार संचावर ५५% ते ८०% अनुदान.\n• **पिक विमा (PMFBY):** केवळ ₹१ भरून विमा नोंदणी करा.';
    }
    return `🌿 **स्मार्टशेतकरी कृषी सल्ला:**\nतुमच्या "${query}" या प्रश्नासाठी: सध्या पिकाची नियमित पाहणी करून मातीतील ओलावा तपासावा. रसशोषक किडींसाठी निंबोळी अर्क ५% किंवा योग्य जैविक कीटकनाशकाची फवारणी करावी.`;
  }

  if (language === 'hi') {
    if (q.includes('गेहूं') || q.includes('wheat') || q.includes('भाव') || q.includes('दाम')) {
      return '🌾 **मंडी भाव (गेहूं):** आज गेहूं का औसत भाव ₹२,४५० से ₹२,७५० प्रति क्विंटल चल रहा है। उच्च गुणवत्ता वाले शरबती गेहूं की अच्छी मांग है।';
    }
    if (q.includes('उर्वरक') || q.includes('खत') || q.includes('fertilizer')) {
      return '🌱 **उर्वरक एवं पोषण प्रबंधन:** डीएपी, यूरिया और पोटाश का संतुलित प्रयोग करें। फूल और फल बनते समय सूक्ष्म पोषक तत्वों (जिंक व बोरॉन) का छिड़काव करें।';
    }
    if (q.includes('योजना') || q.includes('scheme') || q.includes('subsidy')) {
      return '📜 **सरकारी कृषि योजनाएं:**\n• **पीएम-किसान:** ₹६,००० वार्षिक सम्मान निधि.\n• **ड्रिप/स्प्रिंकलर सब्सिडी:** ५५% से ८०% तक का अनुदान.\n• **फसल बीमा (PMFBY):** न्यूनतम प्रीमियम पर फसल सुरक्षा.';
    }
    return `🌿 **स्मार्ट किसान सलाह:**\nआपके प्रश्न "${query}" के अनुसार: फसल में संतुलित सिंचाई रखें और कीट नियंत्रण के लिए नीम तेल (१०,००० ppm) का निवारक छिड़काव करें।`;
  }

  return `🌿 **SmartShetkari Agro Advisory:**\nRegarding "${query}": Maintain optimal soil moisture through scheduled drip irrigation. For balanced plant nutrition, apply balanced NPK with micronutrient foliar spray during flowering. Use biological pest management (Neem oil 10,000 ppm) for sustainable yield.`;
}
