import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { env } from '../config/config.js';
import { v4 as uuid } from 'uuid';

const dir = path.resolve(env.uploadDir);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuid()}${ext}`);
  }
});

function fileFilter(req, file, cb) {
  const ok = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype);
  if (!ok) return cb(new Error('Only image files are allowed'), false);
  cb(null, true);
}

export const uploadImage = multer({
  storage,
  limits: { fileSize: env.maxUploadBytes },
  fileFilter
});