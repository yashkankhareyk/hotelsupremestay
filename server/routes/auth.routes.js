import { Router } from 'express';
import csurf from 'csurf';
import { env, isProd } from '../config/config.js';
import { login, logout, me } from '../controllers/auth.controller.js';
import { validate, Schemas } from '../middleware/validate.js';
import { loginlimiter } from '../middleware/ratelimit.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

// CSRF middleware with cross-origin safe cookie
const csrf = csurf({
  cookie: {
    key: env.csrfCookieName || 'sh_csrf',
    httpOnly: false,            // allow client JS to read
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,             // true in prod (HTTPS)
    maxAge: 60 * 60 * 1000      // 1 hour
  }
});

// SPA fetches this first
router.get('/csrf-token', csrf, (req, res) => {
  // Always set CSRF cookie for SPA to read
  res.cookie(env.csrfCookieName || 'sh_csrf', req.csrfToken(), {
    httpOnly: false,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    path: '/',
  });
  res.json({ csrfToken: req.csrfToken() });
});

// Login: CSRF is NOT required for first-time login
router.post('/login', loginlimiter, validate(Schemas.login), login);

// Logout: CSRF required
router.post('/logout', csrf, logout);

// /me: Auth required, CSRF not needed for GET
router.get('/me', authGuard, me);

export default router;
