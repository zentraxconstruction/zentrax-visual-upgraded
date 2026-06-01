import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./DashboardLayout.css";

export default function DashboardLayout({ title, navItems, children }) {
  const { user, logout } = useAuth();
  const navigate          = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dash-shell">
      {/* ── Sidebar ────────────────────────────────────── */}
      <aside className={`dash-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="dash-brand">
          <span className="dash-brand-name">ZENTRAX</span>
          <span className="dash-brand-sub">CONSTRUCTION</span>
        </div>

        <nav className="dash-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `dash-nav-link ${isActive ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="dash-nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="dash-user-card">
          <div className="dash-user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="dash-user-name">{user?.name}</div>
            <div className="dash-user-role">{user?.role}</div>
          </div>
        </div>

        <button className="dash-logout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main ───────────────────────────────────────── */}
      <main className="dash-main">
        <header className="dash-header">
          <button
            className="dash-hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <h1 className="dash-page-title">{title}</h1>
        </header>

        <div className="dash-content">{children}</div>
      </main>
    </div>
  );
}
