import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getCandidateName, isAdmin, setAdminLoggedIn } from "../utils/auth.js";

const Navbar = () => {
  const location = useLocation();
  const candidateName = getCandidateName();
  const admin = isAdmin();

  const isActive = (pathPrefix) =>
    location.pathname === pathPrefix ||
    location.pathname.startsWith(pathPrefix);

  const handleAdminLogout = () => {
    setAdminLoggedIn(false);
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-500 flex items-center justify-center text-xs font-bold">
            Z2H
          </div>
          <span className="font-semibold text-sm md:text-base">
            Zero-to-Hired{" "}
            <span className="text-slate-400 text-xs">Simulator</span>
          </span>
        </Link>

        <nav className="flex gap-3 items-center text-xs md:text-sm">
          <Link
            to="/"
            className={`px-3 py-1 rounded-full ${
              isActive("/") && !isActive("/admin")
                ? "bg-slate-800 text-slate-50"
                : "text-slate-400 hover:text-slate-100"
            }`}
          >
            New Simulation
          </Link>

          <Link
            to="/me"
            className={`px-3 py-1 rounded-full ${
              isActive("/me")
                ? "bg-slate-800 text-slate-50"
                : "text-slate-400 hover:text-slate-100"
            }`}
          >
            My Simulations
          </Link>

          {!candidateName && (
            <Link
              to="/candidate-login"
              className={`px-3 py-1 rounded-full ${
                isActive("/candidate-login")
                  ? "bg-slate-800 text-slate-50"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              Candidate Login
            </Link>
          )}

          {admin ? (
            <>
              <Link
                to="/admin-job-select"
                className={`px-3 py-1 rounded-full ${
                  isActive("/admin-job-select") || isActive("/admin/job")
                    ? "bg-slate-800 text-slate-50"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                Admin Panel
              </Link>
              <button
                onClick={handleAdminLogout}
                className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-200"
              >
                Admin Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin-login"
              className={`px-3 py-1 rounded-full ${
                isActive("/admin-login")
                  ? "bg-slate-800 text-slate-50"
                  : "text-slate-400 hover:text-slate-100"
              }`}
            >
              Admin Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
