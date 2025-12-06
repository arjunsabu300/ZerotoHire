// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

dotenv.config();

if (!process.env.GROQ_API_KEY) {
  console.warn("⚠️ GROQ_API_KEY is not set in .env");
}

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURATION FOR GROQ
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Helper: safely extract JSON from model output
function extractJsonFromText(text) {
  if (!text) throw new Error("Empty response from model");

  // Remove fenced code blocks ```json ... ```
  let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();

  // Try direct parse first
  try {
    return JSON.parse(cleaned);
  } catch (_) {
    // If there's extra text, try to extract the first {...} block
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e2) {
        console.error("JSON parse failed on extracted block:", e2.message);
      }
    }
    console.error("Raw model output that failed JSON parse:", text);
    throw new Error("Model did not return valid JSON");
  }
}

// ROUTE 1: Generate Task
app.post('/api/generate-challenge', async (req, res) => {
  const { jobDescription } = req.body;

  if (!jobDescription || typeof jobDescription !== 'string') {
    return res.status(400).json({ error: "jobDescription is required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a technical hiring manager. " +
            "Analyze the Job Description. Extract 3 critical skills. " +
            "Generate a coding challenge as a *pure JSON* object with fields: " +
            "'title' (string), 'description' (string), 'starterCode' (string). " +
            "Do NOT include any explanation outside the JSON."
        },
        { role: "user", content: `Job Description: ${jobDescription}` },
      ],
      temperature: 0.4,
    });

    const rawContent = completion.choices?.[0]?.message?.content;
    const challenge = extractJsonFromText(rawContent);

    return res.json(challenge);
  } catch (error) {
    console.error("Generate Challenge Error:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate challenge", details: error.message });
  }
});

// ROUTE 2: AI Teammate
app.post('/api/pair-programmer', async (req, res) => {
  const { messages, currentCode } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "messages must be an array" });
  }

  try {
    const systemPrompt = `
You are a Senior Developer pair-programming with a junior dev.
Current User Code (if any):
${currentCode || "No code yet."}

Rules:
- Guide them step-by-step instead of dropping the final solution.
- Ask clarifying questions when needed.
- Keep responses concise, friendly, and encouraging.
- Prefer code snippets with short explanations.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages, // should be [{role: "user"|"assistant"|"system", content: "..."}]
      ],
      temperature: 0.6,
    });

    const reply = completion.choices?.[0]?.message?.content || "";
    return res.json({ reply });
  } catch (error) {
    console.error("AI Teammate Error:", error);
    return res
      .status(500)
      .json({ error: "AI Teammate crashed", details: error.message });
  }
});

// ROUTE 3: Credentialing / Grading
app.post('/api/submit', async (req, res) => {
  const { code, challengeDescription } = req.body;

  if (!code || !challengeDescription) {
    return res
      .status(400)
      .json({ error: "code and challengeDescription are required" });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are an expert code reviewer. " +
            "Evaluate the submission strictly based on correctness, readability, and efficiency. " +
            "Return ONLY a JSON object with fields: " +
            "'score' (0-100 number), 'feedback' (string), 'pass' (boolean). " +
            "No extra text or formatting."
        },
        {
          role: "user",
          content: `Task: ${challengeDescription}\n\nCandidate Code:\n${code}`,
        },
      ],
      temperature: 0.2,
    });

    const rawContent = completion.choices?.[0]?.message?.content;
    const result = extractJsonFromText(rawContent);

    // Optional: basic sanity check
    if (typeof result.score !== "number") {
      throw new Error("Model result missing numeric 'score'");
    }
    if (typeof result.pass !== "boolean") {
      throw new Error("Model result missing boolean 'pass'");
    }

    return res.json(result);
  } catch (error) {
    console.error("Grading Error:", error);
    return res
      .status(500)
      .json({ error: "Grading failed", details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
