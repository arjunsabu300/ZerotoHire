// src/pages/MySimulations.jsx
import React, { useEffect, useState } from "react";
import api from "../apiClient.js";
import { getCandidateName } from "../utils/auth.js";

const MySimulationsPage = () => {
  const [candidateName, setCandidateName] = useState(getCandidateName());
  const [sims, setSims] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!candidateName) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/candidates/${encodeURIComponent(candidateName)}/simulations`
        );
        setSims(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [candidateName]);

  if (!candidateName) {
    return (
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-slate-100">
          Your simulations
        </h1>
        <p className="text-xs text-slate-400">
          Please <a href="/candidate-login" className="text-cyan-400 underline">
            login as candidate
          </a>{" "}
          to see your simulation history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-100">
        Simulations for {candidateName}
      </h1>
      {loading && (
        <p className="text-xs text-slate-400">Loading simulations...</p>
      )}
      <div className="space-y-2 text-xs">
        {sims.map((sim) => (
          <div
            key={sim._id}
            className="border border-slate-800 rounded-xl p-3 bg-slate-900/60 flex justify-between"
          >
            <div>
              <p className="font-semibold text-slate-100">
                {sim.job?.extractedTitle}{" "}
                {sim.job?.company && `@ ${sim.job.company}`}
              </p>
              <p className="text-slate-400">
                {new Date(sim.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-300">
                Score:{" "}
                <span className="font-semibold text-emerald-400">
                  {sim.score ?? 0}
                </span>
              </p>
              <p className="text-slate-400 text-[11px]">
                Attempts: {sim.metrics?.attempts ?? 0} • Hints:{" "}
                {sim.metrics?.hintsUsed ?? 0}
              </p>
              <a
                href={`/report/${sim._id}`}
                className="inline-block mt-1 text-[11px] text-cyan-400 underline"
              >
                View report
              </a>
            </div>
          </div>
        ))}
        {!loading && sims.length === 0 && (
          <p className="text-slate-500 text-[11px]">
            No simulations found yet for this name.
          </p>
        )}
      </div>
    </div>
  );
};

export default MySimulationsPage;
