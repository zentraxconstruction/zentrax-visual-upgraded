import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useLocation } from "react-router-dom";

export default function Layout({ children, hideSidebar = false }) {
  const location = useLocation();
  const isDashboardRoute =
    location.pathname &&
    (location.pathname.startsWith("/admin") || location.pathname.startsWith("/manager") || location.pathname.startsWith("/client"));

  return (
    <div className="zentrax-container">
      {!hideSidebar && !isDashboardRoute && <Sidebar />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: 16, borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
          <Topbar />
        </div>
        <main className="zentrax-main">{children}</main>
      </div>
    </div>
  );
}
