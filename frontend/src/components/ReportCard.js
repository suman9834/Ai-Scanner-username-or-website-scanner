import React from "react";

function ReportCard({ data }) {
  if (!data) return <p>No data</p>;

  return (
    <div className="report-shell">
      <div className="report-header">
        <div>
          <p className="label">Target</p>
          <h3>{data.url}</h3>
        </div>
        <div className={`pill ${data.risk?.level?.toLowerCase() || "low"}`}>
          {data.risk?.level || "LOW"} · {data.risk?.score || 0}
        </div>
      </div>

      <div className="report-stats">
        <div className="stat-box">
          <span>Status</span>
          <strong>{data.status_code}</strong>
        </div>
        <div className="stat-box">
          <span>Issues</span>
          <strong>{data.issues?.length || 0}</strong>
        </div>
        <div className="stat-box">
          <span>Summary</span>
          <strong>{data.summary?.status || "ok"}</strong>
        </div>
      </div>

      <div className="issues-section">
        <h4>Findings</h4>
        {data.issues?.length > 0 ? (
          data.issues.map((issue, i) => (
            <div key={i} className="issue-item">
              <span>⚠</span>
              <p>{issue.description}</p>
            </div>
          ))
        ) : (
          <div className="issue-item safe-item">
            <span>✓</span>
            <p>No vulnerabilities detected.</p>
          </div>
        )}
      </div>

      <div className="analysis-section">
        <h4>AI Guidance</h4>
        {data.explanations?.map((exp, i) => (
          <div key={i} className="ai-card">
            <p>{exp.explanation}</p>
            <small>Impact: {exp.impact}</small>
            <small>Fix: {exp.fix}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportCard;