import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./bottomNav.css";

const BottomNav = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  /* ── ICONS ── */

  const icons = {

    home: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 10L12 3L21 10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 10V20H19V10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? "0.15" : "0"}
        />
      </svg>
    ),

    style: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <line x1="20" y1="4" x2="8.12" y2="15.88" stroke="currentColor" strokeWidth="1.8"/>
        <line x1="14.47" y1="14.48" x2="20" y2="20" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),

    chat: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? "0.15" : "0"}
        />
      </svg>
    ),

    blog: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? "0.15" : "0"}
        />
      </svg>
    ),

    profile: (active) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="8"
          r="4"
          stroke="currentColor"
          strokeWidth="1.8"
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? "0.15" : "0"}
        />
        <path
          d="M4 20c0-4 4-6 8-6s8 2 8 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )

  };

  const navItems = [
    { path: "/home", icon: icons.home, label: "Home" },
    { path: "/styles", icon: icons.style, label: "Styles" },
    { path: "/chat", icon: icons.chat, label: "Chat" },
    { path: "/blog", icon: icons.blog, label: "Blog" },
    { path: "/profile", icon: icons.profile, label: "Profil" }
  ];

  return (
    <nav className={`bottom-nav ${theme}`}>
      <div className="bottom-nav-container">

        {navItems.map((item) => {

          const active = location.pathname === item.path;

          return (
            <button
              key={item.path}
              className={`nav-item ${active ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >

              <span className="nav-icon">
                {item.icon(active)}
              </span>

              <span className="nav-label">
                {item.label}
              </span>

            </button>
          );
        })}

      </div>
    </nav>
  );
};

export default BottomNav;