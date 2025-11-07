import bcrypt from 'bcryptjs';
const ROUNDS = 12;
export const hashPassword = (p) => bcrypt.hash(p, ROUNDS);
export const comparePassword = (p, hash) => bcrypt.compare(p, hash);