const User        = require("../models/User");
const Project     = require("../models/Project");
const { Feedback, Upload } = require("../models/index");
const bcrypt      = require("bcryptjs");

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [total, ongoing, completed, pending, managers, clients] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: "ongoing" }),
      Project.countDocuments({ status: "completed" }),
      Project.countDocuments({ status: "pending" }),
      User.countDocuments({ role: "manager" }),
      User.countDocuments({ role: "client" }),
    ]);

    res.json({ success: true, stats: { total, ongoing, completed, pending, managers, clients } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Managers ──────────────────────────────────────────────────────────────────
const getManagers = async (req, res) => {
  try {
    const data = await User.find({ role: "manager" }).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addManager = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: "All fields required" });
  try {
    const user = await User.create({ name, email, password, role: "manager" });
    res.json({ success: true, id: user._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeManager = async (req, res) => {
  try {
    await User.findOneAndDelete({ _id: req.params.id, role: "manager" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Projects ──────────────────────────────────────────────────────────────────
const getProjects = async (req, res) => {
  try {
    const data = await Project.find()
      .populate("clientId",  "name email")
      .populate("managerId", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addProject = async (req, res) => {
  const { title, description, location, clientId, managerId, startDate } = req.body;
  if (!title) return res.status(400).json({ success: false, message: "Title required" });
  try {
    const project = await Project.create({
      title,
      description,
      location,
      clientId,
      managerId,
      startDate: startDate ? new Date(startDate) : undefined,
    });
    res.json({ success: true, id: project._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const assignProject = async (req, res) => {
  try {
    await Project.findByIdAndUpdate(req.params.id, { managerId: req.body.managerId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Clients ───────────────────────────────────────────────────────────────────
const getClients = async (req, res) => {
  try {
    const data = await User.find({ role: "client" }).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addClient = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: "All fields required" });
  try {
    const user = await User.create({ name, email, password, role: "client" });
    res.json({ success: true, id: user._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Feedback & Uploads ────────────────────────────────────────────────────────
const getFeedback = async (req, res) => {
  try {
    const data = await Feedback.find()
      .populate("clientId",  "name")
      .populate("projectId", "title")
      .sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUploads = async (req, res) => {
  try {
    const data = await Upload.find()
      .populate("projectId",  "title")
      .populate("uploaderId", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getStats, getManagers, addManager, removeManager,
  getProjects, addProject, assignProject, deleteProject,
  getClients, addClient, getFeedback, getUploads,
};
