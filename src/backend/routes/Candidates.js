// routes/candidates.js (new file)
import express from "express";
import Simulation from "../models/Simulation.js";

const router = express.Router();

// Simple version, filter by candidateName
router.get("/:candidateName/simulations", async (req, res) => {
  try {
    const sims = await Simulation.find({
      candidateName: req.params.candidateName
    })
      .populate("job")
      .sort({ createdAt: -1 });

    res.json(sims);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch simulations" });
  }
});

export default router;
