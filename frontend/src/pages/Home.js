import React from "react";
import Navbar from "../components/Navbar";
import ScanForm from "../components/ScanForm";

import { Link } from "react-router-dom";



function Home() {
  return (
    <div className="page-shell">
      <Navbar />

      <div className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">AI Security Platform</p>
          <h1>Find weak points before attackers do.</h1>
          <p className="subtitle">
            Scan websites, assess risk, and get practical guidance powered by an intelligent security workflow.
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn primary">Open Dashboard</Link>
            <Link to="/osint" className="btn secondary">Run OSINT Lookup</Link>
          </div>
        </div>

        <div className="hero-panel">
          <ScanForm />
        </div>
      </div>
    </div>
  );
}

export default Home;