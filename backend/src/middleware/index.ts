/**
 * middleware/index.ts
 * Barrel export — import any middleware from '@middleware'.
 *
 * Usage:
 *   import { validate } from '../middleware';
 */

export { validate } from './validate.middleware';

// Future middleware — uncomment as you build them:
// export { authenticate }   from './auth.middleware';
// export { authorize }      from './role.middleware';
// export { errorHandler }   from './errorHandler.middleware';
// export { notFound }       from './notFound.middleware';
// export { apiRateLimiter } from './rateLimiter.middleware';
