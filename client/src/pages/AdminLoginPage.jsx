import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const OFFICIAL = "zentrax1234@gmail.com";

export default function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(OFFICIAL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (email.trim().toLowerCase() !== OFFICIAL) {
      setError("Only the official Zentrax Admin account can log in.");
      return;
    }
    setLoading(true);
    try {
      await adminLogin(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Login</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign In"}</button>
        </div>
      </form>
      <div style={{ marginTop: 12 }}>
        <Link to="/admin/forgot">Forgot password?</Link>
      </div>
      <div style={{ marginTop: 12 }}>
        <Link to="/login">Back to regular login</Link>
      </div>
    </div>
  );
}
