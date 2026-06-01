const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected → ${conn.connection.host}`);

    // Seed default users & demo data on first connect
    await seedDatabase();
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

async function seedDatabase() {
  const User    = require("../models/User");
  const Project = require("../models/Project");
  const Milestone = require("../models/Milestone");
  const bcrypt  = require("bcryptjs");

  console.log("🌱 Seeding default users and demo data (upsert mode)...");

  async function upsertUser(name, email, password, role) {
    let u = await User.findOne({ email });
    if (u) {
      u.name = name;
      u.password = password; // plain text -> pre-save hook will hash
      u.role = role;
      await u.save();
      console.log(`🔁 Updated user: ${email}`);
      return u;
    }
    u = await User.create({ name, email, password, role });
    console.log(`✨ Created user: ${email}`);
    return u;
  }

  const admin = await upsertUser("Admin User", "admin@zentrax.com", "admin123", "admin");
  const manager = await upsertUser("Ravi Kumar", "manager@zentrax.com", "manager123", "manager");
  const client = await upsertUser("Priya Sharma", "client@zentrax.com", "client123", "client");

  // Create a demo project if it doesn't exist
  let project = await Project.findOne({ title: "Whitefield Villa" });
  if (!project) {
    project = await Project.create({
      title: "Whitefield Villa",
      description: "4BHK luxury villa construction",
      location: "Whitefield, Bengaluru",
      clientId: client._id,
      managerId: manager._id,
      status: "ongoing",
      completion: 65,
      startDate: new Date("2025-01-15"),
    });

    await Milestone.insertMany([
      { projectId: project._id, title: "Foundation Completed", completed: true, date: new Date("2025-02-10") },
      { projectId: project._id, title: "Plinth Beam Done", completed: true, date: new Date("2025-03-05") },
      { projectId: project._id, title: "Ground Floor Slab", completed: false, date: new Date("2025-06-01") },
    ]);
    console.log("✅ Demo project and milestones created");
  } else {
    console.log("ℹ️ Demo project already exists; skipping project creation");
  }

  console.log("✅ Seed complete. Demo credentials:");
  console.log("   admin@zentrax.com   / admin123");
  console.log("   manager@zentrax.com / manager123");
  console.log("   client@zentrax.com  / client123");
}

module.exports = connectDB;
