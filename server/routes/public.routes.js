import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { GalleryImage } from '../models/GalleryImage.js';
import { HomeImage } from '../models/HomeImage.js';
import { validate, Schemas } from '../middleware/validate.js';
import { submitContact } from '../controllers/contact.controller.js';

const router = Router();

router.get('/public/gallery', asyncHandler(async (req, res) => {
  const items = await GalleryImage.find().sort({ order: 1, createdAt: 1 });
  res.json(items);
}));

router.get('/public/home-images', asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.section) filter.section = req.query.section;
  const items = await HomeImage.find(filter).sort({ section: 1, order: 1 });
  res.json(items);
}));

router.post('/public/contact', validate(Schemas.contactCreate), submitContact);

export default router;