import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { checkUsername } from "../services/api";

function OSINT() {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!username.trim()) {
      setError("Enter a username to search.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await checkUsername(username);
      setResults(data.accounts || []);
    } catch (err) {
      setError("Lookup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Intel Collection</p>
            <h1>Username OSINT</h1>
          </div>
        </div>

        <div className="scan-card">
          <div className="scan-input-row">
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleCheck}>{loading ? "Searching..." : "Search"}</button>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="panel">
            <h3>Results</h3>
            {results.length > 0 ? results.map((res, i) => (
              <div key={i} className={`result-row ${res.found ? "found" : "notfound"}`}>
                <span>{res.platform}</span>
                <strong>{res.url}</strong>
              </div>
            )) : <p className="muted">No results yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OSINT;