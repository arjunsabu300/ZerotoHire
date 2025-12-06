import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../apiClient.js";
import { isAdmin } from "../utils/auth.js";

const AdminJobAnalyticsPage = () => {
  const { id } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/admin/jobs/${id}/analytics`);
        setAnalytics(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load analytics");
      }
    };

    if (isAdmin()) {
      load();
    }
  }, [id]);

  if (!isAdmin()) {
    return (
      <p className="text-xs text-slate-400">
        You must{" "}
        <a href="/admin-login" className="text-cyan-400 underline">
          login as admin
        </a>{" "}
        to view job analytics.
      </p>
    );
  }

  if (error) {
    return <p className="text-xs text-red-400">{error}</p>;
  }

  if (!analytics) return <p className="text-slate-200 text-sm">Loading...</p>;

  const { stats, topCandidates } = analytics;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-100">
        Job Analytics
      </h1>
      <div className="grid md:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <p className="text-slate-400">Total simulations</p>
          <p className="text-2xl font-bold text-slate-100">{stats.count}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <p className="text-slate-400">Avg score</p>
          <p className="text-2xl font-bold text-emerald-400">
            {stats.avgScore ? stats.avgScore.toFixed(1) : "-"}
          </p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
          <p className="text-slate-400">Avg attempts / hints</p>
          <p className="text-sm text-slate-200">
            {stats.avgAttempts?.toFixed(1) ?? "-"} runs •{" "}
            {stats.avgHints?.toFixed(1) ?? "-"} hints
          </p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs">
        <h2 className="text-sm font-semibold text-slate-100 mb-2">
          Top candidates
        </h2>
        <div className="space-y-1">
          {topCandidates.map((c) => (
            <div
              key={c._id}
              className="flex justify-between items-center border border-slate-800 rounded-lg px-2 py-1.5 bg-slate-950"
            >
              <div>
                <p className="font-semibold text-slate-100">
                  {c.candidateName}
                </p>
                <p className="text-[11px] text-slate-400">
                  Attempts: {c.metrics?.attempts ?? 0} • Hints:{" "}
                  {c.metrics?.hintsUsed ?? 0}
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-300 text-sm">
                  Score:{" "}
                  <span className="text-emerald-400 font-semibold">
                    {c.score}
                  </span>
                </p>
                <a
                  href={`/report/${c._id}`}
                  className="text-[11px] text-cyan-400 underline"
                >
                  View report
                </a>
              </div>
            </div>
          ))}
          {topCandidates.length === 0 && (
            <p className="text-slate-500 text-[11px]">
              No completed simulations yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminJobAnalyticsPage;
