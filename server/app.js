import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xssClean from 'xss-clean';
import hpp from 'hpp';
import path from 'path';
import contactRoutes from './routes/contact.routes.js';
import compressRoutes from './routes/compress.routes.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import publicRoutes from './routes/public.routes.js';
import { env, isProd } from './config/config.js';
import { apilimiter } from './middleware/ratelimit.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

// For correct IP detection behind Render/Vercel proxy
app.set('trust proxy', 1);

// ✅ Configure Helmet safely for both dev and prod
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false, // disable CSP for APIs — avoids blocking CORS
  })
);

// ✅ Simplified & Safe CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',                     // local React dev
  'https://hotelsupremestay900.vercel.app',    // deployed frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked from origin: ${origin}`));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ✅ Handle preflight requests globally
app.options('*', cors());

// ✅ Essential middlewares
app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));
app.use(cookieParser());
app.use(compression());
app.use(mongoSanitize());
app.use(xssClean());
app.use(hpp());

// ✅ Static uploads
app.use('/uploads', express.static(path.resolve(env.uploadDir)));

// ✅ API rate limiter
app.use('/api', apilimiter);

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api', publicRoutes);
app.use('/api', compressRoutes);

// ✅ Health Check route for Render
app.get('/', (req, res) => {
  res.status(200).json({ message: '✅ Backend server running successfully.' });
});

// ✅ Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
