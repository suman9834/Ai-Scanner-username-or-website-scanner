import React, { useState } from "react";
import { loginUser } from "../services/api";
import { setToken } from "../services/auth";
import Navbar from "../components/Navbar";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError("");

    const data = await loginUser(email, password);
    setLoading(false);

    if (data.token) {
      setToken(data.token);
      navigate("/");
    } else {
      setError(data.error || "Login failed. Check your credentials.");
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Access control</p>
            <h1>Login to AI Scanner</h1>
          </div>
        </div>

        <div className="scan-card">
          <div className="scan-input-row">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="scan-input-row">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="muted">Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
