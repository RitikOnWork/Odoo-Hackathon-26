/**
 * middleware/errorHandler.middleware.ts
 *
 * Centralised Express error-handling middleware (4-argument signature).
 * Catches all errors forwarded via next(err) — both ApiErrors and unexpected ones.
 *
 * Response shape on error:
 *   {
 *     "success":    false,
 *     "statusCode": 422,
 *     "message":    "Validation failed",
 *     "errors":     [{ "field": "cargoWeight", "message": "..." }]
 *   }
 *
 * Mount LAST in server.ts, after all routes:
 *   app.use(errorHandler);
 */

import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Known, operational errors thrown intentionally by our code
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success:    false,
      statusCode: err.statusCode,
      message:    err.message,
      errors:     err.errors,
    });
    return;
  }

  // Mongoose duplicate key error (e.g. unique tripNumber collision)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((err as any).code === 11000) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const field = Object.keys((err as any).keyValue ?? {})[0] ?? 'field';
    res.status(409).json({
      success:    false,
      statusCode: 409,
      message:    'Duplicate value',
      errors:     [{ field, message: `A record with this ${field} already exists` }],
    });
    return;
  }

  // Unexpected / programming errors — never leak stack traces in production
  const isDev = process.env.NODE_ENV === 'development';
  res.status(500).json({
    success:    false,
    statusCode: 500,
    message:    'Internal server error',
    errors:     isDev ? [{ field: 'stack', message: err.stack ?? err.message }] : [],
  });
}

// ── 404 Not-Found handler ─────────────────────────────────────────────────────
// Mount just before errorHandler in server.ts
export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}
