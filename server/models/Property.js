const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    propertyType: { type: String, required: true, trim: true },
    propertyCategory: { type: String, default: "Residential", trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, default: "", trim: true },
    state: { type: String, default: "", trim: true },
    country: { type: String, default: "India", trim: true },
    pinCode: { type: String, default: "", trim: true },
    floors: { type: String, default: "", trim: true },
    availability: { type: String, default: "Available", trim: true },
    suitableFor: { type: String, default: "Families", trim: true },
    description: { type: String, default: "", trim: true },
    features: [{ type: String, trim: true }],
    // Gallery images are owned by this property document only.
    // Legacy single-image records (such as Hombelaku) remain readable.
    image: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    galleryImages: [{ type: String }],
    googleMap: { type: String, default: "", trim: true },
    contactNumber: { type: String, default: "", trim: true },
    whatsappNumber: { type: String, default: "", trim: true },
    status: { type: String, default: "Available", trim: true },
    isFeatured: { type: Boolean, default: false },
    displayOnWebsite: { type: Boolean, default: true },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
