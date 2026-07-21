const jwt  = require("jsonwebtoken");
const User = require("../models/User");

// ── Sign JWT ──────────────────────────────────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/auth/signup
const signup = async (req, res) => {
  let { name, email, password, startDate } = req.body;
  email = email?.trim().toLowerCase();

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required" });
  }

  return res.status(403).json({ success: false, message: "Self-registration is disabled. Please contact the admin to create an account." });
};

// POST /api/auth/login
const login = async (req, res) => {
  let { email, password } = req.body;
  email = email?.trim().toLowerCase();
  password = password?.trim();

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password required" });
  }

  try {
    console.log('🔐 Auth login attempt:', email);
    // Include password for comparison (excluded by default via toJSON transform)
    const user = await User.findOne({ email }).select("+password");
    console.log('🔍 User lookup result:', user ? `${user.email} (${user.role})` : 'not found');
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const match = await user.matchPassword(password);
    console.log('🔑 Password match:', match);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = signToken(user._id);
    res.json({
      success: true,
      token,
      role:  user.role,
      name:  user.name,
      id:    user._id,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
const me = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// POST /api/auth/logout  (JWT is stateless — client just drops the token)
const logout = (_req, res) => {
  res.json({ success: true, message: "Logged out" });
};

module.exports = { signup, login, logout, me };
