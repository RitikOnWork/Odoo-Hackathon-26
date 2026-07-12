/**
 * routes/trip.routes.ts
 *
 * Express Router for all Trip endpoints.
 * Applies JWT authentication and Zod validation middleware before every handler.
 *
 * Routes:
 *   POST   /api/trips           → createTrip      (body: createTripSchema)
 *   GET    /api/trips           → getAllTrips      (query: ?status=&page=&limit=)
 *   GET    /api/trips/history   → getTripHistory   (query: tripHistoryQuerySchema)
 *   GET    /api/trips/:id       → getTripById      (param: tripIdParamSchema)
 *   PUT    /api/trips/:id       → updateTrip       (param + body: updateTripBodySchema)
 *   DELETE /api/trips/:id       → deleteTrip       (param: tripIdParamSchema)
 *   PATCH  /api/trips/:id/dispatch → dispatchTrip  (param: tripIdParamSchema)
 *   PATCH  /api/trips/:id/complete → completeTrip  (param + body: completeTripSchema)
 *   PATCH  /api/trips/:id/cancel   → cancelTrip    (param: tripIdParamSchema)
 */

import { Router } from 'express';
import { validate }       from '../middleware/validate.middleware';
import { authenticate }   from '../middleware/auth.middleware';
import {
  createTripSchema,
  tripIdParamSchema,
  updateTripBodySchema,
  completeTripSchema,
  tripHistoryQuerySchema,
} from '../validators/trip.validator';
import * as tripController from '../controllers/trip.controller';

const router = Router();

// Apply JWT authentication to all trip routes.
router.use(authenticate);

// ── Collection routes ─────────────────────────────────────────────────────────
router
  .route('/')
  .post(validate(createTripSchema),  tripController.createTrip)
  .get(                              tripController.getAllTrips);

// Must precede '/:id' so Express does not treat 'history' as an ID.
router.get(
  '/history',
  validate(tripHistoryQuerySchema, 'query'),
  tripController.getTripHistory,
);

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
  tripController.dispatchTrip,
);

// ── Complete route ────────────────────────────────────────────────────────────
router.patch(
  '/:id/complete',
  validate(tripIdParamSchema,  'params'),
  validate(completeTripSchema, 'body'),
  tripController.completeTrip,
);

// ── Cancel route ──────────────────────────────────────────────────────────────
router.patch(
  '/:id/cancel',
  validate(tripIdParamSchema, 'params'),
  tripController.cancelTrip,
);

export default router;
