import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    rawDescription: { type: String, required: true },
    extractedTitle: { type: String },
    company: { type: String },
    location: { type: String },
    skills: [{ type: String }],
    responsibilities: [{ type: String }],
    summary: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
