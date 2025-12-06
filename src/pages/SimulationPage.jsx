import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../apiClient.js";
import TaskPanel from "../components/Taskpanel.jsx";
import CodeEditor from "../components/CodeEditor.jsx";
import TestResultsPanel from "../components/TestResultsPanel.jsx";
import HintChatPanel from "../components/HintChatPanel.jsx";

const SimulationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [simulation, setSimulation] = useState(null);
  const [code, setCode] = useState("");
  const [testResults, setTestResults] = useState([]);
  const [testStats, setTestStats] = useState({ total: 0, passed: 0 });
  const [metrics, setMetrics] = useState(null);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/simulations/${id}`);
        setSimulation(res.data);
        setMetrics(res.data.metrics);
        setCode(
          res.data.latestCode ||
            `function solve() {\n  // TODO: implement\n}\n`
        );
      } catch (err) {
        console.error(err);
        alert("Failed to load simulation");
      }
    };
    load();
  }, [id]);

  const runTests = async () => {
    if (!simulation) return;
    setRunning(true);
    try {
      const res = await api.post(`/simulations/${simulation._id}/run`, {
        code
      });
      setTestResults(res.data.publicResults || []);
      setTestStats({ total: res.data.total, passed: res.data.passed });
      setMetrics(prev => ({
        ...(prev || {}),
        attempts: (prev?.attempts || 0) + 1
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to run tests");
    } finally {
      setRunning(false);
    }
  };

  const submitSolution = async () => {
    if (!window.confirm("Submit your solution and generate scorecard?")) return;
    setSubmitting(true);
    try {
      await api.post(`/simulations/${simulation._id}/submit`, { code });
      navigate(`/report/${simulation._id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to submit solution");
    } finally {
      setSubmitting(false);
    }
  };

  const handleHintUsed = () => {
    setMetrics(prev => ({
      ...(prev || {}),
      hintsUsed: (prev?.hintsUsed || 0) + 1
    }));
  };

  if (!simulation) {
    return (
      <div className="text-sm text-slate-200">Loading simulation...</div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1.4fr,2.2fr,1.4fr] gap-4 h-[calc(100vh-7rem)]">
      <TaskPanel job={simulation.job} task={simulation.task} />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs">
          <div>
            <p className="font-semibold text-slate-100">
              Coding Workspace
            </p>
            <p className="text-slate-400 text-[11px]">
              Implement <code className="font-mono">solve(...)</code> and run tests.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={runTests}
              disabled={running}
              className="px-3 py-1.5 rounded-full bg-cyan-400 text-slate-950 text-[11px] font-semibold disabled:opacity-50"
            >
              {running ? "Running..." : "Run Tests"}
            </button>
            <button
              onClick={submitSolution}
              disabled={submitting}
              className="px-3 py-1.5 rounded-full bg-emerald-400 text-slate-950 text-[11px] font-semibold disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit & Score"}
            </button>
          </div>
        </div>
        <div className="flex-1">
          <CodeEditor value={code} onChange={setCode} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <TestResultsPanel
          results={testResults}
          total={testStats.total}
          passed={testStats.passed}
          metrics={metrics}
        />
        <HintChatPanel
          simulationId={simulation._id}
          currentCode={code}
          onHintUsed={handleHintUsed}
        />
      </div>
    </div>
  );
};

export default SimulationPage;
