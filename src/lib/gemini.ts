import { AtsTailorResponseSchema, type AtsTailorResponse } from './validation';
// Note: Depending on the specific "@google/genai" library or the fetch REST API used for gemini, implementation varies.
// We are using the standard fetch-based approach for Gemini 1.5 Flash via REST for complete control over system instructions and JSON schemas.

function stripJsonFences(input: string) {
  return input
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```$/i, '')
    .trim();
}

export async function tailorResume(
  originalResume: string,
  jobDescription: string,
  language: 'en' | 'ar',
  strength: 'conservative' | 'balanced' | 'aggressive'
): Promise<AtsTailorResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

  const schemaJson = {
    type: "OBJECT",
    properties: {
      ats_score: { type: "NUMBER" },
      predicted_ats_score: { type: "NUMBER" },
      keywords_matched: { type: "ARRAY", items: { type: "STRING" } },
      keywords_missing: { type: "ARRAY", items: { type: "STRING" } },
      tailored_resume_html: { type: "STRING" },
      feedback: { type: "STRING" }
    },
    required: ["ats_score", "predicted_ats_score", "keywords_matched", "keywords_missing", "tailored_resume_html", "feedback"]
  };

  const systemInstruction = `You are VIGILANTE, an elite, highly precise ATS-optimization AI. Your objective is to brutally scrutinize the original resume against the provided job description and tailor it to bypass Applicant Tracking Systems. Output mathematically precise scores, exact keyword matches, and a highly polished HTML response containing the refined resume. Language context: ${language}. Tailoring aggression: ${strength}. DO NOT hallucinate job titles or experiences the user did not possess. Output MUST comply with the provided JSON schema.`;

  const payload = {
    contents: [{
      parts: [
        { text: `=== JOB DESCRIPTION ===\n${jobDescription}\n\n=== ORIGINAL RESUME ===\n${originalResume}` }
      ]
    }],
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schemaJson,
      temperature: strength === 'aggressive' ? 0.7 : 0.3,
    }
  };

  // Currently requesting to gemini-2.5-flash
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error: ${errText}`);
  }

  const responseJson = await response.json();
  const rawDataStr = responseJson.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!rawDataStr) {
    throw new Error("Unable to extract valid response parts from Gemini API.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonFences(String(rawDataStr)));
  } catch (e) {
    throw new Error(
      `Gemini returned non-JSON output. ${(e as Error).message}`
    );
  }

  const validatedData = AtsTailorResponseSchema.parse(parsed);
  return validatedData;
}
