/**
 * utils/helpers.ts
 *
 * Shared utility functions used across service modules.
 * Centralised here to eliminate duplication and enforce a single
 * implementation of common validation/normalisation logic.
 */

import mongoose from 'mongoose';
import { ApiError } from './ApiError';

// ── ObjectId Validation ───────────────────────────────────────────────────────

/**
 * Asserts that `value` is a valid 24-hex-char MongoDB ObjectId.
 * Throws ApiError(400) if not — prevents junk IDs from ever reaching Mongoose.
 */
export function assertObjectId(value: string, fieldName: string): void {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
}

// ── Pagination Normalisation ──────────────────────────────────────────────────

/**
 * Clamps and floors raw page/limit inputs into safe, bounded integers.
 *  - page  : minimum 1 (cannot request page 0 or negative)
 *  - limit : minimum 1, maximum 100 (prevents runaway queries)
 *
 * Throws ApiError(400) on non-finite inputs (NaN, Infinity).
 */
export function normalisePagination(
  page = 1,
  limit = 20,
): { page: number; limit: number } {
  if (!Number.isFinite(page) || !Number.isFinite(limit)) {
    throw new ApiError(400, 'page and limit must be valid numbers');
  }

  return {
    page:  Math.max(1, Math.floor(page)),
    limit: Math.min(100, Math.max(1, Math.floor(limit))),
  };
}

// ── Regex Escape ──────────────────────────────────────────────────────────────

/**
 * Escapes all special RegExp metacharacters in `value` so it can be safely
 * embedded inside a `new RegExp(...)` constructor without unintended behaviour.
 *
 * Used by search-filter queries (e.g. trip history search).
 */
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
