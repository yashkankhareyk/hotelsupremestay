import { v2 as cloudinary } from 'cloudinary';
import { env, isProd } from '../config/config.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret
});

/**
 * Upload an image to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folder - Folder to upload to in Cloudinary
 * @returns {Promise<Object>} - Cloudinary upload response
 */
export const uploadToCloudinary = async (filePath, folder = 'sunshine_hotel') => {
  try {
    // Check if Cloudinary is configured
    if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
      throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
    }
    
    if (!filePath) {
      throw new Error('File path is required for upload');
    }
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'auto'
    });
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    console.error('Error details:', {
      message: error.message,
      http_code: error.http_code,
      name: error.name
    });
    throw new Error(`Failed to upload image to Cloudinary: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<Object>} - Cloudinary deletion response
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    if (!isProd) {
      console.error('Error deleting from Cloudinary:', error);
    }
    throw new Error('Failed to delete image');
  }
};