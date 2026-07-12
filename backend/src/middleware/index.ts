/**
 * middleware/index.ts
 * Barrel export — import any middleware from '@middleware'.
 *
 * Usage:
 *   import { validate, errorHandler, notFound, authenticate, requireRole } from '../middleware';
 */

export { validate }                        from './validate.middleware';
export { errorHandler, notFound }          from './errorHandler.middleware';
export { authenticate, requireRole }       from './auth.middleware';
export type { AuthPayload }                from './auth.middleware';
