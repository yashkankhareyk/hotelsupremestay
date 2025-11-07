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

import { env, isProd } from './config/config.js';
import { apiLimiter } from './middleware/rateLimit.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import publicRoutes from './routes/public.routes.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

app.set('trust proxy', 1);

// Enhanced security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", env.corsOrigin]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration - allow multiple origins in production
const corsOptions = {
  origin: isProd 
    ? (origin, callback) => {
        const allowedOrigins = env.corsOrigin.split(',').map(o => o.trim());
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    : env.corsOrigin,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));
app.use(cookieParser());

app.use(compression());
app.use(mongoSanitize());
app.use(xssClean());
app.use(hpp());

// Static uploads
app.use('/uploads', express.static(path.resolve(env.uploadDir)));

// Global rate limit for API
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api', compressRoutes);

// 404 + error
app.use(notFound);
app.use(errorHandler);

export default app;