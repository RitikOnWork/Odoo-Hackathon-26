/**
 * validators/auth.validator.ts
 *
 * Zod schemas for all Auth-related API inputs.
 *
 * Schemas exported:
 *  - registerSchema → POST /api/auth/register
 *  - loginSchema    → POST /api/auth/login
 */

import { z } from 'zod';
import { UserRole } from '../constants/enums';

// ── Register ──────────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must not exceed 100 characters' }),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email({ message: 'Invalid email address' }),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),

  role: z.nativeEnum(UserRole, {
    required_error: 'Role is required',
    invalid_type_error: `Role must be one of: ${Object.values(UserRole).join(', ')}`,
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ── Login ─────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .toLowerCase()
    .email({ message: 'Invalid email address' }),

  password: z
    .string({ required_error: 'Password is required' })
    .min(1, { message: 'Password is required' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
