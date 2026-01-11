
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

export const generateMedicalIllustration = async (prompt: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: `Create a professional, high-fidelity 1K medical illustration or detailed anatomy diagram of: ${prompt}. 
            Style: Clinical, clean white background, accurate anatomical labels if possible, similar to a premium medical textbook (Netter's style). 
            Color palette: Professional medical blues, emerald greens, and soft highlights. 
            Avoid gore; focus on educational clarity and sharp anatomical precision.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};

export const startMedicalAnimationGeneration = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `A professional 3D medical animation of: ${prompt}. Cinematic lighting, smooth motion, high anatomical detail, educational style, clean background.`,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });
  return operation;
};

export const pollVideoOperation = async (operation: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return await ai.operations.getVideosOperation({ operation: operation });
};

export interface AssistantResponse {
  text: string;
  sources?: { uri: string; title: string }[];
}

export const getHealthAssistantResponse = async (
  prompt: string, 
  history: { role: string; parts: any[] }[],
  file?: { data: string; mimeType: string }
): Promise<AssistantResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const parts: any[] = [{ text: prompt }];
    if (file) {
      parts.push({
        inlineData: {
          data: file.data,
          mimeType: file.mimeType
        }
      });
    }

    const modelName = "gemini-3-pro-preview";

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        ...history,
        { role: 'user', parts: parts }
      ],
      config: {
        systemInstruction: `You are NextCare AI (NEXIS Core), an advanced, global healthcare intelligence. 
        You have access to real-time search data to answer queries about current medical news, trends, and global health events.
        
        Guidelines:
        1. Be professional, clinical yet empathetic.
        2. Use search grounding for up-to-date facts.
        3. Provide clear, bulleted information for complex topics.`,
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    const text = response.text || "I'm sorry, I couldn't process that request.";
    
    const sources: { uri: string; title: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ uri: chunk.web.uri, title: chunk.web.title });
        }
      });
    }

    return { text, sources: sources.length > 0 ? sources : undefined };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "I encountered an error while trying to assist you. Please try again in a moment." };
  }
};

export const generatePersonalizedReminder = async (appointment: any): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Draft a personalized, professional, and reassuring health reminder for the following appointment: ${JSON.stringify(appointment)}.
      Keep it brief (max 2 sentences). Include the doctor's name and the scheduled time. Focus on the value of the visit.`,
      config: {
        systemInstruction: "You are an empathetic healthcare coordinator at NextCare AI.",
        temperature: 0.7,
      },
    });
    return response.text || "Just a reminder for your upcoming appointment with NextCare.";
  } catch (error) {
    console.error("Reminder Generation Error:", error);
    return `Reminder: Your appointment with ${appointment.doctorName} is scheduled for ${appointment.time}.`;
  }
};

export const optimizeHealthcareOperations = async (scenario: any, systemState: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform an Operational Optimization for: ${JSON.stringify(scenario)}. Current system state: ${JSON.stringify(systemState)}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategy: { type: Type.STRING },
            resourceShift: { type: Type.STRING },
            efficiencyGain: { type: Type.NUMBER },
            bottlenecks: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["strategy", "resourceShift", "efficiencyGain", "bottlenecks"]
        }
      }
    });

    return JSON.parse(response.text?.trim() || "{}");
  } catch (error) {
    console.error("Optimization Error:", error);
    return null;
  }
};

export const getVehicleStatusReport = async (vehicle: any): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a concise clinical and logistics status report for this medical transport unit: ${JSON.stringify(vehicle)}. 
      Mention the current payload importance and any operational risks based on its maintenance history.`,
      config: {
        temperature: 0.4,
      },
    });
    return response.text || "Status report unavailable.";
  } catch (error) {
    console.error("Error getting vehicle report:", error);
    return "Telemetry sync failed.";
  }
};

export const getTaxonomyConceptExplanation = async (conceptName: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the medical concept: "${conceptName}".`,
      config: { temperature: 0.4 }
    });
    return response.text;
  } catch (error) {
    return "Explanation currently unavailable.";
  }
};

export const analyzeFullSystemLineage = async (node: any, relatedNodes: any[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the operational lineage and systemic impact for this healthcare node: ${JSON.stringify(node)}. 
      Related context: ${JSON.stringify(relatedNodes)}.
      Provide a concise summary of its role in the care network, potential bottlenecks, and optimization vectors.`,
      config: {
        temperature: 0.4,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing system lineage:", error);
    return "Analysis currently unavailable.";
  }
};
