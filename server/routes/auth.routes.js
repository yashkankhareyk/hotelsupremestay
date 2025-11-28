import { Router } from 'express';
import csurf from 'csurf';
import { env, isProd } from '../config/config.js';
import { login, logout, me } from '../controllers/auth.controller.js';
import { validate, Schemas } from '../middleware/validate.js';
import { loginlimiter } from '../middleware/ratelimit.js';
import { authGuard } from '../middleware/auth.js';

const router = Router();

// TRUE secure CSRF cookie (httpOnly = true)
const csrf = csurf({
  cookie: {
    key: env.csrfCookieName || "sh_csrf",
    httpOnly: true,          // <-- MUST be true!!
    sameSite: "none",        // cross-site required
    secure: true,            // HTTPS only on Vercel/Render
    maxAge: 60 * 60 * 1000,
  },
});

// SPA calls this first -> token is sent via JSON ONLY
router.get("/csrf-token", csrf, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Login: no CSRF needed
router.post("/login", loginlimiter, validate(Schemas.login), login);

// Logout: CSRF required
router.post("/logout", csrf, logout);

// Authenticated user
router.get("/me", authGuard, me);

export default router;
