/**
 * services/vehicle.service.ts
 *
 * Business logic for Vehicle Registry management.
 * This layer is the ONLY place that talks to the Vehicle model.
 *
 * Methods:
 *  - createVehicle → enforces unique registration number, defaults status = Available
 *  - getAllVehicles → list with optional status/type/region filters + pagination
 *  - getVehicleById → find one or throw 404
 *  - updateVehicle  → partial update; re-checks registration number uniqueness
 *  - deleteVehicle  → hard delete; blocked while the vehicle is On Trip or In Shop
 */

import mongoose from 'mongoose';
import Vehicle from '../models/Vehicle.model';
import { ApiError } from '../utils/ApiError';
import { VehicleStatus } from '../constants/enums';
import { CreateVehicleInput, UpdateVehicleBodyInput, VehicleListQueryInput } from '../validators/vehicle.validator';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Assert a string is a valid Mongo ObjectId; throw 400 if not. */
function assertObjectId(value: string, fieldName: string): void {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
}

// ── Service Methods ───────────────────────────────────────────────────────────

/**
 * POST /api/vehicles
 * Creates a new vehicle. Registration number must be unique (case-insensitive —
 * the schema uppercases it on save).
 */
export async function createVehicle(input: CreateVehicleInput) {
  const registrationNumber = input.registrationNumber.toUpperCase();

  const existing = await Vehicle.findOne({ registrationNumber });
  if (existing) {
    throw new ApiError(409, `A vehicle with registration number "${registrationNumber}" already exists`);
  }

  const vehicle = await Vehicle.create({
    ...input,
    status: input.status ?? VehicleStatus.AVAILABLE,
  });

  return vehicle;
}

/**
 * GET /api/vehicles
 * Returns a paginated list of vehicles.
 * Supports optional ?status=&type=&region= filters (used by the dashboard).
 */
export async function getAllVehicles(query: VehicleListQueryInput = {}) {
  const { status, type, region, page = 1, limit = 20 } = query;

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (type)   filter.type   = new RegExp(`^${type}$`, 'i');
  if (region) filter.region = new RegExp(`^${region}$`, 'i');

  const skip  = (page - 1) * limit;
  const total = await Vehicle.countDocuments(filter);

  const vehicles = await Vehicle.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    vehicles,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * GET /api/vehicles/:id
 * Finds a single vehicle by MongoDB _id. Throws 404 if not found.
 */
export async function getVehicleById(id: string) {
  assertObjectId(id, 'vehicle ID');

  const vehicle = await Vehicle.findById(id);
  if (!vehicle) {
    throw new ApiError(404, 'Vehicle not found');
  }

  return vehicle;
}

/**
 * PUT /api/vehicles/:id
 * Updates editable fields of a vehicle.
 *
 * Business rules:
 *  - If registrationNumber is changed, it must remain unique.
 *  - Status transitions are accepted here as a direct admin override; the
 *    automatic In Shop/Available transitions triggered by maintenance and
 *    trip lifecycle events are handled by their own services, not this one.
 */
export async function updateVehicle(id: string, payload: UpdateVehicleBodyInput) {
  assertObjectId(id, 'vehicle ID');

  const vehicle = await Vehicle.findById(id);
  if (!vehicle) throw new ApiError(404, 'Vehicle not found');

  if (payload.registrationNumber) {
    const registrationNumber = payload.registrationNumber.toUpperCase();
    if (registrationNumber !== vehicle.registrationNumber) {
      const existing = await Vehicle.findOne({ registrationNumber });
      if (existing) {
        throw new ApiError(409, `A vehicle with registration number "${registrationNumber}" already exists`);
      }
    }
  }

  Object.assign(vehicle, payload);
  await vehicle.save();
  return vehicle;
}

/**
 * DELETE /api/vehicles/:id
 * Hard-deletes a vehicle.
 *
 * Business rules:
 *  - Vehicles that are On Trip or In Shop must not be deleted — doing so
 *    would silently orphan the active trip/maintenance record referencing it.
 */
export async function deleteVehicle(id: string) {
  assertObjectId(id, 'vehicle ID');

  const vehicle = await Vehicle.findById(id);
  if (!vehicle) throw new ApiError(404, 'Vehicle not found');

  const blockedStatuses: VehicleStatus[] = [VehicleStatus.ON_TRIP, VehicleStatus.IN_SHOP];
  if (blockedStatuses.includes(vehicle.status)) {
    throw new ApiError(
      409,
      `Cannot delete a vehicle with status "${vehicle.status}". Complete or cancel its active trip/maintenance first.`,
    );
  }

  await Vehicle.deleteOne({ _id: id });
  return { registrationNumber: vehicle.registrationNumber };
}
