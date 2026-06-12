require("dotenv").config();

console.log("MONGO_URI =", process.env.MONGO_URI);
const express  = require("express");
const cors     = require("cors");
const connectDB = require("./config/db");

const app = express();

// ── Connect MongoDB ───────────────────────────────────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Global request logger for debugging
app.use((req, res, next) => {
  try {
    console.log(`[REQ] ${req.method} ${req.originalUrl}`);
    console.log(`[REQ] headers: ${JSON.stringify(req.headers)}`);
  } catch (e) {}
  next();
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth",    require("./routes/authRoutes"));
app.use("/api/admin",   require("./routes/adminRoutes"));
app.use("/api/manager", require("./routes/managerRoutes"));
app.use("/api/client",  require("./routes/clientRoutes"));
app.use("/api",         require("./routes/contactRoutes"));

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ZENTRAX RBAC Backend Running ✅", db: "MongoDB" });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[ERROR HANDLER]', err);

  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.message && err.message.includes('Cloudinary')) {
    return res.status(500).json({ success: false, message: err.message });
  }

  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ZENTRAX server → http://localhost:${PORT}`);
});
