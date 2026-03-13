// App.js

import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/home/Home";
import Dashboard from "./components/Dashboard";
import SettingsPage from "./components/Settings/Settings";
import TopNavBar from "./components/TopNav/TopNavBar";
import BottomNav from "./components/BottomNav/BottomNav";
import Sidebar from "./components/SideBar/SideBar";

/* THEME */
import { useTheme } from "./context/ThemeContext";

function Layout() {

  const location = useLocation();
  const { theme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const showNav = location.pathname !== "/";

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>

      {/* Navbar */}
      {showNav && (
        <TopNavBar
          openSidebar={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      {showNav && (
        <Sidebar
          isOpen={sidebarOpen}
          closeSidebar={closeSidebar}
        />
      )}

      {/* Pages */}
      <div className={`page-wrapper ${theme}`}>

        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />

        </Routes>

      </div>

      {/* Bottom Nav */}
      {showNav && <BottomNav />}

    </>
  );
}

export default function App() {
  return <Layout />;
}