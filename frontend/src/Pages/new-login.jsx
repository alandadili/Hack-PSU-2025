import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/NewLogin.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://172.66.0.96:8000";

export default function NewLogin({ onAuth }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function toggleMode() {
    setIsRegister((v) => !v);
    setError("");
    setName("");
    setGender("");
    setAge("");
     setUsername("");
    setPassword("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!username || !password || (isRegister && (!name || !gender || !age))) {
      setError("Please fill required fields.");
      return;
    }

    setLoading(true);
    try {
      const url = isRegister ? `${API_BASE}/register` : `${API_BASE}/login`;
      const body = isRegister
        ? { name, username, password, gender, age }
        : { username, password }; // match your backend shape

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.detail || data.message || "Authentication failed");
        return;
      }

      // Backend likely sets HttpOnly cookie. Call /me or use returned username.
      const returnedUsername = data.username || username; // avoid shadowing state 'username'
  if (onAuth) onAuth(returnedUsername);
  // navigate to home page
  navigate("/home");
    } catch (err) {
      setError("Network error: " + (err.message || "unable to connect"));
    } finally {
      setLoading(false);
    }
  }

  // no placeholder; successful auth navigates to /home

  return (
    <div className="auth-screen">
      <div className="auth-container" role="dialog" aria-label="Authentication">
        <div className="branding">
          <div className="branding-icon">🚀</div>
          <h2>FitTrack</h2>
        </div>

        <div className="form-container">
          <form id="auth-form" onSubmit={handleSubmit}>
            {isRegister && (
              <div id="name-field">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}

            {isRegister && (
              <div id="additional-fields">
                <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age"
                  min="1"
                  max="120"
                  required
                />
              </div>
            )}

            <input
              type="username"
              value={username}
              onChange={(e) =>  setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? "Please wait…" : isRegister ? "Register" : "Login"}
            </button>
          </form>
        </div>

        <div className="switch-link" onClick={toggleMode}>
          {isRegister ? (
            <span>Already have an account? <button className="link-btn">Login</button></span>
          ) : (
            <span>Don't have an account? <button className="link-btn">Register</button></span>
          )}
        </div>
      </div>
    </div>
  );
}