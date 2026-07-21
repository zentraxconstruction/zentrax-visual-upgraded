const User = require("../models/User");
const Project = require("../models/Project");
const Property = require("../models/Property");
const { Feedback, Upload } = require("../models/index");
const bcrypt = require("bcryptjs");
const { normalizePropertyGallery } = require("../utils/propertyGallery");

const normalizeBoolean = (value) => value === true || value === "true" || value === 1 || value === "1" || value === "on";

const normalizeFeatures = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
};

const parseGallery = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
};

const uploadedImageUrls = (files = []) => (Array.isArray(files) ? files : [])
  .map((file) => file?.path || file?.secure_url || file?.url)
  .filter(Boolean);

const buildPropertyPayload = (body, files = []) => {
  const payload = { ...body };
  if (payload.features !== undefined) payload.features = normalizeFeatures(payload.features);
  if (payload.displayOnWebsite !== undefined) payload.displayOnWebsite = normalizeBoolean(payload.displayOnWebsite);
  if (payload.isFeatured !== undefined) payload.isFeatured = normalizeBoolean(payload.isFeatured);
  if (payload.isHidden !== undefined) payload.isHidden = normalizeBoolean(payload.isHidden);

  const imageFiles = Array.isArray(files) ? files : files.images || [];
  const replacementFiles = Array.isArray(files) ? [] : files.replacementImages || [];
  const hasGallery = payload.galleryImages !== undefined;
  const galleryImages = parseGallery(payload.galleryImages);
  const replacementIndexes = parseGallery(payload.replacementIndexes);

  if (hasGallery || imageFiles.length || replacementFiles.length) {
    payload.galleryImages = [...galleryImages, ...uploadedImageUrls(imageFiles)];
    let coverImage = payload.coverImage || payload.galleryImages[0] || "";
    replacementIndexes.forEach((galleryIndex, fileIndex) => {
      const replacement = uploadedImageUrls([replacementFiles[fileIndex]])[0];
      const index = Number(galleryIndex);
      if (replacement && Number.isInteger(index) && payload.galleryImages[index]) {
        if (payload.galleryImages[index] === coverImage) coverImage = replacement;
        payload.galleryImages[index] = replacement;
      }
    });
    const coverIndex = payload.galleryImages.indexOf(coverImage);
    if (coverIndex > 0) {
      payload.galleryImages.splice(coverIndex, 1);
      payload.galleryImages.unshift(coverImage);
    }
    payload.coverImage = payload.galleryImages[0] || "";
  }
  delete payload.replacementIndexes;
  delete payload.gallery;
  return payload;
};
// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [total, ongoing, completed, pending, managers, clients, properties] = await Promise.all([
      Project.countDocuments(),
      Project.countDocuments({ status: "ongoing" }),
      Project.countDocuments({ status: "completed" }),
      Project.countDocuments({ status: "pending" }),
      User.countDocuments({ role: "manager" }),
      User.countDocuments({ role: "client" }),
      Property.countDocuments(),
    ]);

    res.json({ success: true, stats: { total, ongoing, completed, pending, managers, clients, properties } });
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
  const { name, email, password, isActive = true } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }
  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ success: false, message: "Email already exists" });
    const user = await User.create({ name, email: email.toLowerCase(), password, role: "manager", isActive });
    res.json({ success: true, id: user._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const update = { name, email: email?.toLowerCase() };
    if (password) update.password = password;
    const manager = await User.findOneAndUpdate({ _id: req.params.id, role: "manager" }, update, { new: true });
    if (!manager) return res.status(404).json({ success: false, message: "Manager not found" });
    res.json({ success: true, data: manager });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleManager = async (req, res) => {
  try {
    const manager = await User.findOne({ _id: req.params.id, role: "manager" });
    if (!manager) return res.status(404).json({ success: false, message: "Manager not found" });
    manager.isActive = !manager.isActive;
    await manager.save();
    res.json({ success: true, data: manager });
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
  const { name, email, password, isActive = true } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }
  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ success: false, message: "Email already exists" });
    const user = await User.create({ name, email: email.toLowerCase(), password, role: "client", isActive });
    res.json({ success: true, id: user._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const update = { name, email: email?.toLowerCase() };
    if (password) update.password = password;
    const client = await User.findOneAndUpdate({ _id: req.params.id, role: "client" }, update, { new: true });
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });
    res.json({ success: true, data: client });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleClient = async (req, res) => {
  try {
    const client = await User.findOne({ _id: req.params.id, role: "client" });
    if (!client) return res.status(404).json({ success: false, message: "Client not found" });
    client.isActive = !client.isActive;
    await client.save();
    res.json({ success: true, data: client });
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

// ── Properties ──────────────────────────────────────────────────────────────
const getProperties = async (req, res) => {
  try {
    const data = await Property.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: data.map(normalizePropertyGallery) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addProperty = async (req, res) => {
  try {
    const payload = buildPropertyPayload(req.body, req.files);
    const property = await Property.create(payload);
    res.json({ success: true, id: property._id, data: normalizePropertyGallery(property) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const payload = buildPropertyPayload(req.body, req.files);
    const property = await Property.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, data: normalizePropertyGallery(property) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const hideProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { isHidden: true, displayOnWebsite: false }, { new: true });
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, data: normalizePropertyGallery(property) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const showProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { isHidden: false, displayOnWebsite: true }, { new: true });
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, data: normalizePropertyGallery(property) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleFeaturedProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    property.isFeatured = !property.isFeatured;
    await property.save();
    res.json({ success: true, data: normalizePropertyGallery(property) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const uploadPropertyImages = async (req, res) => {
  try {
    const { propertyId, images } = req.body;
    if (!propertyId || !Array.isArray(images) || !images.length) {
      return res.status(400).json({ success: false, message: "Property id and images are required" });
    }
    const property = await Property.findByIdAndUpdate(propertyId, { $push: { galleryImages: { $each: images } } }, { new: true });
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, data: normalizePropertyGallery(property) });
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
  getStats, getManagers, addManager, updateManager, toggleManager, removeManager,
  getProjects, addProject, assignProject, deleteProject,
  getClients, addClient, updateClient, toggleClient, removeClient,
  getFeedback, getUploads,
  getProperties, addProperty, updateProperty, deleteProperty, hideProperty, showProperty, toggleFeaturedProperty, uploadPropertyImages,
};
