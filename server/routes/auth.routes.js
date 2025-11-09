// routes/auth.routes.js
import { Router } from 'express';
import csurf from 'csurf';
import { env, isProd } from '../config/config.js';
import { login, logout, me } from '../controllers/auth.controller.js';
import { validate, Schemas } from '../middleware/validate.js';
import { loginlimiter } from '../middleware/ratelimit.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

/**
 * Configure csurf cookie options:
 * - httpOnly: false so SPA JS can read token value (we still store cookie; token value returned by req.csrfToken())
 * - sameSite: 'none' for cross-site context (production) + secure: true requires HTTPS
 * - secure: isProd ensures cookies are only sent over HTTPS in production
 *
 * Note: We return the token in JSON (csrfToken) and set the cookie in the same response.
 */
const csrfMiddleware = csurf({
  cookie: {
    key: env.csrfCookieName || 'XSRF-TOKEN',
    httpOnly: false, // we want client JS to be able to read the token value if needed
    sameSite: isProd ? 'none' : 'lax',
    secure: !!isProd,
    // maxAge optional; set to 1 hour
    maxAge: 60 * 60 * 1000
  }
});

// SPA calls this first to receive CSRF cookie + token value
// NOTE: this route sets the cookie and returns token value in JSON
router.get('/csrf-token', csrfMiddleware, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Login: ensure rate limit, csrf check, validation, controller
router.post('/login', loginlimiter, csrfMiddleware, validate(Schemas.login), login);

// Logout: csrf protected
router.post('/logout', csrfMiddleware, logout);

// Protected route example
router.get('/me', authGuard, me);

export default router;
