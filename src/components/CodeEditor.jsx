import React from "react";

const CodeEditor = ({ value, onChange }) => (
  <textarea
    className="w-full h-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs font-mono text-slate-100 resize-none"
    spellCheck={false}
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={`// Write your solution in JavaScript.\n// Implement function solve(...) { ... }\n`}
  />
);

export default CodeEditor;
