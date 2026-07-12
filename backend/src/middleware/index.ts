/**
 * middleware/index.ts
 * Barrel export — import any middleware from '@middleware'.
 *
 * Usage:
 *   import { validate, errorHandler, notFound } from '../middleware';
 */

export { validate }                  from './validate.middleware';
export { errorHandler, notFound }    from './errorHandler.middleware';

// Future middleware — uncomment as you build them:
// export { authenticate }   from './auth.middleware';
// export { authorize }      from './role.middleware';
// export { apiRateLimiter } from './rateLimiter.middleware';
