/**
 * middleware/validate.middleware.ts
 *
 * Generic Zod validation middleware factory.
 *
 * How it works:
 *   1. Accepts a Zod schema and a target ('body' | 'params' | 'query').
 *   2. Parses the request data with safeParse (never throws).
 *   3. On failure → formats all Zod field errors into a clean array and
 *      calls next(ApiError) with HTTP 422 Unprocessable Entity.
 *   4. On success → replaces req[target] with the parsed (coerced & stripped)
 *      data and calls next().
 *
 * Usage in routes:
 *   import { validate } from '../middleware';
 *   import { createTripSchema } from '../validators/trip.validator';
 *
 *   router.post('/', validate(createTripSchema), tripController.create);
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

// ── Error formatter ───────────────────────────────────────────────────────────
/**
 * Transforms Zod's raw issue list into a flat, user-readable array.
 * Each item contains the field path and the human-friendly message.
 *
 * Example output:
 *   [
 *     { field: 'cargoWeight', message: 'Cargo weight must be greater than 0' },
 *     { field: 'vehicleId',   message: 'Invalid MongoDB ObjectId' },
 *   ]
 */
function formatZodErrors(error: ZodError): { field: string; message: string }[] {
  return error.issues.map((issue) => ({
    field:   issue.path.join('.') || 'root',
    message: issue.message,
  }));
}

// ── Middleware factory ────────────────────────────────────────────────────────
type RequestTarget = 'body' | 'params' | 'query';

export function validate(schema: ZodSchema, target: RequestTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = formatZodErrors(result.error);
      return next(
        new ApiError(
          422,
          'Validation failed',
          errors,
        ),
      );
    }

    // Replace with Zod-coerced and stripped data (removes unknown keys)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req as any)[target] = result.data;
    next();
  };
}
