import express from "express";
import crypto from "crypto";
import Job from "../models/Job.js";
import Simulation from "../models/Simulation.js";
import { groq, GROQ_MODEL } from "../services/groqClient.js";
import { runAllTests } from "../services/evaluator.js";

const router = express.Router();

/**
 * Helper: ask LLM to generate single coding task from JD
 */
async function generateTaskFromJD(job) {
  const prompt = `
Job Title: ${job.extractedTitle}
Company: ${job.company}
Location: ${job.location}
Summary: ${job.summary}
Skills: ${job.skills.join(", ")}

Design a single coding problem relevant to this job.
The candidate will implement a JavaScript function called "solve".

Return STRICT JSON of this shape:

{
  "title": "string",
  "description": "long markdown-style text",
  "sample_input": <JSON value for sample input>,
  "sample_output": <JSON value for sample output>,
  "tests": [
    {
      "name": "string",
      "input": <JSON value passed to solve>,
      "expected_output": <JSON value>,
      "visibility": "public" | "hidden"
    }
  ]
}

Rules:
- 'input' and 'expected_output' must be valid JSON values (numbers, strings, arrays, objects).
- Use at least 4 tests, with 2 public and 2 hidden.
- Do NOT wrap the JSON in backticks.
`;

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: "system", content: "You are a senior developer creating coding tasks." },
      { role: "user", content: prompt }
    ],
    temperature: 0.4,
    response_format: { type: "json_object" }
  });

  const parsed = JSON.parse(completion.choices[0].message.content);

  return {
    title: parsed.title,
    description: parsed.description,
    functionName: "solve",
    sampleInput: JSON.stringify(parsed.sample_input),
    sampleOutput: JSON.stringify(parsed.sample_output),
    tests: (parsed.tests || []).map(t => ({
      name: t.name,
      input: JSON.stringify(t.input),
      expectedOutput: JSON.stringify(t.expected_output),
      visibility: t.visibility === "hidden" ? "hidden" : "public"
    }))
  };
}

/**
 * 3. Create simulation (generates the AI coding task)
 * POST /api/simulations
 * body: { jobId, candidateName }
 */
router.post("/", async (req, res) => {
  try {
    const { jobId, candidateName } = req.body;
    if (!jobId || !candidateName) {
      return res.status(400).json({ message: "jobId and candidateName are required" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const task = await generateTaskFromJD(job);

    const simulation = await Simulation.create({
      candidateName,
      job: job._id,
      task,
      metrics: {
        attempts: 0,
        hintsUsed: 0,
        testsPassed: 0,
        totalTests: task.tests.length,
        startedAt: new Date()
      },
      latestCode: ""
    });

    const populated = await Simulation.findById(simulation._id).populate("job");

    const obj = populated.toObject();
    obj.task.tests = obj.task.tests.map(t =>
      t.visibility === "hidden"
        ? { ...t, expectedOutput: null } // hide expected output
        : t
    );

    res.status(201).json(obj);
  } catch (err) {
    console.error("Create simulation error:", err);
    res.status(500).json({ message: "Failed to create simulation", error: err.message });
  }
});

/**
 * GET /api/simulations/:id
 * Returns simulation with job, hiding hidden expectedOutput
 */
router.get("/:id", async (req, res) => {
  try {
    const sim = await Simulation.findById(req.params.id).populate("job");
    if (!sim) return res.status(404).json({ message: "Simulation not found" });

    const obj = sim.toObject();
    if (obj.task && obj.task.tests) {
      obj.task.tests = obj.task.tests.map(t =>
        t.visibility === "hidden" ? { ...t, expectedOutput: null } : t
      );
    }
    res.json(obj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching simulation" });
  }
});

/**
 * 4(a,c): Run tests + attempts tracking
 * POST /api/simulations/:id/run
 * body: { code }
 */
router.post("/:id/run", async (req, res) => {
  try {
    const { code } = req.body;
    const sim = await Simulation.findById(req.params.id);
    if (!sim) return res.status(404).json({ message: "Simulation not found" });

    const task = sim.task;
    if (!task) return res.status(400).json({ message: "Task not generated" });

    const { total, passed, results } = runAllTests(code || "", task.functionName, task.tests);

    sim.metrics.attempts = (sim.metrics.attempts || 0) + 1;
    sim.metrics.testsPassed = passed;
    sim.metrics.totalTests = total;
    sim.latestCode = code || "";
    await sim.save();

    const publicResults = results
      .filter(r => r.visibility === "public")
      .map(r => ({
        name: r.name,
        passed: r.passed,
        error: r.error,
        result: r.result,
        expected: r.expected
      }));

    res.json({
      total,
      passed,
      publicResults
    });
  } catch (err) {
    console.error("Run tests error:", err);
    res.status(500).json({ message: "Failed to run tests", error: err.message });
  }
});

/**
 * 4(b): AI Helper Chat (hint-only)
 * POST /api/simulations/:id/hint
 * body: { question, code }
 */
router.post("/:id/hint", async (req, res) => {
  try {
    const { question, code } = req.body;
    const sim = await Simulation.findById(req.params.id).populate("job");
    if (!sim) return res.status(404).json({ message: "Simulation not found" });

    sim.metrics.hintsUsed = (sim.metrics.hintsUsed || 0) + 1;
    await sim.save();

    const prompt = `
You are a hint-only coding mentor.
Task title: ${sim.task.title}
Task description: ${sim.task.description}

User's current question:
${question}

User's current code (if any):
${code || "(no code yet)"}

Rules:
- Give only hints and nudges.
- Do NOT provide the full final solution or full code.
- You may suggest partial pseudocode or point out concepts, edge cases and common bugs.
`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: "You are a strict hint-only mentor, never reveal the full solution." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5
    });

    const hint = completion.choices[0].message.content;
    res.json({ hint });
  } catch (err) {
    console.error("Hint error:", err);
    res.status(500).json({ message: "Failed to get hint", error: err.message });
  }
});

/**
 * 5 & 6: Submit solution → scorecard + credential
 * POST /api/simulations/:id/submit
 * body: { code }
 */
router.post("/:id/submit", async (req, res) => {
  try {
    const { code } = req.body;
    const sim = await Simulation.findById(req.params.id).populate("job");
    if (!sim) return res.status(404).json({ message: "Simulation not found" });

    const task = sim.task;
    const { total, passed } = runAllTests(code || "", task.functionName, task.tests);

    const attempts = sim.metrics.attempts || 0;
    const hintsUsed = sim.metrics.hintsUsed || 0;

    let baseScore = total > 0 ? Math.round((passed / total) * 100) : 0;
    const penalty = hintsUsed * 5 + Math.max(0, attempts - 1) * 2;
    const finalScore = Math.max(0, baseScore - penalty);

    const feedbackPrompt = `
You are a senior interviewer summarizing a candidate's performance.

Job Title: ${sim.job.extractedTitle}
Skills: ${sim.job.skills.join(", ")}

Task: ${task.title}
Task Description: ${task.description}

Test results:
- Total tests: ${total}
- Passed: ${passed}
- Attempts (runs): ${attempts}
- Hints used: ${hintsUsed}
- Final score: ${finalScore}

Candidate code:
${code || "(no code provided)"}

Return STRICT JSON:
{
  "strengths": "bullet-style or paragraph text",
  "improvements": "bullet-style or paragraph text",
  "summary": "short overall sentence"
}
`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: "You provide concise performance feedback." },
        { role: "user", content: feedbackPrompt }
      ],
      temperature: 0.4,
      response_format: { type: "json_object" }
    });

    const fb = JSON.parse(completion.choices[0].message.content);

    sim.metrics.testsPassed = passed;
    sim.metrics.totalTests = total;
    sim.metrics.endedAt = new Date();
    sim.latestCode = code || "";
    sim.score = finalScore;
    sim.feedback = {
      strengths: fb.strengths,
      improvements: fb.improvements,
      summary: fb.summary
    };
    sim.status = "scored";

    const credentialId =
      sim.credential?.credentialId ||
      `Z2H-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    sim.credential = {
      credentialId,
      createdAt: sim.credential?.createdAt || new Date()
    };

    await sim.save();

    res.json({
      simulationId: sim._id,
      score: finalScore,
      metrics: sim.metrics,
      feedback: sim.feedback,
      credentialId
    });
  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ message: "Failed to submit simulation", error: err.message });
  }
});

/**
 * 6: Credential / Report
 * GET /api/simulations/:id/report
 */
router.get("/:id/report", async (req, res) => {
  try {
    const sim = await Simulation.findById(req.params.id).populate("job");
    if (!sim) return res.status(404).json({ message: "Simulation not found" });

    res.json({
      candidateName: sim.candidateName,
      jobTitle: sim.job.extractedTitle,
      company: sim.job.company,
      location: sim.job.location,
      skills: sim.job.skills,
      responsibilities: sim.job.responsibilities,
      performance: {
        score: sim.score,
        metrics: sim.metrics,
        feedback: sim.feedback
      },
      credential: sim.credential,
      jobSummary: sim.job.summary
    });
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ message: "Failed to fetch report", error: err.message });
  }
});

export default router;
