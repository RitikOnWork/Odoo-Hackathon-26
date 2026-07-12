/**
 * utils/asyncHandler.ts
 *
 * Wraps an async Express route handler so that any rejected promise or thrown
 * error is automatically forwarded to Express's next(error) — eliminating
 * repetitive try/catch blocks in every controller method.
 *
 * Usage:
 *   router.get('/', asyncHandler(async (req, res) => {
 *     const trips = await tripService.findAll();
 *     res.json(trips);
 *   }));
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export const asyncHandler = (fn: AsyncFn): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
