import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // For some reason getGenerativeModel works without network, but actual calls need network.
        // there is no listModels method on genAI instance directly in some versions?
        // Actually it is usually genAI.getGenerativeModel... wait.
        // The REST API has list models.

        // Let's try to fetch via REST text to see raw response if SDK fails
        const key = process.env.GEMINI_API_KEY;
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await res.json();
        if (data.models) {
            console.log("AVAILABLE MODELS:");
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log("ERROR:", JSON.stringify(data));
        }

    } catch (e) {
        console.error(e);
    }
}

listModels();
