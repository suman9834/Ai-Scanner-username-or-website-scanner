import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { checkUsername, checkPhone } from "../services/api";

function OSINT() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  const [results, setResults] = useState([]);
  const [phoneResults, setPhoneResults] = useState(null);

  const [loading, setLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");

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

  const handlePhoneCheck = async () => {
    if (!phone.trim()) {
      setPhoneError("Enter a phone number.");
      return;
    }

    try {
      setPhoneError("");
      setPhoneLoading(true);
      setPhoneResults(null);

      const data = await checkPhone(phone);
      setPhoneResults(data);
    } catch (err) {
      setPhoneError("Phone lookup failed. Please try again.");
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />

      <div className="dashboard">

        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Intel Collection</p>
            <h1>OSINT Intelligence</h1>
          </div>
        </div>

        {/* Username OSINT */}
        <div className="scan-card">
          <h2>Username Intelligence</h2>

          <div className="scan-input-row">
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <button onClick={handleCheck} disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="panel">
            <h3>Username Results</h3>

            {results.length > 0 ? (
              results.map((res, i) => (
                <div
                  key={i}
                  className={`result-row ${
                    res.found ? "found" : "notfound"
                  }`}
                >
                  <span>{res.platform}</span>
                  <strong>{res.url}</strong>
                </div>
              ))
            ) : (
              <p className="muted">No username results yet.</p>
            )}
          </div>
        </div>

        {/* Phone Intelligence */}
        <div className="scan-card">
          <h2>Phone Intelligence</h2>

          <p className="muted">
            Investigate publicly available and authorized information
            associated with a phone number.
          </p>

          <div className="scan-input-row">
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={handlePhoneCheck}
              disabled={phoneLoading}
            >
              {phoneLoading ? "Investigating..." : "Investigate"}
            </button>
          </div>

          {phoneError && <p className="error">{phoneError}</p>}

          {phoneResults && (
            <div className="panel">
              <h3>Phone Intelligence Results</h3>

              {phoneResults.error ? (
                <p className="error">{phoneResults.error}</p>
              ) : (
                <>
                  {/* Identity */}
                  <div className="intel-section">
                    <h4>Identity</h4>

                    <div className="result-row">
                      <span>Name</span>
                      <strong>
                        {phoneResults.identity?.name || "Not available"}
                      </strong>
                    </div>

                    <div className="result-row">
                      <span>Source</span>
                      <strong>
                        {phoneResults.identity?.source || "—"}
                      </strong>
                    </div>

                    <div className="result-row">
                      <span>Confidence</span>
                      <strong>
                        {phoneResults.identity?.confidence || "—"}
                      </strong>
                    </div>
                  </div>

                  {/* Number Analysis */}
                  <div className="intel-section">
                    <h4>Number Analysis</h4>

                    <div className="result-row">
                      <span>Status</span>
                      <strong>
                        {phoneResults.number_analysis?.valid
                          ? "✓ Valid"
                          : "Invalid"}
                      </strong>
                    </div>

                    <div className="result-row">
                      <span>Country</span>
                      <strong>
                        {phoneResults.number_analysis?.country ||
                          "Unknown"}
                      </strong>
                    </div>

                    <div className="result-row">
                      <span>Country Code</span>
                      <strong>
                        {phoneResults.number_analysis?.country_code ||
                          "—"}
                      </strong>
                    </div>

                    <div className="result-row">
                      <span>Region</span>
                      <strong>
                        {phoneResults.number_analysis?.region ||
                          "Unknown"}
                      </strong>
                    </div>

                    <div className="result-row">
                      <span>Type</span>
                      <strong>
                        {phoneResults.number_analysis?.type ||
                          "Unknown"}
                      </strong>
                    </div>

                    <div className="result-row">
                      <span>Carrier</span>
                      <strong>
                        {phoneResults.number_analysis?.carrier ||
                          "Not available"}
                      </strong>
                    </div>
                  </div>

                  {/* Public Sources */}
                  <div className="intel-section">
                    <h4>Public Sources</h4>

                    <div className="result-row">
                      <span>Public Web</span>
                      <strong>
                        {phoneResults.public_sources?.public_web
                          ?.status || "Not checked"}
                      </strong>
                    </div>

                    <div className="result-row">
                      <span>Authorized Source</span>
                      <strong>
                        {phoneResults.public_sources
                          ?.authorized_source?.status ||
                          "Not connected"}
                      </strong>
                    </div>
                  </div>

                  {/* Breach Exposure */}
                  <div className="intel-section">
                    <h4>Breach Exposure</h4>

                    <div className="result-row">
                      <span>Email-linked breach</span>
                      <strong>
                        {phoneResults.breach_exposure?.status ||
                          "Not checked"}
                      </strong>
                    </div>

                    <p className="muted">
                      {phoneResults.breach_exposure?.reason ||
                        "No breach information checked."}
                    </p>
                  </div>

                  {/* Source */}
                  <div className="intel-section">
                    <h4>Source / Confidence</h4>

                    <div className="result-row">
                      <span>Source</span>
                      <strong>
                        {phoneResults.source?.name || "—"}
                      </strong>
                    </div>

                    <div className="result-row">
                      <span>Confidence</span>
                      <strong>
                        {phoneResults.source?.confidence || "—"}
                      </strong>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Responsible Use */}
        <div className="panel">
          <h3>Responsible Use</h3>

          <p className="muted">
            Use this tool only for systems, accounts, and information
            you own or have permission to investigate. Private or
            non-public information is not exposed by this tool.
          </p>
        </div>

      </div>
    </div>
  );
}

export default OSINT;