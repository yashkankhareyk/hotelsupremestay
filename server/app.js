// app.js
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

// If behind a proxy (Render/Vercel) allow correct IP and secure cookies detection
app.set('trust proxy', 1);

// Helmet - keep CSP disabled for API-only server to avoid accidental blocking of requests
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

// Build an explicit allowed origins list (adjust entries as needed)
const allowedOrigins = [
  'http://localhost:5173',                     // local dev (Vite)
  'https://hotelsupremestay900.vercel.app',    // deployed frontend
  'https://hotelsupremestay.onrender.com'      // optional: allow backend origin for direct calls if needed
];

// CORS config: allow credentials and proper origins
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked from origin: ${origin}`));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Ensure preflight OPTIONS requests succeed
app.options('*', cors());

// Logging & body parsers
app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));

// Cookie parser must be before csurf usage in routes (csurf reads cookies)
app.use(cookieParser());

// Security middlewares
app.use(compression());
app.use(mongoSanitize());
app.use(xssClean());
app.use(hpp());

// Static uploads
if (env.uploadDir) {
  app.use('/uploads', express.static(path.resolve(env.uploadDir)));
}

// Rate limit on /api prefix
app.use('/api', apilimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api', publicRoutes);
app.use('/api', compressRoutes);

// Health check - supports GET and HEAD (Render uses HEAD sometimes)
app.head('/', (req, res) => res.status(200).end());
app.get('/', (req, res) =>
  res.status(200).json({ message: '✅ Backend server running successfully.' })
);

// 404 + error handlers (must be after routes)
app.use(notFound);
app.use(errorHandler);

export default app;
