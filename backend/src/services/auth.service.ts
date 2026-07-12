/**
 * services/auth.service.ts
 *
 * Business logic for Authentication.
 * This layer is the ONLY place that talks to the User model for auth flows.
 *
 * Methods:
 *  - register → creates a new user account (password hashed by model hook)
 *  - login    → verifies credentials and issues a JWT
 *
 * Note on "logout": JWTs are stateless — there is no server-side session to
 * destroy. The /api/auth/logout endpoint exists for a consistent REST surface
 * and clients simply discard the token; no service method is needed here.
 */

import User from '../models/User.model';
import { ApiError } from '../utils/ApiError';
import { signToken } from '../utils/jwt.utils';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

/**
 * POST /api/auth/register
 * Creates a new user. Email must be unique.
 */
export async function register(input: RegisterInput) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  const user = await User.create(input);
  const token = signToken({ userId: user.id, role: user.role, email: user.email });

  return { user, token };
}

/**
 * POST /api/auth/login
 * Verifies email + password and issues a JWT on success.
 */
export async function login(input: LoginInput) {
  const { email, password } = input;

  // password has `select: false` on the schema — must opt back in explicitly
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken({ userId: user.id, role: user.role, email: user.email });

  return { user, token };
}
