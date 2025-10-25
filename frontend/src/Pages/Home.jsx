import React, { useState } from "react";
import "../Style/Home.css";

export default function Home() {
  const [activeScreen, setActiveScreen] = useState("home"); // home, workout, progress, profile
  const [exercises, setExercises] = useState([
    { id: 1, title: "Push-ups", reps: "3x12", time: "5 min", cal: 45, done: false },
    { id: 2, title: "Squats", reps: "3x15", time: "6 min", cal: 60, done: false },
    { id: 3, title: "Plank", reps: "3x30s", time: "3 min", cal: 30, done: false },
    { id: 4, title: "Lunges", reps: "3x10", time: "5 min", cal: 50, done: false },
    { id: 5, title: "Mountain Climbers", reps: "3x20", time: "4 min", cal: 55, done: false },
  ]);

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

  return (
    <>
      {/* Home Screen */}
      <div className={`screen ${activeScreen === "home" ? "" : "hidden"}`} id="home-screen">
        <div className="header">
          <div className="header-top">
            <div>
              <h1>Hi, Alex! 👋</h1>
              <p>Ready to crush today's workout?</p>
            </div>
            <div className="fire-icon">🔥</div>
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
              <p>Focus on form over speed today. Your squat depth has improved 15% this week!</p>
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
              <div className="day-item" key={d}>
                <div className={`day-box ${i < 4 ? "completed" : "incomplete"}`}>{i < 4 ? "✓" : ""}</div>
                <div className={`day-label ${i < 4 ? "completed" : ""}`}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workout Screen */}
      <div className={`screen ${activeScreen === "workout" ? "" : "hidden"}`} id="workout-screen">
        <div className="header">
          <h1>Full Body Strength</h1>
          <p>5 exercises • 23 minutes • 240 calories</p>
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
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24, color: "#1f2937" }}>Your Progress</h1>

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

          <div className="muscle-diagram">
            <h2>Muscle Development</h2>
            <div className="body-container">
              <div className="body-outline">
                <div className="muscle-group muscle-back" title="Back"></div>
                <div className="muscle-group muscle-chest" title="Chest"></div>
                <div className="muscle-group muscle-arms" title="Arms">
                  <div className="muscle-arm"></div>
                  <div className="muscle-arm"></div>
                </div>
                <div className="muscle-group muscle-abs" title="Core/Abs"></div>
                <div className="muscle-group muscle-legs" title="Legs">
                  <div className="muscle-leg"></div>
                  <div className="muscle-leg"></div>
                </div>
              </div>
            </div>
          </div>
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

      {/* Bottom nav removed from here; Frame will render BottomNav as footer */}
    </>
  );
}