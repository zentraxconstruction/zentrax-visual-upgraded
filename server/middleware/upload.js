const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

console.log('[UPLOAD] initializing CloudinaryStorage');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "zentrax-projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;