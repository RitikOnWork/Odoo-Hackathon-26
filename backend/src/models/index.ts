/**
 * models/index.ts
 * Barrel export — import any model from '@models' instead of deep paths.
 *
 * Usage:
 *   import { Trip, Maintenance } from '../models';
 */

export { default as Counter }     from './Counter.model';
export { default as Trip }        from './Trip.model';
export { default as Maintenance } from './Maintenance.model';
export { default as User }        from './User.model';
export { default as Vehicle }     from './Vehicle.model';
export { default as Driver }      from './Driver.model';

// Future models — uncomment as you build them:
// export { default as Route }   from './Route.model';
