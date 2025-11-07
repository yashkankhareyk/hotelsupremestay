import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String }, // Add this field for Cloudinary
    alt: { type: String, required: true },
    order: { type: Number, default: 0 },
    meta: { type: Object, default: {} } // Updated to match HomeImage structure
  },
  { timestamps: true }
);
schema.index({ order: 1, createdAt: 1 });
export const GalleryImage = mongoose.model('GalleryImage', schema);