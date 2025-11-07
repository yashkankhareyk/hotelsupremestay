import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { env } from '../config/config.js';

/**
 * Compress an image file to approximately 300-500 KB
 * @param {string} originalPath - Path to the original image file
 * @param {string} outputDir - Directory to save the compressed image (optional, defaults to compressed folder)
 * @param {string} outputFilename - Optional custom filename (without extension)
 * @returns {Promise<{path: string, size: number, quality: number, format: string}>}
 */
export const compressImageFile = async (originalPath, outputDir = null, outputFilename = null) => {
  if (!fs.existsSync(originalPath)) {
    throw new Error(`Original image file does not exist: ${originalPath}`);
  }

  // Determine output directory
  const compressedDir = outputDir || path.resolve(env.uploadDir, 'compressed');
  
  // Ensure compressed directory exists
  try {
    if (!fs.existsSync(compressedDir)) {
      fs.mkdirSync(compressedDir, { recursive: true });
    }
  } catch (error) {
    throw new Error(`Failed to create compressed directory: ${error.message}`);
  }

  // Generate output filename
  let outputPath;
  if (outputFilename) {
    outputPath = path.join(compressedDir, `${outputFilename}.webp`);
  } else {
    const originalName = path.basename(originalPath, path.extname(originalPath));
    outputPath = path.join(compressedDir, `${originalName}.webp`);
  }

  // Verify the image is valid before processing
  try {
    const testImage = sharp(originalPath);
    await testImage.metadata();
  } catch (error) {
    throw new Error(`Invalid image file: ${error.message}`);
  }

  // Helper function to compress with specific quality
  const compressWithQuality = async (quality) => {
    try {
      return await sharp(originalPath)
        .resize(900, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality })
        .toBuffer();
    } catch (error) {
      throw new Error(`Sharp compression failed: ${error.message}`);
    }
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
  try {
    fs.writeFileSync(outputPath, compressedBuffer);
  } catch (error) {
    throw new Error(`Failed to write compressed image: ${error.message}`);
  }

  return {
    path: outputPath,
    size: fileSize,
    quality: quality,
    format: 'webp'
  };
};

