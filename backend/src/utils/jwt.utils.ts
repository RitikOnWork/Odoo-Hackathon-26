/**
 * utils/jwt.utils.ts
 *
 * Signs access tokens with the same payload shape that
 * `middleware/auth.middleware.ts` expects on `req.user` (AuthPayload:
 * { userId, role, email }). Verification itself lives in that middleware,
 * not here, so there is exactly one place that decodes tokens.
 *
 * Usage:
 *   const token = signToken({ userId: user.id, role: user.role, email: user.email });
 */

import jwt from 'jsonwebtoken';
import { UserRole } from '../constants/enums';

export interface SignTokenPayload {
  userId: string;
  role:   UserRole;
  email:  string;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }
  return secret;
}

export function signToken(payload: SignTokenPayload): string {
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, getSecret(), { expiresIn } as jwt.SignOptions);
}
