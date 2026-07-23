const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const { body, query, validationResult } = require("express-validator");
const ctrl = require("../controllers/adminAuthController");
const { requireAdminAuth } = require("../middleware/adminAuth");

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, message: "Too many login attempts, try later" } });

router.post(
  "/login",
  loginLimiter,
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: "Invalid input" });
    next();
  },
  ctrl.login
);

router.get(
  "/check-email",
  query("email").isEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: "Invalid email" });
    next();
  },
  ctrl.checkEmail
);

router.get("/me", requireAdminAuth, (req, res) => ctrl.me(req, res));

router.post("/forgot", body("email").isEmail(), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: "Invalid email" });
  next();
}, ctrl.forgot);

router.post("/verify-otp", body("email").isEmail(), body("otp").isLength({ min: 6, max: 6 }), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: "Invalid input" });
  next();
}, ctrl.verifyOtp);

router.post("/reset", body("resetToken").notEmpty(), body("password").isLength({ min: 6 }), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: "Invalid input" });
  next();
}, ctrl.resetPassword);

module.exports = router;
