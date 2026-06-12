const User          = require("../models/User");
const Project       = require("../models/Project");
const Milestone     = require("../models/Milestone");
const { Upload, Specification } = require("../models/index");

// GET /api/manager/projects
const getMyProjects = async (req, res) => {
  try {
    const data = await Project.find({ managerId: req.user._id })
      .populate("clientId", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/manager/projects
const addProject = async (req, res) => {
  try {
    console.log('[MANAGER] addProject - req.user:', req.user ? req.user._id : null);
    console.log('[MANAGER] addProject - body:', req.body);
    console.log('[MANAGER] addProject - files:', req.files);

    const { title, description, location, status } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title required",
      });
    }

    // Get Cloudinary URLs
    const imageUrls = Array.isArray(req.files)
      ? req.files
          .map((file) => file.path || file.url || file.secure_url || file.secureUrl)
          .filter(Boolean)
      : [];

    console.log('[MANAGER] addProject - imageUrls:', imageUrls);

    const project = await Project.create({
      title,
      description,
      location,
      status: status || "pending",
      managerId: req.user._id,
      images: imageUrls,
    });

    res.json({
      success: true,
      id: project._id,
      images: imageUrls,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// PUT /api/manager/projects/:id/progress
const updateProgress = async (req, res) => {
  const { completion, status } = req.body;
  try {
    await Project.findOneAndUpdate(
      { _id: req.params.id, managerId: req.user._id },
      { completion, status }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, managerId: req.user._id });
    if (!project) return res.status(404).json({ success: false, message: "Project not found or not owned by manager" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Milestones ────────────────────────────────────────────────────────────────
const getMilestones = async (req, res) => {
  try {
    const data = await Milestone.find({ projectId: req.params.id }).sort({ createdAt: 1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addMilestone = async (req, res) => {
  const { title, description, date } = req.body;
  try {
    const milestone = await Milestone.create({ projectId: req.params.id, title, description, date });
    res.json({ success: true, id: milestone._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleMilestone = async (req, res) => {
  try {
    const m = await Milestone.findById(req.params.id);
    if (!m) return res.status(404).json({ success: false, message: "Not found" });
    m.completed = !m.completed;
    await m.save();
    res.json({ success: true, completed: m.completed });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Uploads ───────────────────────────────────────────────────────────────────
const addUpload = async (req, res) => {
  const { project_id, filename, caption } = req.body;
  try {
    const upload = await Upload.create({
      projectId: project_id,
      uploaderId: req.user._id,
      filename,
      caption,
    });
    res.json({ success: true, id: upload._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

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
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password are required" });
  }
  try {
    const user = await User.create({ name, email, password, role: "client" });
    res.json({ success: true, id: user._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const removeClient = async (req, res) => {
  try {
    await User.findOneAndDelete({ _id: req.params.id, role: "client" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getUploads = async (req, res) => {
  try {
    const data = await Upload.find({ projectId: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Specifications ────────────────────────────────────────────────────────────
const getSpecs = async (req, res) => {
  try {
    const data = await Specification.find({ projectId: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addSpec = async (req, res) => {
  const { title, content } = req.body;
  try {
    const spec = await Specification.create({ projectId: req.params.id, title, content });
    res.json({ success: true, id: spec._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getMyProjects, addProject, updateProgress,
  getMilestones, addMilestone, toggleMilestone,
  deleteProject,
  getClients, addClient, removeClient,
  addUpload, getUploads,
  getSpecs, addSpec,
};
