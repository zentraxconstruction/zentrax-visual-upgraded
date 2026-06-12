import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const OFFICIAL = "zentrax1234@gmail.com";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState(OFFICIAL);
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const requestOtp = async () => {
    setError(""); setMessage("");
    if (email.trim().toLowerCase() !== OFFICIAL) {
      setError("Only the official Zentrax Admin account can use Forgot Password.");
      return;
    }
    try {
      await api.post("/admin/auth/forgot", { email });
      setMessage("OTP sent to admin email.");
    } catch (err) { setError(err.message); }
  };

  const verify = async () => {
    setError(""); setMessage("");
    try {
      const data = await api.post("/admin/auth/verify-otp", { email, otp });
      setResetToken(data.resetToken);
      setMessage("OTP verified — enter new password.");
    } catch (err) { setError(err.message); }
  };

  const reset = async () => {
    setError(""); setMessage("");
    try {
      await api.post("/admin/auth/reset", { resetToken, password });
      setMessage("Password reset successful — you can now log in.");
    } catch (err) { setError(err.message); }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Forgot Password</h2>
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={requestOtp}>Send OTP</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>OTP</label>
        <input value={otp} onChange={(e) => setOtp(e.target.value)} />
        <button onClick={verify}>Verify OTP</button>
      </div>

      {resetToken && (
        <div style={{ marginTop: 12 }}>
          <label>New Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={reset}>Reset Password</button>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <Link to="/admin/login">Back to Admin Login</Link>
      </div>
    </div>
  );
}
