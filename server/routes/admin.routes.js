import { Router } from 'express';
import csurf from 'csurf';
import { env } from '../config/config.js';
import { authGuard } from '../middleware/auth.js';
import { validate, Schemas } from '../middleware/validate.js';
import { uploadImage } from '../utils/multer.js';
import {
  listGallery, createGallery, updateGallery, deleteGallery
} from '../controllers/gallery.controller.js';
import {
  listHomeImages, createHomeImage, updateHomeImage, deleteHomeImage
} from '../controllers/home.controller.js';

const router = Router();
const csrf = csurf({ cookie: { key: env.csrfCookieName, httpOnly: false, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' } });

router.use(authGuard, csrf);

// Gallery
router.get('/gallery', listGallery);
router.post('/gallery', uploadImage.single('image'), validate(Schemas.galleryCreate), createGallery);
router.put('/gallery/:id', uploadImage.single('image'), validate(Schemas.galleryUpdate), updateGallery);
router.delete('/gallery/:id', validate(Schemas.idParam), deleteGallery);

// Home images
router.get('/home-images', listHomeImages);
router.post('/home-images', uploadImage.single('image'), validate(Schemas.homeCreate), createHomeImage);
router.put('/home-images/:id', uploadImage.single('image'), validate(Schemas.homeUpdate), updateHomeImage);
router.delete('/home-images/:id', validate(Schemas.idParam), deleteHomeImage);

export default router;