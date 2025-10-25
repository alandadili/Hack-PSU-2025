import React from "react";

export default function BottomNav({ active = "home", onNavigate }) {
  return (
    <div className="bottom-nav">
      <div className={`nav-item ${active === "home" ? "active" : ""}`} onClick={() => onNavigate && onNavigate('home')}>
        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h1v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h1c.55 0 .85-.68.5-1.06l-9-8c-.3-.27-.76-.27-1.06 0l-9 8c-.35.38-.05 1.06.5 1.06z"/></svg>
        <span>Home</span>
      </div>
      <div className={`nav-item ${active === "workout" ? "active" : ""}`} onClick={() => onNavigate && onNavigate('workout')}>
        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/></svg>
        <span>Workout</span>
      </div>
      <div className={`nav-item ${active === "progress" ? "active" : ""}`} onClick={() => onNavigate && onNavigate('progress')}>
        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
        <span>Progress</span>
      </div>
      <div className={`nav-item ${active === "profile" ? "active" : ""}`} onClick={() => onNavigate && onNavigate('profile')}>
        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
        <span>Profile</span>
      </div>
    </div>
  );
}
