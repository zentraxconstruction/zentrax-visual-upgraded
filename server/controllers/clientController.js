const Project   = require("../models/Project");
const Milestone = require("../models/Milestone");
const { Upload, Specification, Feedback, Favorite } = require("../models/index");

// GET /api/client/project
const getMyProject = async (req, res) => {
  try {
    const data = await Project.findOne({ clientId: req.user._id })
      .populate("managerId", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/client/projects/:id/photos
const getPhotos = async (req, res) => {
  try {
    const data = await Upload.find({ projectId: req.params.id })
      .populate("uploaderId", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/client/projects/:id/milestones
const getMilestones = async (req, res) => {
  try {
    const data = await Milestone.find({ projectId: req.params.id }).sort({ createdAt: 1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/client/projects/:id/specs
const getSpecs = async (req, res) => {
  try {
    const data = await Specification.find({ projectId: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/client/feedback
const submitFeedback = async (req, res) => {
  const { project_id, message, rating } = req.body;
  if (!message) return res.status(400).json({ success: false, message: "Message required" });
  try {
    const fb = await Feedback.create({ projectId: project_id, clientId: req.user._id, message, rating });
    res.json({ success: true, id: fb._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/client/feedback
const getMyFeedback = async (req, res) => {
  try {
    const data = await Feedback.find({ clientId: req.user._id })
      .populate("projectId", "title")
      .sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/client/favorites/toggle
const toggleFavorite = async (req, res) => {
  const { project_id } = req.body;
  try {
    const existing = await Favorite.findOne({ clientId: req.user._id, projectId: project_id });
    if (existing) {
      await existing.deleteOne();
      return res.json({ success: true, favorited: false });
    }
    await Favorite.create({ clientId: req.user._id, projectId: project_id });
    res.json({ success: true, favorited: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/client/favorites
const getFavorites = async (req, res) => {
  try {
    const favs = await Favorite.find({ clientId: req.user._id }).populate("projectId");
    const data  = favs.map((f) => f.projectId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getMyProject, getPhotos, getMilestones, getSpecs,
  submitFeedback, getMyFeedback, toggleFavorite, getFavorites,
};
