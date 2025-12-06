import express from "express";
import mongoose from "mongoose";    // ✅ ADD THIS
import Simulation from "../models/Simulation.js";

const router = express.Router();

// GET /api/admin/jobs/:jobId/analytics
router.get("/:jobId/analytics", async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const sims = await Simulation.aggregate([
      { $match: { job: new mongoose.Types.ObjectId(jobId), status: "scored" } },
      {
        $group: {
          _id: "$job",
          count: { $sum: 1 },
          avgScore: { $avg: "$score" },
          avgAttempts: { $avg: "$metrics.attempts" },
          avgHints: { $avg: "$metrics.hintsUsed" },
          avgTestsPassed: { $avg: "$metrics.testsPassed" },
          avgTotalTests: { $avg: "$metrics.totalTests" }
        }
      }
    ]);

    const stats = sims[0] || {
      count: 0,
      avgScore: null,
      avgAttempts: null,
      avgHints: null,
      avgTestsPassed: null,
      avgTotalTests: null
    };

    const topCandidates = await Simulation.find({ job: jobId, status: "scored" })
      .sort({ score: -1 })
      .limit(10)
      .select("candidateName score metrics.hintsUsed metrics.attempts credential.job createdAt");

    res.json({ stats, topCandidates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch job analytics" });
  }
});

export default router;
