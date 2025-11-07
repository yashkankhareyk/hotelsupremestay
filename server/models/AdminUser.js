import mongoose from 'mongoose';
const schema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, lowercase: true },
    email: { type: String, unique: true, sparse: true, lowercase: true },
    passwordHash: { type: String, required: true },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ['admin'], default: 'admin' }
  },
  { timestamps: true }
);
schema.virtual('isLocked').get(function () {
  return this.lockUntil && this.lockUntil > Date.now();
});
export const AdminUser = mongoose.model('AdminUser', schema);