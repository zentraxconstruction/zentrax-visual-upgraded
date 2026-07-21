import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import RightPopup from "../components/ui/RightPopup";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f7f1e8", fontFamily: "Outfit, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
          <img src={logo} alt="Zentrax Logo" style={{ width: 64, height: 64, objectFit: "contain", filter: "brightness(1.3) saturate(1.2)" }} />
          <div style={{ paddingTop: "0.15rem" }}>
            <div style={{ fontSize: "0.9rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#c9a84c" }}>ZENTRAX</div>
            <div style={{ fontSize: "0.8rem", color: "#aaa" }}>Construction Portal</div>
          </div>
        </div>
      </header>

      <main style={{ display: "grid", placeItems: "center", minHeight: "calc(100vh - 90px)", padding: "2rem" }}>
        <div style={{ maxWidth: 900, width: "100%", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "0.8rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#c9a84c" }}>
            Welcome to Zentrax
          </p>
          <div style={{ display: "flex", justifyContent: "center", margin: "0 auto 2.5rem", maxWidth: 440 }}>
            <img
              src={logo}
              alt="Zentrax hero logo"
              style={{
                width: "100%",
                maxWidth: 440,
                height: "auto",
                objectFit: "contain",
                filter: "brightness(1.45) saturate(1.3)",
                boxShadow: "0 0 56px rgba(201,168,76,0.26)",
                borderRadius: "1rem",
                display: "block"
              }}
            />
          </div>
          <h1 style={{ margin: "0 0 1rem", fontSize: "clamp(2.75rem, 4vw, 4.75rem)", lineHeight: 1.02, letterSpacing: "-0.04em" }}>
            Your construction project portal starts here.
          </h1>
          <p style={{ maxWidth: 680, margin: "1rem auto 2.5rem", color: "#d7d0c4", lineHeight: 1.9, fontSize: "1rem" }}>
            Access real-time updates, assign teams, and manage progress with a single login. New here? Create your account and take the first step toward better construction management.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
            <Link to="/login" style={{ minWidth: 150, padding: "1rem 1.8rem", borderRadius: 9999, background: "#c9a84c", color: "#0a0a0a", fontWeight: 700, textDecoration: "none" }}>
              Login
            </Link>
          </div>

          <div style={{ marginTop: "3rem", color: "#aaa", fontSize: "0.95rem" }}>
            <p>Want to view the full website first?</p>
            <Link to="/landing" style={{ color: "#c9a84c", textDecoration: "underline" }}>
              Explore the full landing page</Link>
            .
          </div>
        </div>
      </main>

      <RightPopup>
        <div style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.28em', color: '#d4af37', fontWeight: 700 }}>HIRE TODAY</div>
          </div>
          <h3 style={{ margin: '10px 0 6px', fontSize: 22, color: '#fff' }}>3000+ Workers Available</h3>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 1.5 }}>Get instant workforce support for construction projects, site supervision, and manual labor.</p>
          <ul style={{ marginTop: 12, paddingLeft: 18, color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>
            <li>2D 3D Plan</li>
            <li>Construction & Lease</li>
            <li>Labour Support</li>
          </ul>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <Link to="/landing#contact" style={{ background: '#d4af37', color: '#081015', padding: '8px 12px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Hire Workers</Link>
            <Link to="/landing#contact" style={{ background: 'transparent', color: '#d4af37', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(212,175,55,0.18)', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </RightPopup>
    </div>
  );
}
