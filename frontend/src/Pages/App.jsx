import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./new-login";
import Home from "./Home";

function About() {
    return (
        <main>
            <h1>About</h1>
            <p>Basic React app scaffold.</p>
        </main>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <div style={{ 
                fontFamily: "system-ui, sans-serif",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column"
            }}>
                <nav style={{ 
                    padding: "12px 20px",
                    background: "white",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                }}>
                    <Link to="/" style={{ marginRight: 12, color: "#10b981", textDecoration: "none" }}>Login</Link>
                    <Link to="/home" style={{ marginRight: 12, color: "#10b981", textDecoration: "none" }}>Home</Link>
                    <Link to="/about" style={{ marginRight: 12, color: "#10b981", textDecoration: "none" }}>About</Link>
                </nav>

                <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}