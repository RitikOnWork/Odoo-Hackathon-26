/**
 * middleware/auth.middleware.ts
 *
 * JWT-based authentication and role-based authorisation middleware.
 *
 * authenticate:
 *   - Reads the `Authorization: Bearer <token>` header.
 *   - Verifies the token with JWT_SECRET from env.
 *   - Attaches the decoded payload to `req.user`.
 *   - Throws 401 on missing/invalid/expired tokens.
 *
 * requireRole(...roles):
 *   - Must be chained AFTER authenticate.
 *   - Throws 403 if req.user.role is not in the allowed set.
 *
 * Usage in routes:
 *   import { authenticate, requireRole } from '../middleware';
 *
 *   router.post('/', authenticate, requireRole('Fleet Manager'), tripController.createTrip);
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { UserRole } from '../constants/enums';

// ── Type augmentation ─────────────────────────────────────────────────────────
// Extend Express Request so req.user is typed throughout the app.
export interface AuthPayload {
  userId: string;
  role:   UserRole;
  email:  string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Fail loudly at startup-time rather than silently accepting requests
    throw new Error('JWT_SECRET is not set in environment variables');
  }
  return secret;
}

// ── authenticate ──────────────────────────────────────────────────────────────

export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication required. Provide a valid Bearer token'));
  }

  const token = authHeader.slice(7); // strip "Bearer "

  try {
    const payload = jwt.verify(token, getSecret()) as AuthPayload;
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Token has expired. Please log in again'));
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, 'Invalid token. Authentication failed'));
    }
    // Re-throw unexpected errors (e.g. missing JWT_SECRET)
    next(err);
  }
}

// ── requireRole ───────────────────────────────────────────────────────────────

/**
 * Role-based access guard. Must be placed after `authenticate` in the chain.
 *
 * @param roles  One or more UserRole values that are permitted to proceed.
 *
 * Example:
 *   requireRole(UserRole.FLEET_MANAGER, UserRole.SAFETY_OFFICER)
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      // Should never happen if authenticate is chained first
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`,
        ),
      );
    }

    next();
  };
}
