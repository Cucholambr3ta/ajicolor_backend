const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file to Cloudinary
 * @param {string} filePath - The local path of the file to upload
 * @param {string} folder - The folder in Cloudinary to upload to (default: 'ajicolor_products')
 * @returns {Promise<object>} - The Cloudinary upload result
 */
const uploadImage = async (filePath, folder = 'ajicolor_products') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      use_filename: true,
      unique_filename: false,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  }
};

module.exports = { cloudinary, uploadImage };
