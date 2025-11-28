// server/middleware/auth.js
import createError from 'http-errors';
import { env, isProd } from '../config/config.js';
import { verifyJwt } from '../utils/jwt.js';

export function authGuard(req, res, next) {
  try {
    const token = req.cookies[env.cookieName];
    if (!token) throw createError(401, 'Unauthorized');
    const payload = verifyJwt(token);
    req.user = payload;
    next();
  } catch {
    next(createError(401, 'Unauthorized'));
  }
}

// Cookie options suitable for cross-origin (Vercel frontend -> Render backend)
export const cookieOptions = {
  httpOnly: true,
  secure: true,           // Required for cross-site cookies (HTTPS always on Render & Vercel)
  sameSite: 'none',       // Allows frontend <-> backend cookie sharing
  path: '/',
  maxAge: 24 * 60 * 60 * 1000
};



