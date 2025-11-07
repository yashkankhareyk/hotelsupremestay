import { connectDB } from '../config/db.js';
import { AdminUser } from '../models/AdminUser.js';
import { GalleryImage } from '../models/GalleryImage.js';
import { HomeImage } from '../models/HomeImage.js';
import { hashPassword } from '../utils/password.js';

async function run() {
  await connectDB();

  const username = 'admin';
  // Use environment variable for password, or generate a secure one
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  
  if (password === 'Admin@123' && process.env.NODE_ENV === 'production') {
    console.error('ERROR: Using default password in production!');
    console.error('Please set ADMIN_PASSWORD environment variable.');
    process.exit(1);
  }
  
  const exists = await AdminUser.findOne({ username });
  if (!exists) {
    await AdminUser.create({
      username,
      email: 'admin@sunshinehotel.in',
      passwordHash: await hashPassword(password)
    });
    console.log('Admin created:', username);
    if (process.env.NODE_ENV !== 'production') {
      console.log('Default password:', password);
      console.log('⚠️  WARNING: Change this password immediately after first login!');
    }
  } else {
    console.log('Admin user already exists:', username);
  }

  // Seed some images if empty
  if (await GalleryImage.countDocuments() === 0) {
    await GalleryImage.insertMany([
      { url: 'https://images.unsplash.com/photo-1501117716987-c8e09f17eb1f?auto=format&fit=crop&w=1200&q=60', alt: 'Poolside at dusk', order: 0 },
      { url: 'https://images.unsplash.com/photo-1496412705862-e0088f16f791?auto=format&fit=crop&w=1200&q=60', alt: 'City hotel pool', order: 1 },
      { url: 'https://images.unsplash.com/photo-1508255139162-e1f7b7288ab7?auto=format&fit=crop&w=1200&q=60', alt: 'Resort pool', order: 2 }
    ]);
  }

  if (await HomeImage.countDocuments() === 0) {
    await HomeImage.insertMany([
      { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=60', alt: 'Hotel Exterior', section: 'hero', order: 0 },
      { url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=60', alt: 'Deluxe Room', section: 'property', order: 0 },
      { url: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=60', alt: 'Executive Suite', section: 'property', order: 1 }
    ]);
  }

  console.log('Seeding done');
  process.exit(0);
}
run().catch((e) => { console.error(e); process.exit(1); });