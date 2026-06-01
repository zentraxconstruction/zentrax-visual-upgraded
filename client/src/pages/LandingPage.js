// LandingPage.js — shell that wraps the static landing content.
// The original index.html content (hero, about, services, contact sections)
// can be progressively migrated into sub-components here.
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [status, setStatus] = useState("");

  const handleContact = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res  = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      setStatus(data.success ? "sent" : "error");
      if (data.success) setContactForm({ name:"", email:"", phone:"", service:"", message:"" });
    } catch { setStatus("error"); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#f0ece4", fontFamily:"Outfit,sans-serif" }}>
      {/* Nav */}
      <nav style={{ padding:"1.25rem 2rem", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid rgba(201,168,76,0.1)" }}>
        <span style={{ fontFamily:"Montserrat,sans-serif", fontWeight:800, letterSpacing:"0.2em", color:"#c9a84c", fontSize:"1.1rem" }}>ZENTRAX</span>
        <Link to="/login" style={{ padding:"0.55rem 1.4rem", background:"#c9a84c", color:"#0a0a0a", fontFamily:"Montserrat,sans-serif", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", textDecoration:"none" }}>
          Client Login
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ textAlign:"center", padding:"6rem 2rem 4rem" }}>
        <h1 style={{ fontFamily:"Montserrat,sans-serif", fontSize:"clamp(2rem,6vw,4rem)", fontWeight:800, letterSpacing:"0.05em", marginBottom:"1rem" }}>
          Building <span style={{ color:"#c9a84c" }}>Excellence</span>
        </h1>
        <p style={{ color:"#888", maxWidth:520, margin:"0 auto 2.5rem", lineHeight:1.7, fontSize:"1rem" }}>
          Premium construction and architecture services tailored to your vision. Track every milestone in real time.
        </p>
        <Link to="/login" style={{ padding:"0.9rem 2.5rem", background:"#c9a84c", color:"#0a0a0a", fontFamily:"Montserrat,sans-serif", fontWeight:700, fontSize:"0.68rem", letterSpacing:"0.2em", textTransform:"uppercase", textDecoration:"none" }}>
          Access Your Project Portal
        </Link>
      </section>

      {/* Contact */}
      <section style={{ maxWidth:600, margin:"0 auto", padding:"4rem 2rem" }}>
        <h2 style={{ fontFamily:"Montserrat,sans-serif", fontSize:"0.7rem", letterSpacing:"0.3em", textTransform:"uppercase", color:"#c9a84c", marginBottom:"2rem", textAlign:"center" }}>
          Contact Us
        </h2>
        {status === "sent" && <div style={{ background:"rgba(100,180,100,0.1)", border:"1px solid rgba(100,180,100,0.3)", color:"#7ecb7e", padding:"0.75rem 1rem", marginBottom:"1rem", fontSize:"0.85rem" }}>Message sent! We'll be in touch.</div>}
        {status === "error" && <div style={{ background:"rgba(220,50,50,0.1)", border:"1px solid rgba(220,50,50,0.3)", color:"#ff6b6b", padding:"0.75rem 1rem", marginBottom:"1rem", fontSize:"0.85rem" }}>Something went wrong. Please try again.</div>}
        <form onSubmit={handleContact}>
          {[["name","Name *"],["email","Email *"],["phone","Phone"],["service","Service"]].map(([k,l]) => (
            <div key={k} style={{ marginBottom:"1rem" }}>
              <label style={{ display:"block", fontFamily:"Montserrat,sans-serif", fontSize:"0.58rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"#888", marginBottom:"0.4rem" }}>{l}</label>
              <input type={k==="email"?"email":"text"} value={contactForm[k]} onChange={(e) => setContactForm({ ...contactForm, [k]: e.target.value })}
                required={k==="name"||k==="email"}
                style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(201,168,76,0.15)", color:"#f0ece4", fontFamily:"Outfit,sans-serif", fontSize:"0.9rem", padding:"0.7rem 0.9rem", outline:"none" }} />
            </div>
          ))}
          <div style={{ marginBottom:"1.25rem" }}>
            <label style={{ display:"block", fontFamily:"Montserrat,sans-serif", fontSize:"0.58rem", letterSpacing:"0.18em", textTransform:"uppercase", color:"#888", marginBottom:"0.4rem" }}>Message *</label>
            <textarea rows={4} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required
              style={{ width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(201,168,76,0.15)", color:"#f0ece4", fontFamily:"Outfit,sans-serif", fontSize:"0.9rem", padding:"0.7rem 0.9rem", outline:"none", resize:"vertical" }} />
          </div>
          <button type="submit" disabled={status==="sending"}
            style={{ padding:"0.85rem 2rem", background:"#c9a84c", color:"#0a0a0a", fontFamily:"Montserrat,sans-serif", fontWeight:700, fontSize:"0.65rem", letterSpacing:"0.2em", textTransform:"uppercase", border:"none", cursor:"pointer" }}>
            {status === "sending" ? "Sending…" : "Send Message"}
          </button>
        </form>
      </section>
    </div>
  );
}
