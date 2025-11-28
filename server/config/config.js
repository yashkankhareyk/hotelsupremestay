import 'dotenv/config';

const required = (k) => {
  if (!process.env[k]) throw new Error(`Missing env: ${k}`);
  return process.env[k];
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: required('MONGO_URI'),
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  cookieName: process.env.COOKIE_NAME || 'sh_jwt',
  csrfCookieName: process.env.CSRF_COOKIE_NAME || 'sh_csrf',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxUploadBytes: Number(process.env.MAX_UPLOAD_MB || 5) * 1024 * 1024,

  // ADD THIS LINE ↓↓↓↓↓↓↓
  cookieDomain: process.env.COOKIE_DOMAIN || "",

  // Cloudinary configuration
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

  // Email configuration (optional)
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  toEmail: process.env.TO_EMAIL || 'admin@sunshinehotel.in'
};


export const isProd = env.nodeEnv === 'production';

// Validate production requirements
if (isProd) {
  // JWT Secret strength validation
  if (env.jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters in production');
  }
  
  // Cloudinary validation (required for image uploads)
  if (!env.cloudinaryCloudName || !env.cloudinaryApiKey || !env.cloudinaryApiSecret) {
    console.warn('⚠️  WARNING: Cloudinary credentials not set. Image uploads will fail.');
  }
  
  // Email validation (optional but warn if TO_EMAIL is set without credentials)
  if (env.toEmail && (!env.emailUser || !env.emailPass)) {
    console.warn('⚠️  WARNING: TO_EMAIL is set but EMAIL_USER/EMAIL_PASS are missing. Email notifications will fail.');
  }
}
