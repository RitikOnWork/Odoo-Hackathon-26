/**
 * services/maintenance.service.ts
 *
 * Business/data access logic for Maintenance operations.
 * Directly interacts with the Maintenance and Vehicle models.
 * Controllers call these methods; this file never touches req/res.
 *
 * Methods:
 *  - createMaintenance   → creates log, sets vehicle In Shop (transactional)
 *  - getAllMaintenance    → paginated list with optional status filter
 *  - getMaintenanceById  → find one or throw 404
 *  - updateMaintenance   → partial update (Active logs only)
 *  - deleteMaintenance   → blocked if Active (data integrity guard)
 *  - completeMaintenance → Active → Completed, releases vehicle (transactional)
 */

import mongoose from 'mongoose';
import Maintenance from '../models/Maintenance.model';
import Vehicle     from '../models/Vehicle.model';
import { ApiError } from '../utils/ApiError';
import { assertObjectId, normalisePagination } from '../utils/helpers';
import { MaintenanceStatus, VehicleStatus } from '../constants/enums';
import {
  CreateMaintenanceInput,
  UpdateMaintenanceInput,
  CompleteMaintenanceInput,
} from '../validators/maintenance.validator';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MaintenanceListQuery {
  status?:  MaintenanceStatus;
  page?:    number;
  limit?:   number;
}

// ── Service Methods ───────────────────────────────────────────────────────────

/**
 * POST /api/maintenance
 * Creates a new Maintenance log and marks the vehicle as In Shop.
 *
 * Business rules enforced:
 *  - Vehicle must exist
 *  - Vehicle must not already have an Active maintenance log
 *    (MongoDB partial-unique index is the DB-level guard; this is the
 *     explicit application-level guard with a human-readable error)
 *  - Vehicle is set to In Shop unless it is Retired
 *
 * Uses a MongoDB transaction to guarantee atomicity.
 */
export async function createMaintenance(input: CreateMaintenanceInput) {
  const { vehicleId, ...rest } = input;
  assertObjectId(vehicleId, 'vehicleId');

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const vehicle = await Vehicle.findById(vehicleId).session(session);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle not found');
    }

    // Guard: prevent creating a second Active maintenance log for the same vehicle.
    // The partial-unique index in the schema catches this at the DB level with a
    // generic 409; this check surfaces a clear, actionable error message instead.
    const existingActive = await Maintenance.findOne(
      { vehicle: vehicleId, status: MaintenanceStatus.ACTIVE },
      null,
      { session },
    );
    if (existingActive) {
      throw new ApiError(
        409,
        `Vehicle already has an active maintenance log (id: ${existingActive._id}). Complete or delete it before creating a new one.`,
      );
    }

    // 1. Create the maintenance log inside the session
    const [maintenance] = await Maintenance.create([{
      ...rest,
      vehicle: vehicleId,
      status:  MaintenanceStatus.ACTIVE,
    }], { session });

    // 2. Set vehicle status to In Shop (skip if Retired — Retired vehicles can
    //    still be logged for record-keeping but their status is immutable here)
    if (vehicle.status !== VehicleStatus.RETIRED) {
      vehicle.status = VehicleStatus.IN_SHOP;
      await vehicle.save({ session });
    }

    await session.commitTransaction();
    return { maintenance, vehicle };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}


/**
 * GET /api/maintenance
 * Returns a paginated list of maintenance logs, newest first.
 * Supports optional ?status=Active|Completed filter.
 * count + find are executed in parallel to halve DB round-trips.
 */
export async function getAllMaintenance(query: MaintenanceListQuery = {}) {
  const { status } = query;
  const { page, limit } = normalisePagination(query.page, query.limit);

  const filter: Record<string, unknown> = {};
  if (status) {
    if (!Object.values(MaintenanceStatus).includes(status)) {
      throw new ApiError(400, `Invalid status value. Must be one of: ${Object.values(MaintenanceStatus).join(', ')}`);
    }
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  // Execute count and find in parallel — same filter, independent queries.
  const [total, maintenanceLogs] = await Promise.all([
    Maintenance.countDocuments(filter),
    Maintenance.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('vehicle', 'registrationNumber type name'),
  ]);

  return {
    maintenanceLogs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * GET /api/maintenance/:id
 * Retrieves a single maintenance log by ID.
 * Throws 404 if not found.
 */
export async function getMaintenanceById(id: string) {
  assertObjectId(id, 'maintenance ID');

  const log = await Maintenance.findById(id)
    .populate('vehicle', 'registrationNumber type name maxLoadCapacity');

  if (!log) {
    throw new ApiError(404, 'Maintenance log not found');
  }

  return log;
}

/**
 * PUT /api/maintenance/:id
 * Partially updates an existing maintenance log.
 *
 * Business rules:
 *  - Only Active logs can be updated.
 *  - Completed maintenance is immutable (audit trail).
 */
export async function updateMaintenance(id: string, payload: UpdateMaintenanceInput) {
  assertObjectId(id, 'maintenance ID');

  const log = await Maintenance.findById(id);
  if (!log) {
    throw new ApiError(404, 'Maintenance log not found');
  }

  if (log.status === MaintenanceStatus.COMPLETED) {
    throw new ApiError(409, 'Completed maintenance logs cannot be updated');
  }

  if (payload.maintenanceType !== undefined) log.maintenanceType = payload.maintenanceType;
  if (payload.description     !== undefined) log.description     = payload.description;
  if (payload.cost            !== undefined) log.cost            = payload.cost;

  await log.save();
  return log;
}

/**
 * DELETE /api/maintenance/:id
 * Hard-deletes a maintenance log.
 *
 * Business rule (data integrity guard):
 *  - Active maintenance logs CANNOT be deleted. Deleting an active log
 *    would leave the vehicle permanently stuck in "In Shop" status with
 *    no way to restore it through normal workflow. Complete the maintenance
 *    first, then delete if the record is no longer needed.
 *  - Completed logs may be deleted (no active resource implications).
 */
export async function deleteMaintenance(id: string) {
  assertObjectId(id, 'maintenance ID');

  const log = await Maintenance.findById(id);
  if (!log) {
    throw new ApiError(404, 'Maintenance log not found');
  }

  // Block deletion of Active logs to prevent vehicle status from becoming
  // permanently stuck in "In Shop" — an unrecoverable state without direct
  // DB intervention.
  if (log.status === MaintenanceStatus.ACTIVE) {
    throw new ApiError(
      409,
      'Cannot delete an Active maintenance log. Complete the maintenance first (PATCH /maintenance/:id/complete), then delete if needed.',
    );
  }

  await Maintenance.deleteOne({ _id: id });
  return { id: log._id };
}

/**
 * PATCH /api/maintenance/:id/complete
 * Completes an active maintenance log and releases the vehicle.
 *
 * Business rules enforced:
 *  - Maintenance log must be Active
 *  - endDate is required (validated by Zod schema on the route layer)
 *  - Vehicle is set to Available unless it is Retired
 *
 * ALL reads happen inside the transaction session to prevent TOCTOU issues.
 */
export async function completeMaintenance(id: string, payload: CompleteMaintenanceInput) {
  assertObjectId(id, 'maintenance ID');

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Read the log inside the transaction so a concurrent completion cannot
    // bypass the active-status check using stale data.
    const log = await Maintenance.findById(id).session(session);
    if (!log) {
      throw new ApiError(404, 'Maintenance log not found');
    }
    if (log.status !== MaintenanceStatus.ACTIVE) {
      throw new ApiError(
        409,
        `Only Active maintenance logs can be completed. Current status: ${log.status}`,
      );
    }

    // Fetch Vehicle inside the session to update status.
    const vehicle = await Vehicle.findById(log.vehicle).session(session);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle assigned to this maintenance log not found');
    }

    // Release vehicle to Available (skip if Retired — Retired vehicles stay Retired)
    if (vehicle.status !== VehicleStatus.RETIRED) {
      vehicle.status = VehicleStatus.AVAILABLE;
      await vehicle.save({ session });
    }

    // Update maintenance: status, endDate, and optionally cost
    log.status  = MaintenanceStatus.COMPLETED;
    log.endDate = payload.endDate;
    if (payload.cost !== undefined) {
      log.cost = payload.cost;
    }
    await log.save({ session });

    await session.commitTransaction();
    return { maintenance: log, vehicle };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
