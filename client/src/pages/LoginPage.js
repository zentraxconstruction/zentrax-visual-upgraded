import React, { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";


export default function LoginPage() {
  const { user, login, adminLogin } = useAuth();
  const navigate                     = useNavigate();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  // Already logged in — go to dashboard
  if (user) return <Navigate to={`/${user.role}`} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const role = await login(email, password);
      navigate(`/${role}`, { replace: true });
    } catch (err) {
      // If client auth fails, try admin auth as a fallback
      try {
        const role = await adminLogin(email, password);
        navigate(`/${role}`, { replace: true });
        return;
      } catch (adminErr) {
        setError(adminErr.message || err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError("");
  };

  return (
    <div className="login-page">
      <div className="login-bg" />

      <div className="login-card">
        {/* Brand */}
        <div className="login-brand-row">
          <div className="login-brand">
            <span className="login-brand-name">ZENTRAX</span>
            <span className="login-brand-sub">CONSTRUCTION</span>
          </div>
        </div>

        <div className="login-divider" />
        <p className="login-title">Login Portal</p>

        {/* Error */}
        {error && <div className="login-error">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="login-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Signing In…" : "Sign In"}
          </button>
        </form>



        <div className="login-footer" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Link to="/">← Back to website</Link>
        </div>
      </div>
    </div>
  );
}
