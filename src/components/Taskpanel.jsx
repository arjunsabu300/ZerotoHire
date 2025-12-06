import React from "react";

const TaskPanel = ({ job, task }) => {
  if (!task) return null;
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 text-xs h-full overflow-y-auto">
      <h2 className="text-sm font-semibold text-slate-100 mb-1">
        {task.title}
      </h2>
      <p className="text-[11px] text-slate-400 mb-2">
        Job: {job?.extractedTitle} {job?.company && `• ${job.company}`}
      </p>
      <div className="text-slate-300 whitespace-pre-wrap mb-3">
        {task.description}
      </div>
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-2">
        <h3 className="font-semibold text-slate-200 mb-1 text-xs">
          Sample I/O (JS)
        </h3>
        <p className="text-[11px] text-slate-400">Input:</p>
        <pre className="text-[11px] bg-slate-900 rounded p-1 mt-1 overflow-x-auto">
          {task.sampleInput}
        </pre>
        <p className="text-[11px] text-slate-400 mt-2">Output:</p>
        <pre className="text-[11px] bg-slate-900 rounded p-1 mt-1 overflow-x-auto">
          {task.sampleOutput}
        </pre>
        <p className="mt-2 text-[11px] text-slate-500">
          Implement: <code className="font-mono">function solve(...args) {'{'}/* ... */{'}'}</code>
        </p>
      </div>
    </div>
  );
};

export default TaskPanel;
