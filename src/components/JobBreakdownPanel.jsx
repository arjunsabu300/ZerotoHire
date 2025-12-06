import React from "react";

const JobBreakdownPanel = ({ job }) => {
  if (!job) return null;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-xs space-y-3 mt-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-100 mb-1">
          AI Job Breakdown
        </h2>
        <p className="text-slate-300 font-medium">
          {job.extractedTitle || "Job Title"}
        </p>
        <p className="text-slate-400">
          {job.company || "Company"}{" "}
          {job.location && <>• {job.location}</>}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-slate-200 mb-1">Summary</h3>
        <p className="text-slate-300 whitespace-pre-wrap">
          {job.summary}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <h3 className="font-semibold text-slate-200 mb-1">Key skills</h3>
          <div className="flex flex-wrap gap-1">
            {job.skills?.map(s => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-100"
              >
                {s}
              </span>
            ))}
            {(!job.skills || job.skills.length === 0) && (
              <p className="text-slate-500 text-[11px]">
                No skills extracted.
              </p>
            )}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-slate-200 mb-1">Responsibilities</h3>
          <ul className="list-disc list-inside text-slate-300 space-y-1">
            {job.responsibilities?.map((r, idx) => (
              <li key={idx}>{r}</li>
            ))}
            {(!job.responsibilities || job.responsibilities.length === 0) && (
              <li className="text-slate-500">No responsibilities extracted.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobBreakdownPanel;
