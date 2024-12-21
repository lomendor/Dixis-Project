const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file to Cloudinary
exports.uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'dixis/products',
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      resource_type: 'auto'
    });

    // Delete file from local storage
    fs.unlinkSync(filePath);
    
    return result;
  } catch (error) {
    // Delete file from local storage in case of error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

// Delete file from Cloudinary
exports.deleteFromCloudinary = async (imageUrl) => {
  try {
    // Extract public_id from URL
    const publicId = imageUrl
      .split('/')
      .slice(-2)
      .join('/')
      .split('.')[0];

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw error;
  }
}; 