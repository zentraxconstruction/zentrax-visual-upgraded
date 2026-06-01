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
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

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
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ZENTRAX server → http://localhost:${PORT}`);
});
