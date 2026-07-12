/**
 * utils/
 *
 * Purpose: Pure, stateless helper functions shared across the application.
 *
 * What goes here:
 *  - ApiResponse.ts     → Standardised success/error response builder
 *  - ApiError.ts        → Custom error class with HTTP status codes
 *  - asyncHandler.ts    → Wraps async route handlers to auto-catch errors
 *  - jwt.utils.ts       → signToken / verifyToken wrappers
 *  - pagination.ts      → Cursor/page-based pagination helper
 *  - dateTime.ts        → Date formatting and timezone utilities
 *
 * Rule:
 *  - No side effects (no DB calls, no HTTP calls).
 *  - Each utility must be independently testable with unit tests.
 *  - Avoid importing from controllers, services, or models here.
 */
