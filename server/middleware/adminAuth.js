const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const requireAdminAuth = async (req, res, next) => {
  const token = req.headers["x-auth-token"] || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized — no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) return res.status(401).json({ success: false, message: "Admin not found" });
    if (admin.email !== (process.env.ADMIN_EMAIL || "zentrax1234@gmail.com").trim().toLowerCase()) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = { requireAdminAuth };
