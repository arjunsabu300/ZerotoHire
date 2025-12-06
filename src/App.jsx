import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import JobSetupPage from "./pages/JobSetupPage.jsx";
import SimulationPage from "./pages/SimulationPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";

const App = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <Navbar />
    <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
      <Routes>
        <Route path="/" element={<JobSetupPage />} />
        <Route path="/simulation/:id" element={<SimulationPage />} />
        <Route path="/report/:id" element={<ReportPage />} />
      </Routes>
    </main>
  </div>
);

export default App;
