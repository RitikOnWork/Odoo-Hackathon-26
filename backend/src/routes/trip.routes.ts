/**
 * routes/trip.routes.ts
 *
 * Express Router for all Trip endpoints.
 * Applies Zod validation middleware before every handler.
 *
 * Routes:
 *   POST   /api/trips         → createTrip      (body: createTripSchema)
 *   GET    /api/trips         → getAllTrips      (query: ?status=&page=&limit=)
 *   GET    /api/trips/:id     → getTripById      (param: tripIdParamSchema)
 *   PUT    /api/trips/:id     → updateTrip       (param + body: updateTripBodySchema)
 *   DELETE /api/trips/:id     → deleteTrip       (param: tripIdParamSchema)
 */

import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import {
  createTripSchema,
  tripIdParamSchema,
  updateTripBodySchema,
} from '../validators/trip.validator';
import * as tripController from '../controllers/trip.controller';

const router = Router();

// ── Collection routes ─────────────────────────────────────────────────────────
router
  .route('/')
  .post(validate(createTripSchema),  tripController.createTrip)
  .get(                              tripController.getAllTrips);

// ── Document routes ───────────────────────────────────────────────────────────
router
  .route('/:id')
  .get(   validate(tripIdParamSchema,    'params'), tripController.getTripById)
  .put(   validate(tripIdParamSchema,    'params'),
          validate(updateTripBodySchema, 'body'),   tripController.updateTrip)
  .delete(validate(tripIdParamSchema,    'params'), tripController.deleteTrip);

// ── Dispatch route ────────────────────────────────────────────────────────────
router.patch(
  '/:id/dispatch',
  validate(tripIdParamSchema, 'params'),
  tripController.dispatchTrip
);

export default router;

