import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"Montserrat,sans-serif" }}>
      <div style={{ color:"#c9a84c", fontSize:"4rem", fontWeight:800, letterSpacing:"0.1em" }}>404</div>
      <p style={{ color:"#888", fontSize:"0.75rem", letterSpacing:"0.3em", textTransform:"uppercase", margin:"1rem 0 2rem" }}>Page Not Found</p>
      <Link to="/" style={{ padding:"0.65rem 1.75rem", background:"#c9a84c", color:"#0a0a0a", fontSize:"0.62rem", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", textDecoration:"none" }}>
        Back Home
      </Link>
    </div>
  );
}
