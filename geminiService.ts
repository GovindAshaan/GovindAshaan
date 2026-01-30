
import { GoogleGenAI, Type } from "@google/genai";
import { NegotiationResult, FileData } from "./types.ts";

export const analyzeNegotiation = async (
  resume: FileData,
  jobDescription: string
): Promise<NegotiationResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing from environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are Ashan Career Domination AI, a World-class Compensation & Negotiation Strategist.
    Analyze the Resume for the Indian Tech/Corporate market.
    
    Target Job context: ${jobDescription || "General Market Readiness"}
    Location context: Tier 1 India (Bangalore, Mumbai, Gurgaon, etc.)
    
    Provide a detailed strategic breakdown:
    1. agent: Identify yourself as "Ashan Domination Engine".
    2. score (1-10): Negotiation power based on skill scarcity and brand value.
    3. strengths: Top 4 leverage points for high pay.
    4. risks: Top 4 reasons for lower offers (lowball targets).
    5. marketAlignment: Current state of Indian market for this specific role.
    6. advice: 5 tactical domination steps for the call.
    7. hireSignal: Confidence level in the profile ("Strong Yes", "Yes", "Borderline", "High Risk", "No").
    8. estimatedRange: Expected CTC in INR (e.g., "₹25L - ₹35L Fixed + ESOPs").
    
    Response MUST be valid JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{
        parts: [
          { inlineData: { data: resume.data, mimeType: resume.mimeType } },
          { text: prompt }
        ]
      }],
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
            hireSignal: { 
                type: Type.STRING,
                enum: ['Strong Yes', 'Yes', 'Borderline', 'High Risk', 'No']
            },
            estimatedRange: { type: Type.STRING }
          },
          required: ["agent", "score", "strengths", "risks", "marketAlignment", "advice", "hireSignal", "estimatedRange"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI.");
    return JSON.parse(text) as NegotiationResult;
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw error;
  }
};
