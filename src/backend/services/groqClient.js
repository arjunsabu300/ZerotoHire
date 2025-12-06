import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  console.warn("⚠️ GROQ_API_KEY missing in .env");
}

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export const GROQ_MODEL =
  process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
