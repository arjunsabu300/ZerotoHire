// src/pages/AdminLoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin, setAdminLoggedIn } from "../utils/auth.js";

const ADMIN_CODE = "admin12345"; // change this for your demo

const AdminLoginPage = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim() === ADMIN_CODE) {
      setAdminLoggedIn(true);
      setError("");
      // After admin login, go to a known job analytics or let them type ID
      navigate("/admin-job-select");
    } else {
      setAdminLoggedIn(false);
      setError("Invalid admin code.");
    }
  };

  if (isAdmin()) {
    // Already logged in
    return (
      <div className="max-w-md mx-auto bg-slate-900/70 border border-slate-800 rounded-2xl p-4 mt-6 text-xs">
        <p className="text-slate-100 mb-2">You are already logged in as admin.</p>
        <button
          onClick={() => navigate("/admin-job-select")}
          className="px-3 py-1.5 rounded-full bg-cyan-400 text-slate-950 text-xs font-semibold"
        >
          Go to Admin Panel
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-slate-900/70 border border-slate-800 rounded-2xl p-4 mt-6 text-xs">
      <h1 className="text-lg font-semibold text-slate-100 mb-2">
        Admin Login
      </h1>
      <p className="text-[11px] text-slate-400 mb-2">
        Enter the admin access code to view job analytics.
      </p>
      {error && <p className="text-red-400 text-[11px] mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block mb-1 text-slate-300">Admin Code</label>
          <input
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="password"
            placeholder="Enter admin code"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-2 px-4 py-1.5 rounded-full bg-emerald-400 text-slate-950 font-semibold text-xs"
        >
          Login as Admin
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
