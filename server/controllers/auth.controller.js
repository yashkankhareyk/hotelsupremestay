import createError from 'http-errors';
import { AdminUser } from '../models/AdminUser.js';
import { comparePassword } from '../utils/password.js';
import { signJwt } from '../utils/jwt.js';
import { cookieOptions } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { env } from '../config/config.js';

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

export const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const query = username ? { username: username.toLowerCase() } : { email: email.toLowerCase() };
  const user = await AdminUser.findOne({ ...query, isActive: true });
  if (!user) throw createError(401, 'Invalid credentials');

  if (user.isLocked) throw createError(423, 'Account locked. Try again later.');

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) {
    user.loginAttempts += 1;
    if (user.loginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_MS);
      user.loginAttempts = 0;
    }
    await user.save();
    throw createError(401, 'Invalid credentials');
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  const token = signJwt({ id: user._id.toString(), role: user.role, username: user.username });
  res.cookie(env.cookieName, token, cookieOptions);
  res.json({ id: user._id, username: user.username, role: user.role });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ id: req.user.id, username: req.user.username, role: req.user.role || 'admin' });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie(env.cookieName, { path: '/' });
  res.status(204).send();
});