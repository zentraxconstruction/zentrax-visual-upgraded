const cloudinary = require('cloudinary').v2;

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

const missingCreds = !CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET;
const placeholderCreds = [CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET].some(
  (value) => typeof value === 'string' && value.toUpperCase().includes('YOUR_'),
);

if (missingCreds || placeholderCreds) {
  const errorMessage =
    'Cloudinary credentials are missing or invalid. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env.';
  console.error('[CLOUDINARY] CONFIG ERROR:', {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: CLOUDINARY_API_KEY ? '<redacted>' : null,
    CLOUDINARY_API_SECRET: CLOUDINARY_API_SECRET ? '<redacted>' : null,
  });
  throw new Error(errorMessage);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

console.log('[CLOUDINARY] configured for cloud:', CLOUDINARY_CLOUD_NAME);

module.exports = cloudinary;