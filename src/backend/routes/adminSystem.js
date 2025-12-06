// routes/adminSystem.js
import express from "express";
import Job from "../models/Job.js";
import Simulation from "../models/Simulation.js";

const router = express.Router();

router.get("/overview", async (_req, res) => {
  try {
    const [jobCount, simCount] = await Promise.all([
      Job.countDocuments(),
      Simulation.countDocuments()
    ]);

    const hardest = await Simulation.aggregate([
      { $match: { status: "scored" } },
      {
        $group: {
          _id: "$job",
          avgScore: { $avg: "$score" },
          count: { $sum: 1 }
        }
      },
      { $sort: { avgScore: 1 } },
      { $limit: 1 }
    ]);

    res.json({
      jobCount,
      simCount,
      hardestJob: hardest[0] || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch overview" });
  }
});

export default router;
