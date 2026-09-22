import { getAuthHeaders } from "./auth";

const API_BASE = `${process.env.REACT_APP_API_URL || "http://127.0.0.1:5000"}/api`;

export const scanWebsite = async (url) => {
  const res = await fetch(`${API_BASE}/scan/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ url }),
  });

  return res.json();
};

export const fetchDashboard = async () => {
  const res = await fetch(`${API_BASE}/dashboard/`, {
    headers: {
      ...getAuthHeaders(),
    },
  });

  return res.json();
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

export const registerUser = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

export const checkUsername = async (username) => {
  const res = await fetch(`${API_BASE}/osint/username`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  return res.json();
};