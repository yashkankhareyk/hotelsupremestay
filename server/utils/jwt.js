import jwt from 'jsonwebtoken';
import { env } from '../config/config.js';
export const signJwt = (payload, opts = {}) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn, ...opts });
export const verifyJwt = (token) => jwt.verify(token, env.jwtSecret);