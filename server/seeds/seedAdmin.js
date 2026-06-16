const Admin = require("../models/Admin");

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "zentrax1234@gmail.com").trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "zentraxconstructionabc@4321";

async function seedAdmin() {
  try {
    const existing = await Admin.findOne({ email: ADMIN_EMAIL }).select("+password");
    if (existing) {
      existing.password = ADMIN_PASSWORD;
      existing.markModified("password");
      await existing.save();
      console.log("Updated admin password for:", ADMIN_EMAIL);
      return;
    }

    await Admin.create({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: "admin", isVerified: true });
    console.log("Seeded admin:", ADMIN_EMAIL);
  } catch (err) {
    console.error("Failed to seed admin:", err);
  }
}

module.exports = seedAdmin;
