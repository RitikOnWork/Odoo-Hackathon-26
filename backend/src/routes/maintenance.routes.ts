/**
 * routes/maintenance.routes.ts
 *
 * Express Router for Maintenance CRUD endpoints.
 * Applies JWT authentication and Zod validation middleware before every handler.
 *
 * Routes:
 *   POST   /api/maintenance            → createMaintenance   (body: createMaintenanceSchema)
 *   GET    /api/maintenance            → getAllMaintenance    (query: ?status=&page=&limit=)
 *   GET    /api/maintenance/:id        → getMaintenanceById  (param: maintenanceIdParamSchema)
 *   PUT    /api/maintenance/:id        → updateMaintenance   (param + body: updateMaintenanceSchema)
 *   DELETE /api/maintenance/:id        → deleteMaintenance   (param: maintenanceIdParamSchema)
 *   PATCH  /api/maintenance/:id/complete → completeMaintenance (param + body: completeMaintenanceSchema)
 */

import { Router } from 'express';
import { validate }       from '../middleware/validate.middleware';
import { authenticate }   from '../middleware/auth.middleware';
import {
  createMaintenanceSchema,
  updateMaintenanceSchema,
  maintenanceIdParamSchema,
  completeMaintenanceSchema,
} from '../validators/maintenance.validator';
import * as maintenanceController from '../controllers/maintenance.controller';

const router = Router();

// Apply JWT authentication to all maintenance routes.
router.use(authenticate);

// ── Collection routes ─────────────────────────────────────────────────────────
router
  .route('/')
  .post(validate(createMaintenanceSchema),  maintenanceController.createMaintenance)
  .get(                                     maintenanceController.getAllMaintenance);

// ── Document routes ───────────────────────────────────────────────────────────
router
  .route('/:id')
  .get(   validate(maintenanceIdParamSchema, 'params'), maintenanceController.getMaintenanceById)
  .put(   validate(maintenanceIdParamSchema, 'params'),
          validate(updateMaintenanceSchema,  'body'),   maintenanceController.updateMaintenance)
  .delete(validate(maintenanceIdParamSchema, 'params'), maintenanceController.deleteMaintenance);

// ── Complete route ────────────────────────────────────────────────────────────
router.patch(
  '/:id/complete',
  validate(maintenanceIdParamSchema,  'params'),
  validate(completeMaintenanceSchema, 'body'),
  maintenanceController.completeMaintenance,
);

export default router;
