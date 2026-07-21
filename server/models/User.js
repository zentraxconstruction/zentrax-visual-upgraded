const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true, minlength: 6 },
    role:      { type: String, enum: ["admin", "manager", "client"], required: true },
    isActive:  { type: Boolean, default: true },
    startDate: { type: Date },
  },
  { timestamps: true }
);

// Hash password before save (only if modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare passwords
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

// Remove password from JSON output
userSchema.set("toJSON", {
  transform: (_, obj) => { delete obj.password; return obj; },
});

module.exports = mongoose.model("User", userSchema);
