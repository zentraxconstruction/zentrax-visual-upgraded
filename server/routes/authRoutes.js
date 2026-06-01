const router = require("express").Router();
const { login, signup, logout, me } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login",  login);
router.post("/logout", requireAuth, logout);
router.get("/me",      requireAuth, me);

module.exports = router;
