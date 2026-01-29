
import { GoogleGenAI, Type } from "@google/genai";
import { NegotiationResult, FileData } from "./types";

export const analyzeNegotiation = async (
  resume: FileData,
  jobDescription: string
): Promise<NegotiationResult> => {
  // Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are Ashan Career Domination AI, a elite Compensation & Negotiation Strategist for the Indian Tech/Corporate market (PBCs, Startups, Service).
    
    Inputs:
    - Resume: (Provided as binary)
    - Target Job: ${jobDescription || "General Market Readiness"}
    
    Instructions:
    1. Assess 'Negotiation Power Score' (1-10) based on brand of past companies, tech stack scarcity, and stability.
    2. Identify 'Strengths' (Specific leverage points to mention during HR calls).
    3. Identify 'Risks' (Weaknesses the recruiter will exploit to lowball).
    4. Provide 'Estimated Market Range' for this profile in INR (Fixed + Variable).
    5. Provide 5 'Domination Steps' for the final salary discussion.
    6. Identify yourself as 'Ashan AI Dominator' in the 'agent' field.
    
    Return the response ONLY as a JSON object matching the requested schema.
  `;

  // Fix contents structure and include agent in schema
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
  if (!text) {
    throw new Error("Empty response from AI");
  }
  return JSON.parse(text);
};
