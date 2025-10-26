import React, { useState, useRef, useEffect } from "react";
import "../Style/Home.css";

export default function Home() {
  const [activeScreen, setActiveScreen] = useState("home"); // home, workout, progress, profile, chat
  const [exercises, setExercises] = useState([
    { id: 1, title: "Push-ups", reps: "3x12", time: "5 min", cal: 45, done: false },
    { id: 2, title: "Squats", reps: "3x15", time: "6 min", cal: 60, done: false },
    { id: 3, title: "Plank", reps: "3x30s", time: "3 min", cal: 30, done: false },
    { id: 4, title: "Lunges", reps: "3x10", time: "5 min", cal: 50, done: false },
    { id: 5, title: "Mountain Climbers", reps: "3x20", time: "4 min", cal: 55, done: false },
  ]);

  // Chat state
  const [messages, setMessages] = useState([]); // {from: 'user'|'bot', text}
  const [chatInput, setChatInput] = useState("");
  const inputRef = useRef(null);
  // UI state for fire tooltip
  const [showFireTooltip, setShowFireTooltip] = useState(false);
  const [streak] = useState(7); // you can derive this from backend/user data later

  const motivations = [
    "Nice work — keep the momentum going!",
    "Great streak — you're building consistency!",
    "Awesome! Small wins add up to big gains.",
    "You're on fire — keep pushing!",
  ];
  const motivation = motivations[Math.min(Math.floor(streak / 3), motivations.length - 1)];

  // Pro tips to show on the home screen (choose one randomly on login)
  const proTips = [
    "Warm up for 5–10 minutes before jumping into intense exercise to reduce injury risk.",
    "Focus on controlled movements — quality beats quantity every time.",
    "Consistency matters more than intensity; stick to a routine you can maintain.",
    "Mix strength and cardio for balanced fitness and better recovery.",
    "Hydrate before, during, and after workouts to support performance and recovery.",
    "Prioritize sleep — it’s when your body rebuilds and gets stronger.",
    "Progressive overload: gradually increase reps, sets or weight to keep improving.",
    "Form first — use mirrors or record yourself to check technique.",
    "Include mobility work to improve range of motion and reduce soreness.",
    "Fuel with a small snack 30–60 minutes before a workout for steady energy.",
  ];

  const [selectedTip, setSelectedTip] = useState("");

  // Persist a single pro tip per browser session so it doesn't change when navigating away/back
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("selectedTip");
      if (stored) {
        setSelectedTip(stored);
      } else {
        const t = proTips[Math.floor(Math.random() * proTips.length)];
        setSelectedTip(t);
        sessionStorage.setItem("selectedTip", t);
      }
    } catch (err) {
      // sessionStorage may be unavailable in some contexts; fall back to in-memory behavior
      const t = proTips[Math.floor(Math.random() * proTips.length)];
      setSelectedTip(t);
    }
  }, []);

  // Hover state for week day tooltips
  const [hoveredDay, setHoveredDay] = useState(null);

  // Sample week logs: exercises performed each day (index 0 = Mon)
  // Replace with real data from backend/user history when available
  const weekLogs = [
    ["Push-ups — 3x12", "Squats — 3x15"], // Mon
    ["Plank — 3x30s"],                     // Tue
    ["Lunges — 3x10", "Mountain Climbers — 3x20"], // Wed
    [],                                      // Thu (rest)
    ["Light cardio — 20m"],                // Fri
    [],                                      // Sat
    [],                                      // Sun
  ];

  function showScreen(name) {
    setActiveScreen(name);
  }

  function toggleExercise(index) {
    setExercises((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], done: !copy[index].done };
      return copy;
    });
  }

  useEffect(() => {
    if (activeScreen === "chat" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeScreen]);

  async function sendChatMessage(e) {
    if (e && e.preventDefault) e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    // append user message
    setMessages((m) => [...m, { from: "user", text }]);
    setChatInput("");

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      let botReply = "";
      if (res.ok) {
        const ctype = res.headers.get("content-type") || "";
        if (ctype.includes("application/json")) {
          const data = await res.json();
          botReply = data.reply || data.message || data.text || JSON.stringify(data);
        } else {
          botReply = await res.text();
        }
      } else {
        botReply = `Error: ${res.statusText || res.status}`;
      }
      setMessages((m) => [...m, { from: "bot", text: botReply }]);
    } catch (err) {
      setMessages((m) => [...m, { from: "bot", text: "Network error: unable to reach server." }]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage(e);
    }
  }

  return (
    <div>
      {/* Home Screen */}
      <div className={`screen ${activeScreen === "home" ? "" : "hidden"}`} id="home-screen">
        <div className="header">
          <div className="header-top" style={{ position: 'relative' }}>
            <div>
              <h1>Hi, Alex! 👋</h1>
              <p>Ready to crush today's workout?</p>
            </div>
            <div
              className="fire-icon"
              tabIndex={0}
              role="button"
              aria-label="Daily streak"
              onMouseEnter={() => setShowFireTooltip(true)}
              onMouseLeave={() => setShowFireTooltip(false)}
              onFocus={() => setShowFireTooltip(true)}
              onBlur={() => setShowFireTooltip(false)}
            >
              🔥
            </div>

            {showFireTooltip && (
              <div className="fire-tooltip" onMouseEnter={() => setShowFireTooltip(true)} onMouseLeave={() => setShowFireTooltip(false)}>
                <div className="tooltip-title">Daily Streak</div>
                <div className="tooltip-streak">{streak} days</div>
                <div className="tooltip-msg">{motivation}</div>
              </div>
            )}
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="number">7</div>
              <div className="label">Day Streak</div>
            </div>
            <div className="stat-card">
              <div className="number">4</div>
              <div className="label">This Week</div>
            </div>
            <div className="stat-card">
              <div className="number">1250</div>
              <div className="label">Calories</div>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="tip-card">
            <div className="tip-icon">💡</div>
            <div className="tip-content">
              <h3>Pro Tip</h3>
              <p>{selectedTip || "Focus on form over speed today. Your squat depth has improved 15% this week!"}</p>
            </div>
          </div>

          <div className="section-header">
            <h2>Today's Workout</h2>
            <div className="view-all">View All</div>
          </div>

          <div className="workout-card">
            <div className="workout-header">
              <div>
                <h3>Full Body Strength</h3>
                <div className="subtitle">Customized for you</div>
              </div>
              <div className="workout-time">23 min</div>
            </div>
            <div className="workout-info">
              <div className="workout-meta">
                <div className="meta-item">
                  <span>💪</span>
                  <span>5 exercises</span>
                </div>
                <div className="meta-item">
                  <span>🔥</span>
                  <span>240 cal</span>
                </div>
              </div>
              <button className="start-btn" onClick={() => showScreen("workout")}>
                <span>▶</span>
                Start Workout
              </button>
            </div>
          </div>

          <div className="section-header">
            <h2>This Week</h2>
          </div>
          <div className="week-progress">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
              <div
                className="day-item"
                key={d}
                onMouseEnter={() => setHoveredDay(i)}
                onMouseLeave={() => setHoveredDay(null)}
                onFocus={() => setHoveredDay(i)}
                onBlur={() => setHoveredDay(null)}
                tabIndex={0}
              >
                <div className={`day-box ${i < 4 ? "completed" : "incomplete"}`}>{i < 4 ? "✓" : ""}</div>
                <div className={`day-label ${i < 4 ? "completed" : ""}`}>{d}</div>

                {hoveredDay === i && (
                  <div className="day-tooltip" role="dialog" aria-label={`${d} workouts`}>
                    <div className="tooltip-day">{d}</div>
                    <ul>
                      {weekLogs[i] && weekLogs[i].length > 0 ? (
                        weekLogs[i].map((ex, idx) => <li key={idx}>{ex}</li>)
                      ) : (
                        <li className="muted">No workouts</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workout Screen */}
      <div className={`screen ${activeScreen === "workout" ? "" : "hidden"}`} id="workout-screen">
        <div className="header">
          <div className="header-top">
            <h1>Full Body Strength</h1>
            <p>5 exercises • 23 minutes • 240 calories</p>
          </div>
        </div>

        <div className="content">
          <div className="exercise-list">
            {exercises.map((ex, idx) => (
              <div
                key={ex.id}
                className={`exercise-item ${ex.done ? "completed" : ""}`}
                onClick={() => toggleExercise(idx)}
              >
                <div className={`checkbox ${ex.done ? "checked" : ""}`}>{ex.done ? "✓" : ""}</div>
                <div className="exercise-details">
                  <h3>{ex.title}</h3>
                  <div className="exercise-meta">
                    <span>{ex.reps}</span>
                    <span style={{ color: "#10b981" }}>• {ex.time}</span>
                    <span style={{ color: "#f97316" }}>• {ex.cal} cal</span>
                  </div>
                </div>
                <div className="play-icon">▶</div>
              </div>
            ))}
          </div>
        </div>

        <button className="complete-btn" onClick={() => showScreen("home")}>Complete Workout</button>
      </div>

      {/* Progress Screen */}
      <div className={`screen ${activeScreen === "progress" ? "" : "hidden"}`} id="progress-screen">
        <div className="content">
          <h1 className="page-title">Your Progress</h1>
          <div className="progress-card">
            <h2>This Week</h2>
            <div className="stats-cards">
              <div className="stat-box green">
                <div className="icon" style={{ color: "#10b981" }}>💪</div>
                <div className="value">4</div>
                <div className="label">Workouts</div>
              </div>
              <div className="stat-box orange">
                <div className="icon" style={{ color: "#f97316" }}>🔥</div>
                <div className="value">1250</div>
                <div className="label">Calories</div>
              </div>
              <div className="stat-box blue">
                <div className="icon" style={{ color: "#3b82f6" }}>⏱️</div>
                <div className="value">32m</div>
                <div className="label">Avg Duration</div>
              </div>
              <div className="stat-box purple">
                <div className="icon" style={{ color: "#a855f7" }}>📈</div>
                <div className="value">+12%</div>
                <div className="label">Performance</div>
              </div>
            </div>
          </div> 
        </div>
      </div>

      {/* Chat Screen */}
      <div className={`screen ${activeScreen === "chat" ? "" : "hidden"}`} id="chat-screen">
        <div className="header">
          <div className="header-top">
            <h1>Coach Bot</h1>
            <p>Ask for tips or workout guidance</p>
          </div>
        </div>

        <div className="content chat-content">
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="muted">
                <span className="muted-icon" aria-hidden="true">💬</span>
                <div className="muted-text">Say hi to the coach — ask anything about workouts.</div>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`chat-message ${m.from === "user" ? "chat-user" : "chat-bot"}`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={sendChatMessage} className="chat-form">
            <textarea
              ref={inputRef}
              className="chat-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message and press Enter to send"
            />
            <button type="submit" className="send-btn">Send</button>
          </form>
        </div>
      </div>

      {/* Profile Screen */}
      <div className={`screen ${activeScreen === "profile" ? "" : "hidden"}`} id="profile-screen">
        <div className="profile-header">
          <div className="avatar">👤</div>
          <div className="profile-info">
            <h1>Alex Johnson</h1>
            <p>Member since Jan 2025</p>
          </div>
        </div>

        <div className="content">
          <div className="info-card">
            <h2>Goals</h2>
            <div className="info-row">
              <span className="label">Weight Goal</span>
              <span className="value">165 lbs</span>
            </div>
            <div className="info-row">
              <span className="label">Weekly Workouts</span>
              <span className="value">5 days</span>
            </div>
            <div className="info-row">
              <span className="label">Focus Area</span>
              <span className="value">Strength</span>
            </div>
          </div>

          <div className="info-card">
            <h2>Achievements</h2>
            <div className="achievements">
              <div className="achievement">
                <div className="achievement-icon yellow">🏆</div>
                <div className="achievement-label">7 Day Streak</div>
              </div>
              <div className="achievement">
                <div className="achievement-icon green">💪</div>
                <div className="achievement-label">50 Workouts</div>
              </div>
              <div className="achievement">
                <div className="achievement-icon purple">🔥</div>
                <div className="achievement-label">5K Calories</div>
              </div>
            </div>
          </div>

          <button className="settings-btn">Settings</button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div
          className={`nav-item ${activeScreen === "home" ? "active" : ""}`}
          onClick={() => showScreen("home")}
        >
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1c.55 0 .85-.68.5-1.06l-9-8c-.3-.27-.76-.27-1.06 0l-9 8c-.35.38-.05 1.06.5 1.06z"/></svg>
          <span>Home</span>
        </div>
        <div
          className={`nav-item ${activeScreen === "workout" ? "active" : ""}`}
          onClick={() => showScreen("workout")}
        >
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/></svg>
          <span>Workout</span>
        </div>
        <div
          className={`nav-item ${activeScreen === "progress" ? "active" : ""}`}
          onClick={() => showScreen("progress")}
        >
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
          <span>Progress</span>
        </div>
        <div
          className={`nav-item ${activeScreen === "chat" ? "active" : ""}`}
          onClick={() => showScreen("chat")}
        >
          {/* chat bubble icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v14l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
          <span>Chat</span>
        </div>
        <div
          className={`nav-item ${activeScreen === "profile" ? "active" : ""}`}
          onClick={() => showScreen("profile")}
        >
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          <span>Profile</span>
        </div>
      </div>
    </div>
  );
}