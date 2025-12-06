import React from "react";

const ScoreSummary = ({ performance }) => {
  if (!performance) return null;
  const { score, metrics, feedback } = performance;

  const durationMinutes =
    metrics?.startedAt && metrics?.endedAt
      ? Math.max(
          0,
          Math.round(
            (new Date(metrics.endedAt) - new Date(metrics.startedAt)) / 60000
          )
        )
      : null;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-xs space-y-3">
      <h2 className="text-sm font-semibold text-slate-100 mb-1">
        Automatic Scorecard
      </h2>
      <p className="text-slate-300">
        Overall Score:{" "}
        <span className="text-emerald-400 font-semibold text-base">
          {score ?? 0} / 100
        </span>
      </p>
      <div className="grid md:grid-cols-3 gap-2 text-[11px] text-slate-300">
        <div>
          <p>Tests Passed</p>
          <p className="font-semibold">
            {metrics?.testsPassed ?? 0} / {metrics?.totalTests ?? 0}
          </p>
        </div>
        <div>
          <p>Attempts (Runs)</p>
          <p className="font-semibold">{metrics?.attempts ?? 0}</p>
        </div>
        <div>
          <p>Hints Used</p>
          <p className="font-semibold">{metrics?.hintsUsed ?? 0}</p>
        </div>
        {durationMinutes !== null && (
          <div>
            <p>Duration</p>
            <p className="font-semibold">{durationMinutes} min</p>
          </div>
        )}
      </div>
      <div className="mt-2 text-[11px] text-slate-300 space-y-2">
        <div>
          <p className="font-semibold text-slate-200 mb-1">Strengths</p>
          <p className="whitespace-pre-wrap">
            {feedback?.strengths || "N/A"}
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-200 mb-1">Improvements</p>
          <p className="whitespace-pre-wrap">
            {feedback?.improvements || "N/A"}
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-200 mb-1">Summary</p>
          <p>{feedback?.summary || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreSummary;
