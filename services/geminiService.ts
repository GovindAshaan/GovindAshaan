
import { GoogleGenAI, Type } from "@google/genai";
import { NegotiationResult, FileData } from "../types";

export const analyzeCompensation = async (
  resume: FileData,
  jobDescription?: string
): Promise<NegotiationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `
    You are Ashan Career Domination AI, a World-class Compensation & Negotiation expert specializing in the Indian tech (PBC, Service, Startup) and corporate market.
    
    Task:
    Analyze the attached Resume and the provided Job Description (if available).
    
    Analysis Requirements:
    1. Evaluate the candidate's market value in INR (CTC context: Fixed, Variable, Joining Bonus, ESOPs).
    2. Assess negotiation leverage based on brand of previous companies, years of experience, and skill scarcity.
    3. Identify "Confidence Risks": Does the candidate look like they would settle for less?
    4. Provide specific "Domination Moves" (Actionable advice) for the negotiation table.
    
    Context:
    - Job Description: ${jobDescription || "Not provided (General market analysis requested)"}
    - Location: Assume Tier 1 Indian cities (Bangalore, Gurgaon, Pune, Hyderabad, Mumbai) unless specified.
    
    Response MUST be valid JSON according to the schema.
  `;

  const resumePart = {
    inlineData: {
      data: resume.data,
      mimeType: resume.mimeType,
    },
  };

  // Using Pro for "Complex reasoning" as per instructions
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: [resumePart, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          agent: { type: Type.STRING },
          score: { type: Type.NUMBER, description: "Negotiation Power Score from 0 to 10" },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific leverage points" },
          risks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Reasons for lower offers" },
          marketAlignment: { type: Type.STRING, description: "Detailed overview of where they fit in current Indian market" },
          advice: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 actionable domination steps" },
          hireSignal: { type: Type.STRING, enum: ["Yes", "Borderline", "No"] }
        },
        required: ["agent", "score", "strengths", "risks", "marketAlignment", "advice", "hireSignal"]
      }
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    return JSON.parse(text) as NegotiationResult;
  } catch (e) {
    console.error("Parse Error:", e);
    throw new Error("The AI provided an incompatible response. Please try with a clearer resume.");
  }
};
