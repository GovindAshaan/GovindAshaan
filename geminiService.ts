
import { GoogleGenAI, Type } from "@google/genai";
import { NegotiationResult, FileData } from "./types";

export const analyzeNegotiation = async (
  resume: FileData,
  jobDescription: string
): Promise<NegotiationResult> => {
  // Initializing with environment variable as per Vercel/Standard practices
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are Ashan Career Domination AI, a World-class Compensation & Negotiation Strategist.
    Analyze the Resume for the Indian Tech/Corporate market.
    
    Target Job context: ${jobDescription || "General Market Readiness"}
    
    Provide:
    1. Score (1-10) based on brand value and skill scarcity.
    2. Leverage Points: What to emphasize.
    3. Lowball Risks: What the recruiter will target to pay less.
    4. Market Range (INR).
    5. 5 Tactical Domination steps for the final call.
    
    Response MUST be valid JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: resume.data, mimeType: resume.mimeType } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          agent: { type: Type.STRING },
          score: { type: Type.NUMBER },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          marketAlignment: { type: Type.STRING },
          advice: { type: Type.ARRAY, items: { type: Type.STRING } },
          hireSignal: { type: Type.STRING },
          estimatedRange: { type: Type.STRING }
        },
        required: ["agent", "score", "strengths", "risks", "marketAlignment", "advice", "hireSignal", "estimatedRange"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI returned an empty response.");
  return JSON.parse(text);
};
