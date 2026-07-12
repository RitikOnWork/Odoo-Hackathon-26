/**
 * validators/index.ts
 * Barrel export — import any validator schema from '@validators'.
 *
 * Usage:
 *   import { createTripSchema, CreateTripInput } from '../validators';
 */

export * from './trip.validator';
export * from './maintenance.validator';
export * from './auth.validator';
export * from './vehicle.validator';

// Future validators — uncomment as you build them:
// export * from './driver.validator';
