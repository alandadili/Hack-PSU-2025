import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Login";

function Home() {
    return (
        <main>
            <h1>Welcome</h1>
            <p>This is the home page.</p>
        </main>
    );
}

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
            <div style={{ fontFamily: "system-ui, sans-serif", padding: 20 }}>
                <nav style={{ marginBottom: 20 }}>
                    <Link to="/home" style={{ marginRight: 12 }}>Home</Link>
                    <Link to="/about" style={{ marginRight: 12 }}>About</Link>
                    <Link to="/" style={{ marginRight: 12 }}>Login</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}