import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
    <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-500 flex items-center justify-center text-xs font-bold">
          Z2H
        </div>
        <span className="font-semibold text-sm md:text-base">
          Zero-to-Hired <span className="text-slate-400 text-xs">Simulator</span>
        </span>
      </Link>
    </div>
  </header>
);

export default Navbar;
