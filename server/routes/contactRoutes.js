const express = require("express");
const router = express.Router();
const { saveContact, getContacts } = require("../controllers/contactController");

// POST  /api/contact  → save a contact form submission
router.post("/contact", saveContact);

// GET   /api/contacts → list all submissions (useful for admin / debugging)
router.get("/contacts", getContacts);

module.exports = router;
