import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  name: String,
  input: String, // JSON string for args
  expectedOutput: String, // JSON string for expected result
  visibility: { type: String, enum: ["public", "hidden"], default: "public" }
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  functionName: String, // e.g. "solve"
  sampleInput: String,
  sampleOutput: String,
  tests: [testCaseSchema]
});

const metricsSchema = new mongoose.Schema({
  attempts: { type: Number, default: 0 },
  hintsUsed: { type: Number, default: 0 },
  testsPassed: { type: Number, default: 0 },
  totalTests: { type: Number, default: 0 },
  startedAt: { type: Date },
  endedAt: { type: Date }
});

const feedbackSchema = new mongoose.Schema({
  strengths: { type: String },
  improvements: { type: String },
  summary: { type: String }
});

const credentialSchema = new mongoose.Schema({
  credentialId: { type: String },
  createdAt: { type: Date }
});

const simulationSchema = new mongoose.Schema(
  {
    candidateName: { type: String, required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    task: taskSchema,
    latestCode: { type: String, default: "" },
    metrics: metricsSchema,
    score: { type: Number, default: 0 },
    feedback: feedbackSchema,
    credential: credentialSchema,
    status: {
      type: String,
      enum: ["in-progress", "submitted", "scored"],
      default: "in-progress"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Simulation", simulationSchema);
