import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./topNavBar.css";
import logo from "../../assets/zamologo.png";

/* THEME CONTEXT */
import { useTheme } from "../../context/ThemeContext";

/* ── ICONS ── */
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const CloseSearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const SunIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

/* ── ICON BUTTON ── */
const IconBtn = ({ onClick, title, children, theme, active }) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`icon-btn ${theme}${active ? " active" : ""}`}
    >
      {children}
    </button>
  );
};

/* ══════════════════ TOP NAVBAR ══════════════════ */

export default function TopNavBar({ openSidebar }) {

  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 90);
    } else {
      setQuery("");
    }
  }, [searchOpen]);

  return (
    <div className="nav-fixed-wrapper">

      <nav className={`navbar ${theme}`}>

        <IconBtn onClick={openSidebar} title="Menu" theme={theme}>
          <MenuIcon />
        </IconBtn>

        <div className="nav-logo" onClick={() => navigate("/dashboard")}>
          <div className="nav-logo-icon">
            <img src={logo} alt="logo" className="nav-logo-img" />
          </div>
        </div>

        <div className="nav-spacer" />

        <IconBtn
          onClick={() => setSearchOpen(v => !v)}
          title="Rechercher"
          theme={theme}
          active={searchOpen}
        >
          <SearchIcon />
        </IconBtn>

        <IconBtn
          onClick={toggleTheme}
          title={theme === "dark" ? "Mode clair" : "Mode sombre"}
          theme={theme}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </IconBtn>

      </nav>

      <div className={`search-bar-wrap${searchOpen ? " open" : ""}`}>

        <div className={`search-bar-inner ${theme}`}>

          <div className="search-bar-pill" />

          <span className={`search-bar-icon ${theme}`}>
            <SearchIcon />
          </span>

          <input
            ref={inputRef}
            className={`search-field ${theme}`}
            placeholder="Rechercher quelque chose…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />

          {query.length > 0 && (
            <span className={`search-char-count ${theme}`}>
              {query.length} car.
            </span>
          )}

          <button
            className={`search-close-btn ${theme}`}
            onClick={() => setSearchOpen(false)}
            title="Fermer"
          >
            <CloseSearchIcon />
          </button>

        </div>

      </div>

    </div>
  );
}