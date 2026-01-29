
import { GoogleGenAI, Type } from "@google/genai";
import { NegotiationResult, FileData } from "../types";

export const analyzeCompensation = async (
  resume: FileData,
  jobDescription?: string
): Promise<NegotiationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `
    You are Ashan Career Domination AI, a World-class Compensation & Negotiation expert specializing in the Indian tech and corporate market.
    Analyze the attached Resume and the provided Job Description (if available) to evaluate salary positioning, market leverage, and negotiation readiness.
    
    Rules:
    - Assume realistic Indian market standards (INR, Tier 1/2/3 cities, PBC vs Service, etc.) unless specified otherwise.
    - Identify if the candidate is overpricing themselves or suffering from underconfidence.
    
    Job Description: ${jobDescription || "Not provided"}

    Provide a structured analysis.
  `;

  const resumePart = {
    inlineData: {
      data: resume.data,
      mimeType: resume.mimeType,
    },
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [resumePart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          agent: { type: Type.STRING },
          score: { type: Type.NUMBER, description: "Negotiation score from 0 to 10" },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          marketAlignment: { type: Type.STRING },
          advice: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Max 5 actionable steps" },
          hireSignal: { type: Type.STRING, enum: ["Yes", "Borderline", "No"] }
        },
        required: ["agent", "score", "strengths", "risks", "marketAlignment", "advice", "hireSignal"]
      }
    },
  });

  try {
    return JSON.parse(response.text) as NegotiationResult;
  } catch (e) {
    throw new Error("Failed to parse analysis results. Please try again.");
  }
};
