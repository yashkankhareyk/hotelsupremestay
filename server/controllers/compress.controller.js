import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import createError from 'http-errors';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/config.js';

export const compressImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw createError(400, 'No image file provided');
  }

  const originalPath = req.file.path;
  const compressedDir = path.resolve(env.uploadDir, 'compressed');
  
  // Ensure compressed directory exists
  if (!fs.existsSync(compressedDir)) {
    fs.mkdirSync(compressedDir, { recursive: true });
  }

  // Generate output filename (replace extension with .webp)
  const originalName = path.basename(req.file.filename, path.extname(req.file.filename));
  const outputPath = path.join(compressedDir, `${originalName}.webp`);

  try {
    // Helper function to compress with specific quality
    const compressWithQuality = async (quality) => {
      return await sharp(originalPath)
        .resize(900, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality })
        .toBuffer();
    };

    const targetMinSize = 300 * 1024; // 300 KB
    const targetMaxSize = 500 * 1024; // 500 KB
    
    // Start with 60% quality
    let quality = 60;
    let compressedBuffer = await compressWithQuality(quality);
    let fileSize = compressedBuffer.length;

    // Adjust quality if file size is not in target range
    if (fileSize > targetMaxSize) {
      // Reduce quality until we're under 500 KB
      while (fileSize > targetMaxSize && quality > 30) {
        quality -= 5;
        compressedBuffer = await compressWithQuality(quality);
        fileSize = compressedBuffer.length;
      }
    } else if (fileSize < targetMinSize && quality < 85) {
      // Increase quality if file is too small (up to 85% to stay safe)
      let previousBuffer = compressedBuffer;
      let previousQuality = quality;
      
      while (fileSize < targetMinSize && quality < 85) {
        previousBuffer = compressedBuffer;
        previousQuality = quality;
        quality += 5;
        compressedBuffer = await compressWithQuality(quality);
        fileSize = compressedBuffer.length;
        
        // If increasing quality pushes us over max, use previous buffer
        if (fileSize > targetMaxSize) {
          compressedBuffer = previousBuffer;
          quality = previousQuality;
          fileSize = previousBuffer.length;
          break;
        }
      }
    }

    // Write compressed image to disk
    fs.writeFileSync(outputPath, compressedBuffer);

    // Delete original file
    fs.unlinkSync(originalPath);

    // Return relative path from upload directory
    const relativePath = path.relative(path.resolve(env.uploadDir), outputPath);
    const fileUrl = `/uploads/${relativePath.replace(/\\/g, '/')}`;

    res.json({
      success: true,
      path: fileUrl,
      size: fileSize,
      quality: quality,
      format: 'webp'
    });
  } catch (error) {
    // Clean up original file if compression fails
    if (fs.existsSync(originalPath)) {
      fs.unlinkSync(originalPath);
    }
    throw createError(500, `Image compression failed: ${error.message}`);
  }
});

