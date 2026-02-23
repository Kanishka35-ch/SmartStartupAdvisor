import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export enum RiskLevel {
  LOW = "Low",
  MEDIUM = "Medium",
  MEDIUM_HIGH = "Medium-High",
  HIGH = "High"
}

export interface EvaluationResult {
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  riskAssessment: {
    marketAdoption: RiskLevel;
    financialFeasibility: RiskLevel;
    operationalExecution: RiskLevel;
    technicalLegal: RiskLevel;
  };
  strategicSuggestions: string[];
  investmentReadinessScore: number;
  industryBenchmarking: {
    competitorName: string;
    advantage: string;
  }[];
  marketTrends: {
    year: string;
    value: number;
  }[];
  mvpRoadmap: {
    phase: string;
    tasks: string[];
  }[];
  summary: string;
}

const evaluationSchema = {
  type: Type.OBJECT,
  properties: {
    swot: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["strengths", "weaknesses", "opportunities", "threats"],
    },
    riskAssessment: {
      type: Type.OBJECT,
      properties: {
        marketAdoption: { type: Type.STRING },
        financialFeasibility: { type: Type.STRING },
        operationalExecution: { type: Type.STRING },
        technicalLegal: { type: Type.STRING },
      },
      required: ["marketAdoption", "financialFeasibility", "operationalExecution", "technicalLegal"],
    },
    strategicSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    investmentReadinessScore: { type: Type.NUMBER },
    industryBenchmarking: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          competitorName: { type: Type.STRING },
          advantage: { type: Type.STRING },
        },
        required: ["competitorName", "advantage"],
      },
    },
    marketTrends: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          year: { type: Type.STRING },
          value: { type: Type.NUMBER },
        },
        required: ["year", "value"],
      },
    },
    mvpRoadmap: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          phase: { type: Type.STRING },
          tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["phase", "tasks"],
      },
    },
    summary: { type: Type.STRING },
  },
  required: [
    "swot",
    "riskAssessment",
    "strategicSuggestions",
    "investmentReadinessScore",
    "industryBenchmarking",
    "marketTrends",
    "mvpRoadmap",
    "summary"
  ],
};

export async function evaluateStartupIdea(idea: string, context?: string): Promise<EvaluationResult> {
  const prompt = `
    Analyze the following startup idea and provide a comprehensive evaluation.
    Idea: ${idea}
    Additional Context: ${context || "None provided"}

    Provide:
    1. SWOT Analysis
    2. Risk Assessment (Low, Medium, Medium-High, High)
    3. Strategic Suggestions
    4. Investment Readiness Score (0-100)
    5. Industry Benchmarking (Compare with top startups/competitors)
    6. Market Trends (5 data points for a trend chart, e.g., market size or growth)
    7. MVP Roadmap (3-4 phases)
    8. A concise summary.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: evaluationSchema,
      systemInstruction: "You are an expert startup consultant and venture capitalist. Provide realistic, data-driven, and critical yet constructive feedback.",
    },
  });

  return JSON.parse(response.text || "{}");
}

export async function getChatResponse(messages: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are SmartStartupAdvisor, a helpful and professional AI business consultant. Your goal is to help users refine their startup ideas before they request a full evaluation. Ask clarifying questions about their target market, business model, and unique value proposition. Be concise and encouraging.",
    },
  });

  // We need to handle the history correctly. 
  // The last message is the new one.
  const history = messages.slice(0, -1).map(m => ({ role: m.role, parts: m.parts }));
  const lastMessage = messages[messages.length - 1].parts[0].text;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: messages,
    config: {
        systemInstruction: "You are SmartStartupAdvisor, a helpful and professional AI business consultant. Your goal is to help users refine their startup ideas before they request a full evaluation. Ask clarifying questions about their target market, business model, and unique value proposition. Be concise and encouraging.",
    }
  });

  return response.text;
}
