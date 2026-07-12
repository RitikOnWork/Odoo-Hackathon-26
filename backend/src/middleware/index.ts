/**
 * middleware/
 *
 * Purpose: Reusable Express middleware functions applied globally or per-route.
 *
 * What goes here:
 *  - auth.middleware.ts       → JWT verification; attaches decoded user to req
 *  - role.middleware.ts       → Role-Based Access Control (admin / driver / ops)
 *  - validate.middleware.ts   → Generic Zod schema validator factory
 *  - errorHandler.middleware.ts → Centralised error response formatter
 *  - notFound.middleware.ts   → 404 catch-all handler
 *  - rateLimiter.middleware.ts → express-rate-limit setup for auth routes
 *
 * Rule:
 *  - Middleware must call next() on success or next(error) on failure.
 *  - Keep each file focused on a single cross-cutting concern.
 */
