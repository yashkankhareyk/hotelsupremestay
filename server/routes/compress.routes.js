import { Router } from 'express';
import { uploadImage } from '../utils/multer.js';
import { compressImage } from '../controllers/compress.controller.js';

const router = Router();

// Image compression endpoint
router.post('/compress', uploadImage.single('image'), compressImage);

export default router;

