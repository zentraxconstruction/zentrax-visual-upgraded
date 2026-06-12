import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  // Hide the global sidebar on dashboard routes to avoid duplication
  if (
    location.pathname &&
    (location.pathname.startsWith("/admin") || location.pathname.startsWith("/manager") || location.pathname.startsWith("/client"))
  ) {
    return null;
  }

  return (
    <aside className="zentrax-sidebar" style={{ width: 260, padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--zentrax-gold)" }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>ZENTRAX</div>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Link to="/manager" style={{ color: "inherit", textDecoration: "none" }}>Dashboard</Link>
        <Link to="/manager/projects" style={{ color: "inherit", textDecoration: "none" }}>My Projects</Link>
        <Link to="/manager/add-project" style={{ color: "inherit", textDecoration: "none" }}>Add Project</Link>
        <Link to="/manager/clients" style={{ color: "inherit", textDecoration: "none" }}>Clients</Link>
        <Link to="/manager/services" style={{ color: "inherit", textDecoration: "none" }}>Services</Link>
        <Link to="/manager/profile" style={{ color: "inherit", textDecoration: "none" }}>Profile</Link>
      </nav>
    </aside>
  );
}
