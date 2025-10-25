import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./new-login";
import Home from "./Home";
import Frame from "./Frame";
import BottomNav from "./BottomNav";
import "../Style/Home.css"; // Import phone-container styles

function About() {
    return (
        <div style={{ padding: 24 }}>
            <h1>About</h1>
            <p>Basic React app scaffold.</p>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <div style={{ 
                fontFamily: "system-ui, sans-serif", 
                minHeight: "100vh",
                background: "#f3f4f6",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "20px"
            }}>
                <nav style={{ 
                    marginBottom: 20,
                    background: "white",
                    padding: "12px 20px",
                    borderRadius: 12,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                    <Link to="/" style={{ marginRight: 16, color: "#10b981", textDecoration: "none" }}>Login</Link>
                    <Link to="/home" style={{ marginRight: 16, color: "#10b981", textDecoration: "none" }}>Home</Link>
                    <Link to="/about" style={{ marginRight: 16, color: "#10b981", textDecoration: "none" }}>About</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<Frame><Login /></Frame>} />
                    <Route path="/home" element={<Frame footer={<BottomNav />}><Home /></Frame>} />
                    <Route path="/about" element={<Frame><About /></Frame>} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}