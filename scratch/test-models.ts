import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function runTest() {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_GENAI_API_KEY is not set");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-flash-latest",
    "gemini-1.5-pro",
    "gemini-pro"
  ];

  for (const modelName of modelsToTest) {
    console.log(`\n--- Testing ${modelName} ---`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say 'System OK'");
      console.log(`Result: ${result.response.text()}`);
    } catch (e: any) {
      console.error(`Error: ${e.message}`);
    }
  }
}

runTest();
