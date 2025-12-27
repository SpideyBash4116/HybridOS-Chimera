
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askGemini = async (prompt: string, context: string = '') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an AI assistant integrated into "HybridOS Chimera". 
      Context: ${context}
      User Query: ${prompt}`,
      config: {
        systemInstruction: "You are an AI assistant integrated into HybridOS Chimera. Keep responses helpful, slightly techy, and in the persona of a sleek system assistant.",
        temperature: 0.7,
      }
    });
    return response.text || "I'm having trouble connecting to my brain modules right now.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The kernel panicked while processing your request. Please try again.";
  }
};

export const globalSearch = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a global system search for: "${query}". 
      Return a JSON array of max 3 items with: { "type": "app" | "web" | "file", "title": "string", "description": "string" }`,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are the HybridOS Spotlight search engine. Return concise, relevant search results.",
      }
    });
    return JSON.parse(response.text);
  } catch {
    return [];
  }
}

export const simulateWebpage = async (urlOrQuery: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate the content for a simulated webpage based on this request: "${urlOrQuery}".
      Format the output as a structured JSON object with:
      {
        "title": "Page Title",
        "description": "Brief description",
        "content": "Rich markdown content with headers and lists",
        "sidebar": ["link 1", "link 2"],
        "accentColor": "hex code"
      }`,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a web rendering engine for HybridOS. Create realistic, helpful, and visually interesting 'simulated' webpage data.",
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Web Simulation Error:", error);
    return {
      title: "Error 404",
      content: "The Hybrid-Link could not establish a connection to this domain. The AI kernel suggests checking your syntax.",
      accentColor: "#ef4444"
    };
  }
};
