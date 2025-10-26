import React, { useState, useRef, useEffect } from "react";
import "../Style/Home.css";

const API_URL = "http://0.0.0.0:8000";

const proTips = [
  "Warm up for 5–10 minutes before jumping into intense exercise to reduce injury risk.",
  "Focus on controlled movements — quality beats quantity every time.",
  "Consistency matters more than intensity; stick to a routine you can maintain.",
  "Mix strength and cardio for balanced fitness and better recovery.",
  "Hydrate before, during, and after workouts to support performance and recovery.",
  "Prioritize sleep — it's when your body rebuilds and gets stronger.",
  "Progressive overload: gradually increase reps, sets or weight to keep improving.",
  "Form first — use mirrors or record yourself to check technique.",
  "Include mobility work to improve range of motion and reduce soreness.",
  "Fuel with a small snack 30–60 minutes before a workout for steady energy.",
];

export default function Home() {
  const [activeScreen, setActiveScreen] = useState("home");
  const [profile, setProfile] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const inputRef = useRef(null);
  
  // UI state
  const [showFireTooltip, setShowFireTooltip] = useState(false);

  // Undo / snackbar state for marking exercises
  const [undoInfo, setUndoInfo] = useState(null); // { index, prevDone, timeoutId }

  // Confirmation modal for completing workout
  const [showConfirmComplete, setShowConfirmComplete] = useState(false);
  // profile settings panel state
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const settingsPanelRef = useRef(null);

  const [selectedTip, setSelectedTip] = useState("");

  

  // Map exercise to a color circle (used instead of images)
  function getExerciseColor(title, idx) {
    const key = (title || "").toLowerCase();
    if (key.includes("push")) return "#10b981"; // theme green
    if (key.includes("squat")) return "#f97316"; // theme orange
    if (key.includes("plank")) return "#3b82f6"; // theme blue
    if (key.includes("lunge")) return "#a855f7"; // theme purple
    if (key.includes("mountain")) return "#06b6d4"; // theme teal
    if (key.includes("jump")) return "#60a5fa"; // light blue
    if (key.includes("burpee")) return "#f59e0b"; // yellow/orange
    // fallback cycle of theme colors
    const fallback = ["#3b82f6", "#10b981", "#f97316", "#a855f7", "#06b6d4"];
    return fallback[idx % fallback.length];
  }

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
    
    // Set random pro tip
    try {
      const stored = sessionStorage.getItem("selectedTip");
      if (stored) {
        setSelectedTip(stored);
      } else {
        const t = proTips[Math.floor(Math.random() * proTips.length)];
        setSelectedTip(t);
        sessionStorage.setItem("selectedTip", t);
      }
    } catch {
      const t = proTips[Math.floor(Math.random() * proTips.length)];
      setSelectedTip(t);
    }
  }, []);

  async function fetchUserData() {
    try {
      setLoading(true);
      
      // Fetch profile
      const profileRes = await fetch(`${API_URL}/profile`, {
        credentials: 'include',
      });
      
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      // Fetch today's workout
      const workoutRes = await fetch(`${API_URL}/workouts/today`, {
        credentials: 'include',
      });
      
      if (workoutRes.ok) {
        const workoutData = await workoutRes.json();
        setWorkout(workoutData);
        setExercises(workoutData.exercises.map((ex, idx) => ({
          id: idx + 1,
          ...ex,
          done: ex.completed
        })));
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  }

  function showScreen(name) {
    setActiveScreen(name);
  }

  function toggleExercise(index) {
    setExercises((prev) => {
      const copy = [...prev];
      const prevDone = !!copy[index].done;
      copy[index] = { ...copy[index], done: !prevDone };

      // clear any existing undo timer
      if (undoInfo && undoInfo.timeoutId) {
        clearTimeout(undoInfo.timeoutId);
      }

      // show snackbar with undo option
      const timeoutId = setTimeout(() => {
        setUndoInfo(null);
      }, 5000);

      setUndoInfo({ index, prevDone, timeoutId });

      return copy;
    });
  }

  function undoToggle() {
  if (!undoInfo) return;
  const { index, prevDone, timeoutId } = undoInfo;
  clearTimeout(timeoutId);
    setExercises((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], done: prevDone };
      return copy;
    });
    setUndoInfo(null);
  }

  async function completeWorkout() {
    if (!workout) return;
    try {
      const completedExercises = exercises.map((ex) => ex.done);

      const res = await fetch(`${API_URL}/workouts/${workout.id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ completed_exercises: completedExercises }),
      });

      if (res.ok) {
        // Refresh user data to show updated stats
        await fetchUserData();
        showScreen("home");
      }
    } catch (err) {
      console.error("Error completing workout:", err);
    } finally {
      setShowConfirmComplete(false);
    }
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

    setMessages((m) => [...m, { from: "user", text }]);
    setChatInput("");

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({ text }),
      });

      let botReply = "";
      if (res.ok) {
        const data = await res.json();
        botReply = data.reply || data.message || data.text || JSON.stringify(data);
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

  // Settings handlers
  function toggleSettings() {
    setShowSettings((s) => !s);
  }

  function toggleDarkMode() {
    const next = !darkMode;
    setDarkMode(next);
    try {
      if (next) document.body.classList.add("dark-mode");
      else document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", next ? "true" : "false");
    } catch {}
  }

  // apply saved dark mode on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("darkMode");
      if (stored === "true") {
        setDarkMode(true);
        document.body.classList.add("dark-mode");
      }
    } catch {}
  }, []);

  // close settings when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (!showSettings) return;
      if (settingsPanelRef.current && !settingsPanelRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [showSettings]);

  const motivations = [
    "Nice work — keep the momentum going!",
    "Great streak — you're building consistency!",
    "Awesome! Small wins add up to big gains.",
    "You're on fire — keep pushing!",
  ];
  
  const streak = profile?.stats?.current_streak || 0;
  const motivation = motivations[Math.min(Math.floor(streak / 3), motivations.length - 1)];

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div>
      {/* Home Screen */}
      <div className={`screen ${activeScreen === "home" ? "" : "hidden"}`} id="home-screen">
        <div className="header">
          <div className="header-top" style={{ position: 'relative' }}>
            <div>
              <h1>Hi, {profile?.full_name || 'User'}! 👋</h1>
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
              <div className="number">{profile?.stats?.current_streak || 0}</div>
              <div className="label">Day Streak</div>
            </div>
            <div className="stat-card">
              <div className="number">{profile?.stats?.workouts_this_week || 0}</div>
              <div className="label">This Week</div>
            </div>
            <div className="stat-card">
              <div className="number">{profile?.stats?.total_calories || 0}</div>
              <div className="label">Calories</div>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="tip-card">
            <div className="tip-icon">💡</div>
            <div className="tip-content">
              <h3>Pro Tip</h3>
              <p>{selectedTip}</p>
            </div>
          </div>

          <div className="section-header">
            <h2>Today's Workout</h2>
          </div>

          {workout && (
            <div className="workout-card">
              <div className="workout-header">
                <div>
                  <h3>{workout.title}</h3>
                  <div className="subtitle">{workout.description}</div>
                </div>
                <div className="workout-time">{workout.total_time}</div>
              </div>
              <div className="workout-info">
                <div className="workout-meta">
                  <div className="meta-item">
                    <span>💪</span>
                    <span>{workout.exercises.length} exercises</span>
                  </div>
                  <div className="meta-item">
                    <span>🔥</span>
                    <span>{workout.total_calories} cal</span>
                  </div>
                </div>
                <button className="start-btn" onClick={() => showScreen("workout")}>
                  <span>▶</span>
                  Start Workout
                </button>
              </div>
            </div>
          )}

          <div className="section-header">
            <h2>This Week</h2>
          </div>
          <div className="week-progress">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => {
              const isCompleted = profile?.week_activity?.[i] || false;
              return (
                <div
                  className="day-item"
                  key={d}
                  tabIndex={0}
                >
                  <div className={`day-box ${isCompleted ? "completed" : "incomplete"}`}>
                    {isCompleted ? "✓" : ""}
                  </div>
                  <div className={`day-label ${isCompleted ? "completed" : ""}`}>{d}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Confirmation modal for completing workout */}
      {showConfirmComplete && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Complete Workout?</h3>
            <p>Are you sure you want to mark this workout as complete? This will update your stats.</p>
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setShowConfirmComplete(false)}>Cancel</button>
              <button className="btn btn-confirm" onClick={completeWorkout}>Yes, complete</button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar for undo action */}
      {undoInfo && (
        <div className={`snackbar ${undoInfo ? 'visible' : ''}`} role="status">
          <div className="snackbar-msg">Marked "{exercises[undoInfo.index]?.title}" {exercises[undoInfo.index]?.done ? 'done' : 'undone'}</div>
          <button className="snackbar-undo" onClick={() => undoToggle()}>Undo</button>
        </div>
      )}

      {/* Workout Screen */}
      <div className={`screen ${activeScreen === "workout" ? "" : "hidden"}`} id="workout-screen">
        <div className="header">
          <div className="header-top">
            <h1>{workout?.title || "Workout"}</h1>
            <p>{exercises.length} exercises • {workout?.total_time} • {workout?.total_calories} calories</p>
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
                  <div
                    className="exercise-icon"
                    style={{ backgroundColor: getExerciseColor(ex.title, idx), "--ring": getExerciseColor(ex.title, idx) }}
                    role="img"
                    aria-label={ex.title}
                    title={ex.title}
                  />
                <div className={`checkbox ${ex.done ? "checked" : ""}`}>{ex.done ? "✓" : ""}</div>
                <div className="exercise-details">
                  <h3>{ex.title}</h3>
                  <div className="exercise-meta">
                    <span>{ex.reps}</span>
                    <span style={{ color: "#10b981" }}>• {ex.time}</span>
                    <span style={{ color: "#f97316" }}>• {ex.calories} cal</span>
                  </div>
                </div>
                <div className="play-icon">▶</div>
              </div>
            ))}
          </div>
        </div>

        <button className="complete-btn" onClick={completeWorkout}>Complete Workout</button>
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
                <div className="value">{profile?.stats?.workouts_this_week || 0}</div>
                <div className="label">Workouts</div>
              </div>
              <div className="stat-box orange">
                <div className="icon" style={{ color: "#f97316" }}>🔥</div>
                <div className="value">{profile?.stats?.total_calories || 0}</div>
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
            <h1>{profile?.full_name || 'User'}</h1>
            <p>Member since {profile?.member_since || 'Jan 2025'}</p>
          </div>
        </div>

        <div className="content">
          <div className="info-card">
            <h2>Goals</h2>
            <div className="info-row">
              <span className="label">Weight Goal</span>
              <span className="value">{profile?.goals?.weight_goal || 165} lbs</span>
            </div>
            <div className="info-row">
              <span className="label">Weekly Workouts</span>
              <span className="value">{profile?.goals?.weekly_workout_goal || 5} days</span>
            </div>
            <div className="info-row">
              <span className="label">Focus Area</span>
              <span className="value">{profile?.goals?.focus_area || 'Strength'}</span>
            </div>
          </div>

          <div className="info-card">
            <h2>Achievements</h2>
            <div className="achievements">
              <div className="achievement">
                <div className="achievement-icon yellow">🏆</div>
                <div className="achievement-label">{profile?.stats?.current_streak || 0} Day Streak</div>
              </div>
              <div className="achievement">
                <div className="achievement-icon green">💪</div>
                <div className="achievement-label">{profile?.stats?.total_workouts || 0} Workouts</div>
              </div>
              <div className="achievement">
                <div className="achievement-icon purple">🔥</div>
                <div className="achievement-label">{Math.floor((profile?.stats?.total_calories || 0) / 1000)}K Calories</div>
              </div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <button className="settings-btn" onClick={toggleSettings} aria-expanded={showSettings}>Settings</button>

            {showSettings && (
              <div ref={settingsPanelRef} className="settings-panel">
                <div className="settings-row">
                  <div>Dark mode</div>
                  <label className="switch">
                    <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
                    <span className="slider" />
                  </label>
                </div>
              </div>
            )}
          </div>
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