/**
 * routes/vehicle.routes.ts
 *
 * Express Router for all Vehicle endpoints.
 * Applies JWT authentication to every route; mutations are additionally
 * restricted to the Fleet Manager role (vehicle registry ownership per spec).
 *
 * Routes:
 *   POST   /api/vehicles      → createVehicle  (Fleet Manager only; body: createVehicleSchema)
 *   GET    /api/vehicles      → getAllVehicles  (query: ?status=&type=&region=&page=&limit=)
 *   GET    /api/vehicles/:id  → getVehicleById  (param: vehicleIdParamSchema)
 *   PUT    /api/vehicles/:id  → updateVehicle   (Fleet Manager only; param + body: updateVehicleBodySchema)
 *   DELETE /api/vehicles/:id  → deleteVehicle   (Fleet Manager only; param: vehicleIdParamSchema)
 */

import { Router } from 'express';
import { validate }     from '../middleware/validate.middleware';
import { authenticate, requireRole } from '../middleware/auth.middleware';
import { UserRole } from '../constants/enums';
import {
  createVehicleSchema,
  updateVehicleBodySchema,
  vehicleListQuerySchema,
  vehicleIdParamSchema,
} from '../validators/vehicle.validator';
import * as vehicleController from '../controllers/vehicle.controller';

const router = Router();

// Apply JWT authentication to all vehicle routes.
router.use(authenticate);

// ── Collection routes ─────────────────────────────────────────────────────────
router
  .route('/')
  .post(
    requireRole(UserRole.FLEET_MANAGER),
    validate(createVehicleSchema),
    vehicleController.createVehicle,
  )
  .get(
    validate(vehicleListQuerySchema, 'query'),
    vehicleController.getAllVehicles,
  );

// ── Document routes ───────────────────────────────────────────────────────────
router
  .route('/:id')
  .get(
    validate(vehicleIdParamSchema, 'params'),
    vehicleController.getVehicleById,
  )
  .put(
    requireRole(UserRole.FLEET_MANAGER),
    validate(vehicleIdParamSchema,    'params'),
    validate(updateVehicleBodySchema, 'body'),
    vehicleController.updateVehicle,
  )
  .delete(
    requireRole(UserRole.FLEET_MANAGER),
    validate(vehicleIdParamSchema, 'params'),
    vehicleController.deleteVehicle,
  );

export default router;
