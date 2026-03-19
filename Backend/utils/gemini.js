import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI;

const fetchGeminiResponse = async (message) => {
  if (!process.env.GEMINI_API_KEY) {
    console.error("Missing GEMINI_API_KEY in environment variables.");
    throw new Error("GEMINI_API_KEY is not defined");
  }

  // Singleton instance
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Generate content
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return text;

  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw error;
  }
};

export default fetchGeminiResponse;