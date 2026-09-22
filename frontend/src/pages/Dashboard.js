import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchDashboard } from "../services/api";
import { isLoggedIn } from "../services/auth";

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    fetchDashboard()
      .then((res) => {
        if (res.error) {
          setError(res.error);
          if (res.error === "Unauthorized") {
            navigate("/login");
          }
          return;
        }
        setData(res);
      })
      .catch(() => setError("Could not load dashboard."));
  }, [navigate]);

  if (error) return <div className="page-shell"><Navbar /><div className="loading-box">{error}</div></div>;
  if (!data) return <div className="page-shell"><Navbar /><div className="loading-box">Loading dashboard...</div></div>;

  return (
    <div className="page-shell">
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Operations</p>
            <h1>Security Dashboard</h1>
          </div>
          <div className="pill neutral">{data.total_scans} scans tracked</div>
        </div>

        <div className="cards">
          <div className="card"><span>Total Scans</span><strong>{data.total_scans}</strong></div>
          <div className="card red"><span>High Risk</span><strong>{data.high_risk}</strong></div>
          <div className="card yellow"><span>Medium Risk</span><strong>{data.medium_risk}</strong></div>
          <div className="card green"><span>Low Risk</span><strong>{data.low_risk}</strong></div>
        </div>

        <div className="panel">
          <h3>Recent Targets</h3>
          <ul>
            {data.recent_scans?.length > 0 ? data.recent_scans.map((item, index) => (
              <li key={index}>
                <span>{item.url}</span>
                <strong>{item.risk}</strong>
              </li>
            )) : <li>No scans yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;