import express from "express";
import Job from "../models/Job.js";
import { groq, GROQ_MODEL } from "../services/groqClient.js";

const router = express.Router();

/**
 * 1 & 2: Job description input + AI job breakdown
 * POST /api/jobs/analyze
 * body: { rawDescription, company?, location? }
 */
router.post("/analyze", async (req, res) => {
  try {
    const { rawDescription, company, location } = req.body;
    if (!rawDescription) {
      return res.status(400).json({ message: "rawDescription is required" });
    }

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert recruiter. " +
            "Extract from the job description: job_title, skills, responsibilities, and summary. " +
            "Return STRICT JSON: { \"job_title\": string, \"skills\": string[], \"responsibilities\": string[], \"summary\": string }"
        },
        {
          role: "user",
          content: rawDescription
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(completion.choices[0].message.content);

    const job = await Job.create({
      rawDescription,
      extractedTitle: parsed.job_title,
      company: company || "",
      location: location || "",
      skills: parsed.skills || [],
      responsibilities: parsed.responsibilities || [],
      summary: parsed.summary || ""
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("Analyze JD error:", err);
    res.status(500).json({ message: "Failed to analyze job description", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job" });
  }
});

export default router;
