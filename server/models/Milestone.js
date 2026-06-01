const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    projectId:   { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    completed:   { type: Boolean, default: false },
    date:        { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Milestone", milestoneSchema);
