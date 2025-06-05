
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Flashcard } from '../types';
import { GEMINI_TEXT_MODEL } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn(
    "API_KEY for Gemini is not set. AI features will be disabled. Ensure process.env.API_KEY is configured."
  );
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const geminiService = {
  isConfigured: (): boolean => !!ai,

  generateFlashcards: async (topic: string, numberOfCards: number): Promise<Flashcard[]> => {
    if (!ai) {
      throw new Error("Gemini API key not configured. Cannot generate flashcards.");
    }

    const prompt = `Generate ${numberOfCards} flashcards about "${topic}". Each flashcard MUST have a "question" (string) and an "answer" (string).
Return the result as a VALID JSON array of objects. Each object in the array MUST have exactly two keys: "question" and "answer".
The entire response MUST be ONLY the JSON array itself, without any markdown fences, comments, or other text.
Example of a single object within the array: {"question": "Sample Question?", "answer": "Sample Answer"}
Ensure no trailing commas in objects or in the array. The JSON must be syntactically perfect.`;

    let genAIResponse: GenerateContentResponse | undefined;

    try {
      genAIResponse = await ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.6, // Slightly reduced temperature for potentially more structured output
        },
      });
      
      let jsonStr = genAIResponse.text.trim();
      // The regex for stripping markdown fences is still useful as a fallback,
      // although ideally, with responseMimeType: "application/json" and a good prompt, it's not strictly needed.
      const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[2]) {
        jsonStr = match[2].trim();
      }

      const parsedData = JSON.parse(jsonStr);

      if (Array.isArray(parsedData) && parsedData.every(item => typeof item.question === 'string' && typeof item.answer === 'string')) {
        return parsedData.map((item, index) => ({
          id: `ai-${Date.now()}-${index}`, // Simple unique ID
          question: item.question,
          answer: item.answer,
        }));
      } else {
        console.error("AI response was not in the expected format:", parsedData);
        throw new Error("AI response was not in the expected format. Please try a different topic or number of cards.");
      }
    } catch (error) {
      console.error("Error generating flashcards with Gemini:", error);
      console.error("Received string that failed to parse:", genAIResponse?.text); // Log the problematic string
      if (error instanceof Error) {
        // Provide a more specific error message if it's a JSON parsing error.
        if (error.message.includes("JSON")) {
            throw new Error(`Failed to parse AI response as JSON. The AI may have returned an invalid format. Details: ${error.message}`);
        }
        throw new Error(`Failed to generate flashcards: ${error.message}`);
      }
      throw new Error("An unknown error occurred while generating flashcards.");
    }
  },
};
