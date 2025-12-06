import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const API_URL = "http://localhost:5000/api";

function App() {
  const [step, setStep] = useState(1); // 1: Job Input, 2: Simulation, 3: Result
  const [jobDesc, setJobDesc] = useState('');
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Step 1: Generate Challenge
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/generate-challenge`, { jobDescription: jobDesc });
      setChallenge(res.data);
      setCode(res.data.starterCode || '// Start coding here...');
      setStep(2);
    } catch (err) { alert("Error generating challenge"); }
    setLoading(false);
  };

  // Step 2: Chat with AI Teammate
  const handleChat = async () => {
    if (!chatInput) return;
    const newHistory = [...chatHistory, { role: 'user', content: chatInput }];
    setChatHistory(newHistory);
    setChatInput('');

    try {
      const res = await axios.post(`${API_URL}/pair-programmer`, { 
        messages: newHistory, 
        currentCode: code 
      });
      setChatHistory([...newHistory, { role: 'assistant', content: res.data.reply }]);
    } catch (err) { console.error(err); }
  };

  // Step 3: Submit for Credential
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/submit`, { 
        code, 
        challengeDescription: challenge.description 
      });
      setResult(res.data);
      setStep(3);
    } catch (err) { alert("Error submitting"); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold text-blue-400">Zero-to-Hired <span className="text-white text-sm font-normal">| AI Apprenticeship Simulator</span></h1>
      </header>

      {/* VIEW 1: JOB INPUT */}
      {step === 1 && (
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl mb-4">Paste a Job Description</h2>
          <textarea 
            rows="10" 
            placeholder="Paste JD here (e.g., 'Senior React Developer at Google...')" 
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <button onClick={handleGenerate} disabled={loading} className="mt-4 w-full">
            {loading ? "Simulating Apprenticeship..." : "Start Simulation"}
          </button>
        </div>
      )}

      {/* VIEW 2: SIMULATION WORKSPACE */}
      {step === 2 && challenge && (
        <div className="grid grid-cols-12 gap-4 h-[80vh]">
          {/* Left: Task & Chat */}
          <div className="col-span-4 flex flex-col gap-4">
            <div className="bg-slate-800 p-4 rounded h-1/2 overflow-auto">
              <h3 className="font-bold text-lg text-blue-300">{challenge.title}</h3>
              <p className="text-sm text-slate-300 mt-2">{challenge.description}</p>
            </div>
            
            <div className="bg-slate-900 p-4 rounded h-1/2 flex flex-col border border-slate-700">
              <div className="flex-1 overflow-auto mb-2 space-y-2">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`p-2 rounded text-sm ${msg.role === 'user' ? 'bg-blue-900 ml-8' : 'bg-slate-800 mr-8'}`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  className="bg-slate-800 flex-1 px-2 rounded" 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)} 
                  placeholder="Ask your AI teammate..."
                  onKeyDown={(e) => e.key === 'Enter' && handleChat()}
                />
                <button onClick={handleChat} className="py-1 px-3">Send</button>
              </div>
            </div>
          </div>

          {/* Right: Code Editor */}
          <div className="col-span-8 flex flex-col">
            <div className="bg-black p-2 rounded-t text-sm text-slate-400 flex justify-between items-center">
              <span>main.js</span>
              <button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-500 py-1 text-xs">
                {loading ? "Verifying..." : "Submit & Get Credential"}
              </button>
            </div>
            <textarea 
              className="flex-1 font-mono text-green-400 bg-slate-950 p-4 resize-none focus:outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* VIEW 3: CREDENTIAL */}
      {step === 3 && result && (
        <div className="max-w-2xl mx-auto bg-white text-black p-8 rounded shadow-2xl text-center">
          <h2 className="text-3xl font-bold mb-2">Verified Credential</h2>
          <div className={`text-6xl font-black mb-4 ${result.score > 70 ? 'text-green-600' : 'text-red-600'}`}>
            {result.score}/100
          </div>
          <p className="text-lg mb-6">{result.pass ? "CERTIFIED SKILL READY" : "NEEDS IMPROVEMENT"}</p>
          <div className="bg-slate-100 p-4 rounded text-left">
            <h3 className="font-bold">Detailed Feedback:</h3>
            <p>{result.feedback}</p>
          </div>
          <button onClick={() => window.location.reload()} className="mt-8">Start New Simulation</button>
        </div>
      )}
    </div>
  );
}

export default App;