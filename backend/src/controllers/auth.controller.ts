/**
 * controllers/auth.controller.ts
 *
 * HTTP layer for Auth endpoints.
 * No business logic lives here — controllers are intentionally thin.
 */

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import User from '../models/User.model';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

// ── POST /api/auth/register ───────────────────────────────────────────────────
export const register = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const input = req.body as RegisterInput;
    const { user, token } = await authService.register(input);

    res.status(201).json(
      new ApiResponse(201, { user, token }, 'Account created successfully'),
    );
  },
);

// ── POST /api/auth/login ──────────────────────────────────────────────────────
export const login = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const input = req.body as LoginInput;
    const { user, token } = await authService.login(input);

    res.status(200).json(
      new ApiResponse(200, { user, token }, 'Logged in successfully'),
    );
  },
);

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
// JWTs are stateless — there is no server-side session to destroy. This
// endpoint exists purely for a consistent REST surface; the client is
// responsible for discarding the stored token.
export const logout = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json(
      new ApiResponse(200, null, 'Logged out successfully'),
    );
  },
);

// ── GET /api/auth/me ───────────────────────────────────────────────────────────
export const getMe = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = await User.findById(req.user!.userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json(
      new ApiResponse(200, user, 'Current user fetched successfully'),
    );
  },
);
