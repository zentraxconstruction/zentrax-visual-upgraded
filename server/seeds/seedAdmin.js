const Admin = require("../models/Admin");

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "zentrax1234@gmail.com").trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe123!";

async function seedAdmin() {
  try {
    const existing = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log("Admin already exists:", ADMIN_EMAIL);
      return;
    }

    await Admin.create({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: "admin", isVerified: true });
    console.log("Seeded admin:", ADMIN_EMAIL);
  } catch (err) {
    console.error("Failed to seed admin:", err);
  }
}

module.exports = seedAdmin;
