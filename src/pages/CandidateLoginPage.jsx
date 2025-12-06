// src/pages/CandidateLoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCandidateName } from "../utils/auth.js";

const CandidateLoginPage = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }
    setCandidateName(trimmed);
    // After login, go to My Simulations or Home
    navigate("/me");
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900/70 border border-slate-800 rounded-2xl p-4 mt-6 text-xs">
      <h1 className="text-lg font-semibold text-slate-100 mb-2">
        Candidate Login
      </h1>
      <p className="text-[11px] text-slate-400 mb-2">
        Enter your name. We’ll use this to show your simulation history.
      </p>
      {error && <p className="text-red-400 text-[11px] mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1 text-slate-300">Name</label>
          <input
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Arjun Sabu"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-2 px-4 py-1.5 rounded-full bg-cyan-400 text-slate-950 font-semibold text-xs"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default CandidateLoginPage;
