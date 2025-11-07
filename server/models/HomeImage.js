import mongoose from 'mongoose';

const homeImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String }, // Add this field for Cloudinary
  alt: { type: String, required: true },
  section: { type: String, required: true, enum: ['hero', 'property', 'testimonial'] },
  order: { type: Number, default: 0 },
  meta: { type: Object, default: {} }
}, { timestamps: true });

export const HomeImage = mongoose.model('HomeImage', homeImageSchema);