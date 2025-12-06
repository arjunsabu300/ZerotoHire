import React from "react";

const CredentialCard = ({ report }) => {
  if (!report?.credential) return null;

  const { credentialId, createdAt } = report.credential;
  const shareUrl = window.location.href;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${credentialId || "credential"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/70 border border-emerald-500/40 rounded-2xl p-4 text-xs space-y-3">
      <h2 className="text-sm font-semibold text-slate-100 mb-1">
        Credential / Report
      </h2>
      <p className="text-slate-300">
        Candidate:{" "}
        <span className="font-semibold">
          {report.candidateName}
        </span>
      </p>
      <p className="text-slate-300">
        Simulated Role:{" "}
        <span className="font-semibold">
          {report.jobTitle}
        </span>
      </p>
      <p className="text-slate-300">
        Credential ID:{" "}
        <span className="font-mono text-[11px]">
          {credentialId}
        </span>
      </p>
      <p className="text-slate-400 text-[11px]">
        Issued at: {createdAt && new Date(createdAt).toLocaleString()}
      </p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={copyLink}
          className="px-3 py-1.5 rounded-full bg-slate-800 text-slate-100 text-[11px]"
        >
          Copy Share Link
        </button>
        <button
          onClick={downloadJSON}
          className="px-3 py-1.5 rounded-full bg-emerald-400 text-slate-950 text-[11px] font-semibold"
        >
          Download JSON
        </button>
      </div>
      <p className="text-[11px] text-slate-500">
        This credential bundles job breakdown, skills, task performance and AI-generated feedback.
        Employers can use the ID to cross-check in an admin panel later.
      </p>
    </div>
  );
};

export default CredentialCard;
