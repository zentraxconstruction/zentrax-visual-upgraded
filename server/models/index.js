const mongoose = require("mongoose");

// ── Upload ────────────────────────────────────────────────────────────────────
const uploadSchema = new mongoose.Schema(
  {
    projectId:  { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    filename:   { type: String },   // base64 data URL or file path
    caption:    { type: String, default: "" },
  },
  { timestamps: true }
);

// ── Specification ─────────────────────────────────────────────────────────────
const specificationSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title:     { type: String, trim: true },
    content:   { type: String },
  },
  { timestamps: true }
);

// ── Feedback ──────────────────────────────────────────────────────────────────
const feedbackSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    clientId:  { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message:   { type: String, required: true },
    rating:    { type: Number, default: 5, min: 1, max: 5 },
  },
  { timestamps: true }
);

// ── Favorite ──────────────────────────────────────────────────────────────────
const favoriteSchema = new mongoose.Schema(
  {
    clientId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true }
);
favoriteSchema.index({ clientId: 1, projectId: 1 }, { unique: true });

// ── Contact ───────────────────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true },
    phone:   { type: String, default: "" },
    service: { type: String, default: "" },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = {
  Upload:        mongoose.model("Upload",        uploadSchema),
  Specification: mongoose.model("Specification", specificationSchema),
  Feedback:      mongoose.model("Feedback",      feedbackSchema),
  Favorite:      mongoose.model("Favorite",      favoriteSchema),
  Contact:       mongoose.model("Contact",       contactSchema),
};
