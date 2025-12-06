// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import JobSetupPage from "./pages/JobSetupPage.jsx";
import SimulationPage from "./pages/SimulationPage.jsx";
import ReportPage from "./pages/ReportPage.jsx";

// pages
import MySimulationsPage from "./pages/MySimulations.jsx";
import AdminJobAnalyticsPage from "./pages/AdminJobAnalyticsPage.jsx";
import CandidateLoginPage from "./pages/CandidateLoginPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminJobSelectPage from "./pages/AdminJobSelectPage.jsx";

const App = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
    <Navbar />
    <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
      <Routes>
        {/* Candidate flows */}
        <Route path="/" element={<JobSetupPage />} />
        <Route path="/simulation/:id" element={<SimulationPage />} />
        <Route path="/report/:id" element={<ReportPage />} />

        {/* Candidate login + history */}
        <Route path="/candidate-login" element={<CandidateLoginPage />} />
        <Route path="/me" element={<MySimulationsPage />} />

        {/* Admin login + job selection + analytics */}
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-job-select" element={<AdminJobSelectPage />} />
        <Route path="/admin/job/:id" element={<AdminJobAnalyticsPage />} />
      </Routes>
    </main>
  </div>
);

export default App;
