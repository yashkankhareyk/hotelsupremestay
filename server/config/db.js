import mongoose from 'mongoose';
import { env, isProd } from './config.js';

export async function connectDB() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.mongoUri, { 
    autoIndex: !isProd // Disable auto-indexing in production for performance
  });
  if (!isProd) {
    console.log('MongoDB connected');
  }
}