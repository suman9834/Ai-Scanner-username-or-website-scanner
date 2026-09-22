import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportCard from "./ReportCard";
import { scanWebsite } from "../services/api";
import { isLoggedIn } from "../services/auth";

function ScanForm() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleScan = async () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    if (!url.trim()) {
      setError("Please enter a target URL.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await scanWebsite(url);
      if (data.error === "Unauthorized") {
        navigate("/login");
        return;
      }
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to scan. Check backend connection or target URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scan-card">
      <div className="scan-input-row">
        <input
          type="text"
          placeholder="Enter URL (http:// or https://)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleScan} disabled={loading}>
          {loading ? "Scanning..." : "Run Scan"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Initializing security sweep...</p>}
      {result && <ReportCard data={result} />}
    </div>
  );
}

export default ScanForm;