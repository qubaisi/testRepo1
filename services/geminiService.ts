
import { GoogleGenAI } from "@google/genai";

// Initialize with a named parameter as required by guidelines.
// Always use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLivestockAdvice = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: `You are an expert Egyptian Livestock Advisor for "Udhiya". 
        Your goal is to help users in Cairo choose between different types of sheep (Rahmani, Barki, Saidi) and calves (Baladi, Friesian) specifically for Eid al-Adha.
        Advise them on:
        1. Sharia-compliant sacrifice requirements (age, health, etc.).
        2. Whether to buy Alive or Slaughtered based on their family size and logistical capacity.
        3. Expected meat yield and the best day of Eid to schedule delivery.
        Always be polite, professional, and culturally aware of Egyptian and Islamic traditions. Keep responses concise and in bullet points if possible.`,
        temperature: 0.7,
      },
    });
    // Use .text property directly, not as a method.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to my livestock knowledge base. Please try again later!";
  }
};
