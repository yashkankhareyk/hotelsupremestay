import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    message: String,
    status: { type: String, enum: ['new', 'read'], default: 'new' }
  },
  { timestamps: true }
);
export const ContactMessage = mongoose.model('ContactMessage', schema);