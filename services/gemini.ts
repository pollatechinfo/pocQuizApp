import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Question } from "../types";

// Retrieve API Key: Supports standard Node process.env (for some setups) and Vite's import.meta.env (for local/Netlify)
// Note: In a Vite setup, you must prefix your .env variable with VITE_ (e.g., VITE_API_KEY)
const apiKey = (import.meta as any).env?.VITE_API_KEY || process.env.API_KEY;

if (!apiKey) {
  console.warn("API Key is missing. AI features will not work.");
}

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

/**
 * Generates a new Multiple Choice question about biodiversity.
 */
export const generateQuestion = async (): Promise<Question> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a multiple choice question about environmental protection, biodiversity, or sustainability. Provide 4 options and a detailed explanation.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questionText: { type: Type.STRING },
            options: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["questionText", "options", "correctIndex", "explanation"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    return {
      id: crypto.randomUUID(),
      type: 'MULTIPLE_CHOICE',
      text: data.questionText,
      options: data.options,
      correctOptionIndex: data.correctIndex,
      explanation: data.explanation
    };

  } catch (error) {
    console.error("Failed to generate question:", error);
    // Fallback question
    return {
      id: 'fallback',
      type: 'MULTIPLE_CHOICE',
      text: 'Which of the following is a primary threat to biodiversity?',
      options: ['Sustainable farming', 'Habitat destruction', 'Recycling', 'Solar energy'],
      correctOptionIndex: 1,
      explanation: 'Habitat destruction is one of the main threats to biodiversity, as it removes the environment that species need to survive.'
    };
  }
};

/**
 * Helper: Decode Base64 audio string to AudioBuffer
 */
async function decodeAudioData(
  base64String: string,
  audioContext: AudioContext
): Promise<AudioBuffer> {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return await audioContext.decodeAudioData(bytes.buffer);
}

/**
 * Generates speech for the explanation using Gemini TTS
 */
export const generateExplanationAudio = async (text: string): Promise<AudioBuffer | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Deep, narrator-like voice
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) throw new Error("No audio data received");

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    return await decodeAudioData(base64Audio, audioContext);

  } catch (error) {
    console.error("TTS Generation failed:", error);
    return null;
  }
};