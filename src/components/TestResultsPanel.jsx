import React from "react";

const TestResultsPanel = ({ results, total, passed, metrics }) => (
  <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 text-xs h-full overflow-y-auto">
    <h2 className="text-sm font-semibold text-slate-100 mb-2">
      Test Results
    </h2>
    <p className="text-[11px] text-slate-300 mb-2">
      Public Tests Passed:{" "}
      <span className="font-semibold text-emerald-300">
        {passed} / {total}
      </span>
    </p>
    <div className="space-y-2">
      {results.map(r => (
        <div
          key={r.name}
          className="border border-slate-800 rounded-lg p-2 bg-slate-950"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-slate-100">
              {r.name}
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full ${
                r.passed
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {r.passed ? "PASS" : "FAIL"}
            </span>
          </div>
          {r.error ? (
            <p className="text-[11px] text-red-300">{r.error}</p>
          ) : (
            <p className="text-[11px] text-slate-400">
              got: <code>{JSON.stringify(r.result)}</code> | expected:{" "}
              <code>{JSON.stringify(r.expected)}</code>
            </p>
          )}
        </div>
      ))}
      {results.length === 0 && (
        <p className="text-slate-500 text-[11px]">
          Run tests to see per-test status.
        </p>
      )}
    </div>
    <div className="mt-3 border-t border-slate-800 pt-2 text-[11px] text-slate-400">
      Attempts (runs):{" "}
      <span className="font-semibold">{metrics?.attempts ?? 0}</span>{" "}
      • Hints used:{" "}
      <span className="font-semibold">{metrics?.hintsUsed ?? 0}</span>
    </div>
  </div>
);

export default TestResultsPanel;
