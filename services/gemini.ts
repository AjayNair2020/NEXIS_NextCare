
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHealthAssistantResponse = async (prompt: string, history: { role: string; parts: { text: string }[] }[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `You are NextCare AI, an advanced, professional, and empathetic medical assistant. 
        Your goal is to help users understand health concepts, analyze potential symptoms, and provide wellness advice.
        
        CRITICAL RULES:
        1. Always include a disclaimer that you are an AI and not a substitute for professional medical advice.
        2. Be concise but informative.
        3. If symptoms sound severe (chest pain, stroke symptoms, etc.), urge the user to seek emergency medical care immediately.
        4. Use supportive, empathetic language.
        5. Format your response with clear headings or bullet points if necessary.`,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error while trying to assist you. Please try again in a moment.";
  }
};

export const getFacilityDetails = async (facilityName: string, location: { latitude: number, longitude: number }) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find details about ${facilityName} including its address, services, and current patient reviews.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          }
        }
      },
    });

    return {
      text: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return null;
  }
};

export const analyzeIncidentLineage = async (incident: any, lineage: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this health incident spread: ${JSON.stringify(incident)}.
      The known lineage is: ${JSON.stringify(lineage)}.
      Explain the likely causal factors for this spread, the speed of transmission, and recommended public health actions for this specific cluster.`,
      config: {
        temperature: 0.5,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Lineage Analysis Error:", error);
    return "Lineage analysis currently unavailable.";
  }
};

export const getTaxonomyConceptExplanation = async (conceptName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the medical concept: "${conceptName}". 
      Include: 
      1. Clinical definition
      2. Key symptoms
      3. Common transmission or causal routes
      4. Prevention strategies.
      Keep it professional and concise.`,
      config: {
        temperature: 0.4,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Taxonomy Explanation Error:", error);
    return "Explanation currently unavailable.";
  }
};
