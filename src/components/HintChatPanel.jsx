import React, { useState } from "react";
import api from "../apiClient.js";

const HintChatPanel = ({ simulationId, currentCode, onHintUsed }) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const askHint = async e => {
    e.preventDefault();
    if (!question.trim()) return;
    const q = question.trim();
    setQuestion("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);
    try {
      const res = await api.post(`/simulations/${simulationId}/hint`, {
        question: q,
        code: currentCode
      });
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: res.data.hint }
      ]);
      onHintUsed?.();
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong getting a hint. Try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 text-xs h-full flex flex-col">
      <h2 className="text-sm font-semibold text-slate-100 mb-1">
        AI Helper (Hints Only)
      </h2>
      <p className="text-[11px] text-slate-400 mb-2">
        Ask conceptual questions or request nudges. The AI will never give the full solution.
      </p>
      <div className="flex-1 overflow-y-auto space-y-2 mb-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`max-w-[90%] px-2 py-1.5 rounded-lg ${
              m.role === "user"
                ? "ml-auto bg-cyan-500/20 text-cyan-100"
                : "mr-auto bg-slate-800 text-slate-100"
            }`}
          >
            {m.content}
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-slate-500 text-[11px]">
            Example: "I'm stuck on edge cases for negative numbers. Any hints?"
          </p>
        )}
      </div>
      <form onSubmit={askHint} className="flex gap-2">
        <input
          className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-3 py-1.5 text-[11px]"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask for a hint..."
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 rounded-full bg-violet-400 text-slate-950 text-[11px] font-semibold disabled:opacity-50"
        >
          {loading ? "..." : "Hint"}
        </button>
      </form>
    </div>
  );
};

export default HintChatPanel;
