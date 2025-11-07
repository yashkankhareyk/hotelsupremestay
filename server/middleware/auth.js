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

export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: isProd,
  path: '/',
  maxAge: 24 * 60 * 60 * 1000
};