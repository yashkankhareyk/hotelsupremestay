import path from 'path';
import fs from 'fs';
import createError from 'http-errors';
import { HomeImage } from '../models/HomeImage.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { compressImageFile } from '../utils/imageCompress.js';

export const listHomeImages = asyncHandler(async (req, res) => {
  const { section } = req.query;
  const filter = section ? { section } : {};
  const items = await HomeImage.find(filter).sort({ section: 1, order: 1, createdAt: 1 });
  res.json(items);
});

export const createHomeImage = asyncHandler(async (req, res) => {
  try {
    console.log('=== createHomeImage called ===');
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Has file:', !!req.file);
    if (req.file) {
      console.log('File info:', {
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
      console.log('File exists:', fs.existsSync(req.file.path));
    }
    
    let url = req.body.url;
    let publicId = null;
    
    // Parse meta if it's a string (from FormData)
    let meta = {};
    if (req.body.meta) {
      try {
        meta = typeof req.body.meta === 'string' ? JSON.parse(req.body.meta) : req.body.meta;
        if (typeof meta !== 'object' || meta === null) {
          meta = {};
        }
      } catch (e) {
        console.error('Error parsing meta:', e);
        meta = {};
      }
    }
    
    // If a file was uploaded
    if (req.file) {
      let compressedPath = null;
      
      try {
        // Try to compress the image first
        const compressed = await compressImageFile(req.file.path);
        compressedPath = compressed.path;
        
        // Upload compressed image to Cloudinary
        const result = await uploadToCloudinary(compressed.path, 'home');
        url = result.secure_url;
        publicId = result.public_id;
        
        // Add file metadata to the meta object
        meta = { 
          ...meta,
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
        console.error('Error stack:', error.stack);
        
        // Fallback: upload original image if compression fails
        try {
          const result = await uploadToCloudinary(req.file.path, 'home');
          url = result.secure_url;
          publicId = result.public_id;
          
          // Add file metadata (without compression info)
          meta = { 
            ...meta,
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
          console.error('Upload error stack:', uploadError.stack);
          
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
    
    // Handle metadata from FormData (when fields come as separate form fields)
    // These fields are sent separately in FormData, not inside a meta object
    const section = req.body.section;
    if (section === 'property') {
      // Property section metadata - handle both FormData fields and meta object
      if (req.body.description !== undefined && req.body.description !== null && req.body.description !== '') {
        meta.description = req.body.description;
      }
      if (req.body.rating !== undefined && req.body.rating !== null && req.body.rating !== '') {
        const rating = parseFloat(req.body.rating);
        meta.rating = isNaN(rating) ? 4.8 : rating;
      }
      if (req.body.bookingUrl !== undefined && req.body.bookingUrl !== null && req.body.bookingUrl !== '') {
        meta.bookingUrl = req.body.bookingUrl;
      }
    } else if (section === 'testimonial') {
      // Testimonial section metadata - handle both FormData fields and meta object
      if (req.body.name !== undefined && req.body.name !== null && req.body.name !== '') {
        meta.name = req.body.name;
      }
      if (req.body.rating !== undefined && req.body.rating !== null && req.body.rating !== '') {
        const rating = parseFloat(req.body.rating);
        meta.rating = isNaN(rating) ? 4.8 : rating;
      }
      if (req.body.comment !== undefined && req.body.comment !== null && req.body.comment !== '') {
        meta.comment = req.body.comment;
      }
    }
    
    if (!url) throw createError(400, 'Image URL or file is required');
    
    // Validate required fields
    if (!req.body.alt) throw createError(400, 'Alt text is required');
    if (!req.body.section) throw createError(400, 'Section is required');
    if (!['hero', 'property', 'testimonial'].includes(req.body.section)) {
      throw createError(400, 'Invalid section. Must be hero, property, or testimonial');
    }
    
    // Parse order as integer (handle FormData which sends strings)
    let finalOrder = 0;
    if (req.body.order !== undefined && req.body.order !== null && req.body.order !== '') {
      const order = typeof req.body.order === 'string' ? parseInt(req.body.order, 10) : req.body.order;
      finalOrder = isNaN(order) ? 0 : order;
    }

    // Create the document with proper error handling
    let doc;
    try {
      doc = await HomeImage.create({
        url,
        publicId,
        alt: req.body.alt,
        section: req.body.section,
        order: finalOrder,
        meta
      });
    } catch (dbError) {
      console.error('Database error creating home image:', dbError);
      console.error('Database error stack:', dbError.stack);
      throw createError(500, `Failed to save image: ${dbError.message}`);
    }
    
    res.status(201).json(doc);
  } catch (error) {
    // Log the full error for debugging
    console.error('Error in createHomeImage:', error);
    console.error('Error stack:', error.stack);
    
    // Re-throw the error so it can be handled by the error middleware
    throw error;
  }
});

export const updateHomeImage = asyncHandler(async (req, res) => {
  const image = await HomeImage.findById(req.params.id);
  if (!image) throw createError(404, 'Home image not found');
  
  let url = req.body.url || image.url;
  let publicId = image.publicId;
  let meta = { ...(image.meta || {}) };
  
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
    let useCompressed = false;
    
    try {
      // Try to compress the new image first
      const compressed = await compressImageFile(req.file.path);
      compressedPath = compressed.path;
      useCompressed = true;
      
      // Upload compressed image to Cloudinary
      const result = await uploadToCloudinary(compressed.path, 'home');
      url = result.secure_url;
      publicId = result.public_id;
      
      // Update meta with compression details
      meta = {
        ...meta,
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
        const result = await uploadToCloudinary(req.file.path, 'home');
        url = result.secure_url;
        publicId = result.public_id;
        
        // Update meta (without compression info)
        meta = {
          ...meta,
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
    try {
      await deleteFromCloudinary(image.publicId);
      publicId = null;
    } catch (e) {
      console.error('Error deleting Cloudinary image:', e);
    }
  }
  
  // Handle meta field update
  if (req.body.meta) {
    try {
      const newMeta = typeof req.body.meta === 'string' ? JSON.parse(req.body.meta) : req.body.meta;
      // Merge with existing meta data instead of replacing it completely
      meta = { ...meta, ...newMeta };
    } catch (e) {
      console.error('Error parsing meta field:', e);
      // If parsing fails, try to merge as-is
      meta = { ...meta, ...req.body.meta };
    }
  }
  
  // Handle metadata from FormData (when fields come as separate form fields)
  const section = req.body.section || image.section;
  if (section === 'property') {
    // Property section metadata
    if (req.body.description !== undefined) meta.description = req.body.description;
    if (req.body.rating !== undefined) meta.rating = parseFloat(req.body.rating) || 4.8;
    if (req.body.bookingUrl !== undefined) meta.bookingUrl = req.body.bookingUrl;
  } else if (section === 'testimonial') {
    // Testimonial section metadata
    if (req.body.name !== undefined) meta.name = req.body.name;
    if (req.body.rating !== undefined) meta.rating = parseFloat(req.body.rating) || 4.8;
    if (req.body.comment !== undefined) meta.comment = req.body.comment;
  }
  
  const doc = await HomeImage.findByIdAndUpdate(
    req.params.id, 
    { 
      $set: {
        url,
        publicId,
        alt: req.body.alt !== undefined ? req.body.alt : image.alt,
        section: req.body.section !== undefined ? req.body.section : image.section,
        order: req.body.order !== undefined ? req.body.order : image.order,
        meta
      }
    }, 
    { new: true }
  );
  
  res.json(doc);
});

export const deleteHomeImage = asyncHandler(async (req, res) => {
  const image = await HomeImage.findById(req.params.id);
  if (!image) throw createError(404, 'Home image not found');
  
  // Delete from Cloudinary if it has a publicId
  if (image.publicId) {
    await deleteFromCloudinary(image.publicId);
  }
  
  await HomeImage.findByIdAndDelete(req.params.id);
  res.status(204).send();
});