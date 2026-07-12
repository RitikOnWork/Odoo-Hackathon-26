/**
 * models/index.ts
 * Barrel export — import any model from '@models' instead of deep paths.
 *
 * Usage:
 *   import { Trip, Vehicle, Driver } from '../models';
 */

export { default as Counter }     from './Counter.model';
export { default as Trip }        from './Trip.model';
export { default as Maintenance } from './Maintenance.model';
<<<<<<< HEAD
export { default as User }        from './User.model';
=======
>>>>>>> 5e3340f331afcc3c13731876201c79dc18f61cda
export { default as Vehicle }     from './Vehicle.model';
export { default as Driver }      from './Driver.model';

// Future models — uncomment as you build them:
<<<<<<< HEAD
=======
// export { default as User }    from './User.model';
>>>>>>> 5e3340f331afcc3c13731876201c79dc18f61cda
// export { default as Route }   from './Route.model';
