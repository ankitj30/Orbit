import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Load .env from the same directory as this file (Backend/.env)
dotenv.config({ path: join(__dirname, ".env") });

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ GEMINI_API_KEY not set. Add it to your .env or environment variables.");
  process.exit(1);
}

async function testGemini() {
  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Who is the current Prime Minister of India?" }],
            },
          ],
        }),
      }
    );

    const data = await res.json();
    console.log("✅ Gemini Response:");
    console.log(data?.candidates?.[0]?.content?.parts?.[0]?.text ?? JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

testGemini();
