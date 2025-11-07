import path from 'path';
import fs from 'fs';
import createError from 'http-errors';
import { GalleryImage } from '../models/GalleryImage.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { compressImageFile } from '../utils/imageCompress.js';

export const listGallery = asyncHandler(async (req, res) => {
  const items = await GalleryImage.find().sort({ order: 1, createdAt: 1 });
  res.json(items);
});

export const createGallery = asyncHandler(async (req, res) => {
  let url = req.body.url;
  let publicId = null;
  let meta = {};
  
  // If a file was uploaded
  if (req.file) {
    let compressedPath = null;
    
    try {
      // Try to compress the image first
      const compressed = await compressImageFile(req.file.path);
      compressedPath = compressed.path;
      
      // Upload compressed image to Cloudinary
      const result = await uploadToCloudinary(compressed.path, 'gallery');
      url = result.secure_url;
      publicId = result.public_id;
      meta = { 
        originalSize: req.file.size,
        compressedSize: compressed.size,
        quality: compressed.quality,
        format: compressed.format,
        mime: 'image/webp',
        width: result.width,
        height: result.height
      };
      
      // Delete both original and compressed files after upload
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (e) {
        console.error('Error deleting original file:', e);
      }
      try {
        if (compressedPath && fs.existsSync(compressedPath)) {
          fs.unlinkSync(compressedPath);
        }
      } catch (e) {
        console.error('Error deleting compressed file:', e);
      }
    } catch (error) {
      console.error('Image compression error, falling back to original:', error);
      
      // Fallback: upload original image if compression fails
      try {
        const result = await uploadToCloudinary(req.file.path, 'gallery');
        url = result.secure_url;
        publicId = result.public_id;
        meta = {
          size: req.file.size,
          mime: req.file.mimetype,
          width: result.width,
          height: result.height
        };
        
        // Delete original file after upload
        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (e) {
          console.error('Error deleting original file:', e);
        }
        
        // Clean up compressed file if it was created
        try {
          if (compressedPath && fs.existsSync(compressedPath)) {
            fs.unlinkSync(compressedPath);
          }
        } catch (e) {
          console.error('Error cleaning up compressed file:', e);
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        
        // Clean up files on error
        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (e) {
          console.error('Error cleaning up original file:', e);
        }
        try {
          if (compressedPath && fs.existsSync(compressedPath)) {
            fs.unlinkSync(compressedPath);
          }
        } catch (e) {
          console.error('Error cleaning up compressed file:', e);
        }
        
        throw createError(500, `Image upload failed: ${uploadError.message}`);
      }
    }
  }
  
  if (!url) throw createError(400, 'Image URL or file is required');

  const doc = await GalleryImage.create({
    url,
    publicId,
    alt: req.body.alt,
    order: req.body.order || 0,
    meta
  });
  res.status(201).json(doc);
});

export const updateGallery = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findById(req.params.id);
  if (!image) throw createError(404, 'Image not found');
  
  let url = req.body.url || image.url;
  let publicId = image.publicId;
  let meta = { ...image.meta };
  
  // If a new file was uploaded
  if (req.file) {
    // Delete old image from Cloudinary if it exists
    if (image.publicId) {
      try {
        await deleteFromCloudinary(image.publicId);
      } catch (e) {
        console.error('Error deleting old Cloudinary image:', e);
      }
    }
    
    let compressedPath = null;
    
    try {
      // Try to compress the new image first
      const compressed = await compressImageFile(req.file.path);
      compressedPath = compressed.path;
      
      // Upload compressed image to Cloudinary
      const result = await uploadToCloudinary(compressed.path, 'gallery');
      url = result.secure_url;
      publicId = result.public_id;
      meta = {
        originalSize: req.file.size,
        compressedSize: compressed.size,
        quality: compressed.quality,
        format: compressed.format,
        mime: 'image/webp',
        width: result.width,
        height: result.height
      };
      
      // Delete both original and compressed files after upload
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (e) {
        console.error('Error deleting original file:', e);
      }
      try {
        if (compressedPath && fs.existsSync(compressedPath)) {
          fs.unlinkSync(compressedPath);
        }
      } catch (e) {
        console.error('Error deleting compressed file:', e);
      }
    } catch (error) {
      console.error('Image compression error, falling back to original:', error);
      
      // Fallback: upload original image if compression fails
      try {
        const result = await uploadToCloudinary(req.file.path, 'gallery');
        url = result.secure_url;
        publicId = result.public_id;
        meta = {
          size: req.file.size,
          mime: req.file.mimetype,
          width: result.width,
          height: result.height
        };
        
        // Delete original file after upload
        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (e) {
          console.error('Error deleting original file:', e);
        }
        
        // Clean up compressed file if it was created
        try {
          if (compressedPath && fs.existsSync(compressedPath)) {
            fs.unlinkSync(compressedPath);
          }
        } catch (e) {
          console.error('Error cleaning up compressed file:', e);
        }
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        
        // Clean up files on error
        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (e) {
          console.error('Error cleaning up original file:', e);
        }
        try {
          if (compressedPath && fs.existsSync(compressedPath)) {
            fs.unlinkSync(compressedPath);
          }
        } catch (e) {
          console.error('Error cleaning up compressed file:', e);
        }
        
        throw createError(500, `Image upload failed: ${uploadError.message}`);
      }
    }
  } else if (req.body.url && image.publicId) {
    // If updating to a URL and there's an existing publicId, delete the old image
    await deleteFromCloudinary(image.publicId);
    publicId = null;
  }
  
  const doc = await GalleryImage.findByIdAndUpdate(
    req.params.id, 
    { 
      $set: {
        url,
        publicId,
        alt: req.body.alt !== undefined ? req.body.alt : image.alt,
        order: req.body.order !== undefined ? req.body.order : image.order,
        meta
      }
    }, 
    { new: true }
  );
  
  res.json(doc);
});

export const deleteGallery = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findById(req.params.id);
  if (!image) throw createError(404, 'Image not found');
  
  // Delete from Cloudinary if it has a publicId
  if (image.publicId) {
    await deleteFromCloudinary(image.publicId);
  }
  
  await GalleryImage.findByIdAndDelete(req.params.id);
  res.status(204).send();
});