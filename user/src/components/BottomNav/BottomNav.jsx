import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./bottomNav.css";

const BottomNav = ({ dark }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Icônes SVG personnalisées
  const icons = {
    home: (isActive) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 10L12 3L21 10"
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
          fill={isActive ? "currentColor" : "none"}
          fillOpacity={isActive ? "0.15" : "0"}
        />
      </svg>
    ),

    style: (isActive) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8"/>
        <line x1="20" y1="4" x2="8.12" y2="15.88" stroke="currentColor" strokeWidth="1.8"/>
        <line x1="14.47" y1="14.48" x2="20" y2="20" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),

    chat: (isActive) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={isActive ? "currentColor" : "none"}
          fillOpacity={isActive ? "0.15" : "0"}
        />
      </svg>
    ),

    blog: (isActive) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.8"
          fill={isActive ? "currentColor" : "none"}
          fillOpacity={isActive ? "0.15" : "0"}
        />
        <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="7" y1="16" x2="13" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),

    profile: (isActive) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="8"
          r="4"
          stroke="currentColor"
          strokeWidth="1.8"
          fill={isActive ? "currentColor" : "none"}
          fillOpacity={isActive ? "0.15" : "0"}
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
    { path: "/dashboard", icon: icons.home, label: "Home" },
    { path: "/styles", icon: icons.style, label: "Styles" },
    { path: "/chat", icon: icons.chat, label: "Chat" },
    { path: "/blog", icon: icons.blog, label: "Blog" },
    { path: "/profile", icon: icons.profile, label: "Profil" }
  ];

  return (
    <nav className={`bottom-nav ${dark ? "dark" : "light"}`}>
      <div className="bottom-nav-container">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">
                {item.icon(isActive)}
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
