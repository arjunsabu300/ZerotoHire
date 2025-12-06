// src/pages/AdminJobSelectPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin } from "../utils/auth.js";

const AdminJobSelectPage = () => {
  const [jobId, setJobId] = useState("");
  const navigate = useNavigate();

  if (!isAdmin()) {
    return (
      <p className="text-xs text-slate-400">
        You must login as admin to access this page.
      </p>
    );
  }

  const handleGo = (e) => {
    e.preventDefault();
    const trimmed = jobId.trim();
    if (!trimmed) return;
    navigate(`/admin/job/${trimmed}`);
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900/70 border border-slate-800 rounded-2xl p-4 mt-6 text-xs">
      <h1 className="text-lg font-semibold text-slate-100 mb-2">
        Admin – View Job Analytics
      </h1>
      <p className="text-[11px] text-slate-400 mb-2">
        Enter a Job ID from the database to see simulations, scores and top candidates.
      </p>
      <form onSubmit={handleGo} className="space-y-3">
        <div>
          <label className="block mb-1 text-slate-300">Job ID</label>
          <input
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            placeholder="e.g. 6933dd49ba75fa75c9ea092d"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-2 px-4 py-1.5 rounded-full bg-cyan-400 text-slate-950 font-semibold text-xs"
        >
          View Analytics
        </button>
      </form>
    </div>
  );
};

export default AdminJobSelectPage;
