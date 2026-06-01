const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    location:    { type: String, default: "" },
    clientId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    managerId:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status:      { type: String, enum: ["ongoing", "completed", "pending"], default: "pending" },
    completion:  { type: Number, default: 0, min: 0, max: 100 },
    startDate:   { type: Date },
    endDate:     { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
