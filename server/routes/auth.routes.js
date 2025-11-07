import { Router } from 'express';
import csurf from 'csurf';
import { env } from '../config/config.js';
import { login, logout, me } from '../controllers/auth.controller.js';
import { validate, Schemas } from '../middleware/validate.js';
import { loginlimiter } from '../middleware/ratelimit.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();
const csrf = csurf({ cookie: { key: env.csrfCookieName, httpOnly: false, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' } });

// SPA calls this first to receive CSRF token cookie + value
router.get('/csrf-token', csrf, (req, res) => res.json({ csrfToken: req.csrfToken() }));

router.post('/login', loginLimiter, csrf, validate(Schemas.login), login);
router.post('/logout', csrf, logout);
router.get('/me', authGuard, me);

export default router;
