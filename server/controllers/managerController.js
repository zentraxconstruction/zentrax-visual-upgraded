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
  getMyProjects, updateProgress,
  getMilestones, addMilestone, toggleMilestone,
  addUpload, getUploads,
  getSpecs, addSpec,
};
