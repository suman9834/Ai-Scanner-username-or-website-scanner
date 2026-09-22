import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, removeToken } from "../services/auth";

function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="pulse-dot"></span>
        <h2>AI SCANNER</h2>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/osint">OSINT</Link>
        {loggedIn ? (
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;