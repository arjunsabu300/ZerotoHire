import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import jobRoutes from "./routes/jobs.js";
import simulationRoutes from "./routes/simulations.js";
import candidateRoutes from "./routes/Candidates.js";
import adminJobRoutes from "./routes/adminJobs.js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/jobs", jobRoutes);
app.use("/api/simulations", simulationRoutes);
app.use("/api/candidates", candidateRoutes);

app.use("/api/admin/jobs", adminJobRoutes);




app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend listening on http://localhost:${PORT}`);
  });
});
