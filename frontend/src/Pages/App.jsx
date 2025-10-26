import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./new-login";
import Home from "./Home";

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
                    <Link to="/" style={{ marginRight: 12, color: "#10b981", textDecoration: "none" }}>Logout</Link>
                
                </nav>

                <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/home" element={<Home />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}