import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import GoogleLoginButton from "./components/GoogleLoginButton";
import Dashboard         from "./components/Dashboard";
import BottomNav         from "./components/BottomNav/BottomNav";

import TopNavBar from "./components/TopNav/TopNavBar";

import SettingsPage from "./components/Settings/Settings";
import Sidebar from "./components/SideBar/SideBar";

function Layout({ dark, setDark }) {
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showNav = location.pathname !== "/";

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar  = () => setSidebarOpen(false);

  return (
    <>
      {showNav && (
        <TopNavBar
          dark={dark}
          setDark={setDark}
          openSidebar={toggleSidebar}   // passe toggleSidebar ici
        />
      )}

      {/* Sidebar séparé */}
      <Sidebar
        dark={dark}
        isOpen={sidebarOpen}
        closeSidebar={closeSidebar}
      />

      <Routes>
        <Route path="/"            element={<GoogleLoginButton />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route
          path="/settings"
          element={<SettingsPage dark={dark} setDark={setDark} />}
        />
      </Routes>

      {showNav && <BottomNav  dark={dark} />}
    </>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark-mode" : "light-mode"}>
      <Layout dark={dark} setDark={setDark} />
    </div>
  );
}