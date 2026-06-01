const { Contact } = require("../models");

// POST /api/contact — save form submission to MongoDB
const saveContact = async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, email and message are required."
    });
  }

  try {
    const contact = await Contact.create({ name, email, phone, service, message });
    console.log(`✅ Contact saved — id: ${contact._id}, name: ${name}`);
    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      id: contact._id,
    });
  } catch (err) {
    console.error("❌ DB insert error:", err.message);
    res.status(500).json({
      success: false,
      message: "Error saving data. Please try again.",
    });
  }
};

// GET /api/contacts — (optional) view all submissions
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { saveContact, getContacts };
