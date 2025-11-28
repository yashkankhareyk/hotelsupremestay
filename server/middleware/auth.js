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
  sameSite: isProd ? 'none' : 'lax', // 'none' needed for cross-site in prod
  secure: isProd,                   // true in prod (HTTPS only)
  path: '/',
  // Optional: set domain in production so the cookie is tied to frontend domain.
  // env.cookieDomain should be set in Render to e.g. "hotelsupremestay900.vercel.app"
  ...(isProd && env.cookieDomain ? { domain: env.cookieDomain } : {}),
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};
