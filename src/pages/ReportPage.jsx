import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../apiClient.js";
import ScoreSummary from "../components/ScoresSummary.jsx";
import CredentialCard from "../components/CredentialCard.jsx";

const ReportPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/simulations/${id}/report`);
        setReport(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return <p className="text-slate-200 text-sm">Loading report...</p>;
  }
  if (!report) {
    return <p className="text-slate-200 text-sm">Report not found.</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-100 mb-1">
            Simulation Report
          </h1>
          <p className="text-xs text-slate-400">
            {report.candidateName} • {report.jobTitle}{" "}
            {report.company && <>@ {report.company}</>}{" "}
            {report.location && <>• {report.location}</>}
          </p>
        </div>
        <Link
          to="/"
          className="px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-200"
        >
          New Simulation
        </Link>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-xs">
        <h2 className="text-sm font-semibold text-slate-100 mb-2">
          Skills & Responsibilities
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <p className="font-semibold text-slate-200 mb-1">Skills</p>
            <div className="flex flex-wrap gap-1">
              {report.skills?.map(s => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-100"
                >
                  {s}
                </span>
              ))}
              {(!report.skills || report.skills.length === 0) && (
                <p className="text-slate-500 text-[11px]">
                  No skills extracted.
                </p>
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold text-slate-200 mb-1">
              Responsibilities
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-1">
              {report.responsibilities?.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
              {(!report.responsibilities ||
                report.responsibilities.length === 0) && (
                <li className="text-slate-500">
                  No responsibilities extracted.
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-3">
          <p className="font-semibold text-slate-200 mb-1">Job Summary</p>
          <p className="text-slate-300 whitespace-pre-wrap">
            {report.jobSummary}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-[2fr,1.6fr] gap-4">
        <ScoreSummary performance={report.performance} />
        <CredentialCard report={report} />
      </div>
    </div>
  );
};

export default ReportPage;
