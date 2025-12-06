import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../apiClient.js";
import JobBreakdownPanel from "../components/JobBreakdownPanel.jsx";

const JobSetupPage = () => {
  const [candidateName, setCandidateName] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [rawDescription, setRawDescription] = useState("");
  const [job, setJob] = useState(null);
  const [loadingJD, setLoadingJD] = useState(false);
  const [creatingSim, setCreatingSim] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const analyzeJD = async e => {
    e.preventDefault();
    setError("");
    if (!rawDescription.trim()) {
      setError("Please paste a job description.");
      return;
    }
    setLoadingJD(true);
    try {
      const res = await api.post("/jobs/analyze", {
        rawDescription,
        company,
        location
      });
      setJob(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to analyze JD");
    } finally {
      setLoadingJD(false);
    }
  };

  const startSimulation = async () => {
    if (!job) {
      setError("Analyze a job first.");
      return;
    }
    if (!candidateName.trim()) {
      setError("Please enter your name (for report).");
      return;
    }
    setError("");
    setCreatingSim(true);
    try {
      const res = await api.post("/simulations", {
        jobId: job._id,
        candidateName
      });
      navigate(`/simulation/${res.data._id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create simulation.");
    } finally {
      setCreatingSim(false);
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl md:text-2xl font-semibold text-slate-100">
        Zero-to-Hired Simulation Setup
      </h1>
      <p className="text-xs md:text-sm text-slate-400">
        Paste any real job description. We’ll break it down, generate one
        coding task, and launch a simulation workspace.
      </p>

      <form
        onSubmit={analyzeJD}
        className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs"
      >
        {error && <p className="text-red-400 text-xs">{error}</p>}

        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="block mb-1 text-slate-300">Your name *</label>
            <input
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs"
              value={candidateName}
              onChange={e => setCandidateName(e.target.value)}
              placeholder="Enter Name"
            />
          </div>
          <div>
            <label className="block mb-1 text-slate-300">Company (optional)</label>
            <input
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Enter Company Name"
            />
          </div>
          <div>
            <label className="block mb-1 text-slate-300">Location (optional)</label>
            <input
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Enter Location"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-slate-300">Job Description *</label>
          <textarea
            rows={8}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs resize-y"
            value={rawDescription}
            onChange={e => setRawDescription(e.target.value)}
            placeholder="Paste the full job description from LinkedIn, Naukri, etc."
          />
        </div>

        <button
          type="submit"
          disabled={loadingJD}
          className="px-4 py-1.5 rounded-full bg-cyan-400 text-slate-950 font-semibold text-xs disabled:opacity-60"
        >
          {loadingJD ? "Analyzing..." : "Analyze Job with AI"}
        </button>
      </form>

      <JobBreakdownPanel job={job} />

      <div className="mt-2">
        <button
          type="button"
          onClick={startSimulation}
          disabled={!job || creatingSim}
          className="px-4 py-1.5 rounded-full bg-emerald-400 text-slate-950 font-semibold text-xs disabled:opacity-50"
        >
          {creatingSim ? "Creating simulation..." : "Start Simulation"}
        </button>
      </div>
    </div>
  );
};

export default JobSetupPage;
