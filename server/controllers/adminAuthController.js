const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Admin = require("../models/Admin");
const AdminOtp = require("../models/AdminOtp");
const nodemailer = require("nodemailer");

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "zentrax1234@gmail.com").trim().toLowerCase();
const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
});

const login = async (req, res) => {
  let { email, password } = req.body;
  email = email?.trim().toLowerCase();

  if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });
  if (email !== ADMIN_EMAIL) return res.status(401).json({ success: false, message: "Unauthorized Admin Email." });

  try {
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await admin.matchPassword(password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = signToken(admin._id);
    res.json({ success: true, token, role: admin.role, email: admin.email, id: admin._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const forgot = async (req, res) => {
  let { email } = req.body;
  email = email?.trim().toLowerCase();
  if (!email) return res.status(400).json({ success: false, message: "Email required" });
  if (email !== ADMIN_EMAIL) return res.status(401).json({ success: false, message: "Unauthorized Admin Email." });

  try {
    const otp = (crypto.randomInt(0, 1000000) + 1000000).toString().slice(-6);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);
    await AdminOtp.create({ email, otp, expiresAt });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `Zentrax <${process.env.SMTP_USER || ADMIN_EMAIL}>`,
      to: email,
      subject: "Zentrax Admin OTP",
      text: `Your Zentrax admin OTP is: ${otp}. It expires in 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error("Forgot OTP error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

const verifyOtp = async (req, res) => {
  let { email, otp } = req.body;
  email = email?.trim().toLowerCase();
  otp = otp?.trim();
  if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });
  if (email !== ADMIN_EMAIL) return res.status(401).json({ success: false, message: "Unauthorized Admin Email." });

  try {
    const record = await AdminOtp.findOne({ email, otp, used: false }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (record.expiresAt < new Date()) return res.status(400).json({ success: false, message: "OTP expired" });

    record.used = true;
    await record.save();

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });
    res.json({ success: true, resetToken });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken, password } = req.body;
  if (!resetToken || !password) return res.status(400).json({ success: false, message: "Token and password required" });

  try {
    const payload = jwt.verify(resetToken, process.env.JWT_SECRET);
    const email = (payload.email || "").trim().toLowerCase();
    if (email !== ADMIN_EMAIL) return res.status(401).json({ success: false, message: "Unauthorized Admin Email." });

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) return res.status(400).json({ success: false, message: "Admin not found" });

    admin.password = password;
    await admin.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { login, forgot, verifyOtp, resetPassword };
