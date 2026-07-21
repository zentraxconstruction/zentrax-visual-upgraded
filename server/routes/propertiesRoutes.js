const router = require("express").Router();
const Property = require("../models/Property");
const { normalizePropertyGallery } = require("../utils/propertyGallery");

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const query = { displayOnWebsite: true, isHidden: false };
    const docs = await Property.find(query).sort({ isFeatured: -1, createdAt: -1 }).lean();
    const normalized = docs.map(normalizePropertyGallery);
    const data = limit ? normalized.slice(0, Number(limit)) : normalized;
    res.json({ success: true, data, total: docs.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, displayOnWebsite: true, isHidden: false }).lean();
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });
    res.json({ success: true, data: normalizePropertyGallery(property) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
