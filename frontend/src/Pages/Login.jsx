import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/App.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        if (!username || !password) {
            setError("Please enter username and password.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // ensure cookie from backend is stored
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                const msg = data.detail || data.message || "Login failed";
                setError(msg);
                return;
            }

            // Backend sets HttpOnly cookie; call /me to confirm and get username
            try {
                const me = await fetch(`${API_BASE}/me`, { credentials: "include" });
                if (me.ok) {
                    const meData = await me.json().catch(() => ({}));
                    const name = meData.username || username;
                    localStorage.setItem("user", name);
                } else {
                    // fallback: store submitted username
                    localStorage.setItem("user", username);
                }
            } catch {
                localStorage.setItem("user", username);
            }

            navigate("/home");
        } catch (err) {
            setError("Network error: " + (err.message || "unable to connect"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="container" style={{ maxWidth: 420 }}>
            <h1>Login</h1>
            {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
                <label>
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: "100%", padding: 8, marginTop: 6 }}
                        disabled={loading}
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: 8, marginTop: 6 }}
                        disabled={loading}
                    />
                </label>

                <button type="submit" style={{ padding: "8px 12px", marginTop: 6 }} disabled={loading}>
                    {loading ? "Signing in…" : "Sign in"}
                </button>
            </form>
        </main>
    );
}