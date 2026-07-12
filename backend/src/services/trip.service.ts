/**
 * services/trip.service.ts
 *
 * Business logic for Trip management.
 * This layer is the ONLY place that talks to the Trip model.
 * Controllers call these methods; this file never touches req/res.
 *
 * Methods:
 *  - createTrip       → validates uniqueness concerns, sets status = Draft
 *  - getAllTrips       → list with optional status filter + pagination
 *  - getTripHistory   → searchable, filterable, sortable trip history
 *  - getTripById      → find one or throw 404
 *  - updateTrip       → partial update (Draft trips only for core fields)
 *  - deleteTrip       → hard delete (Draft/Cancelled only)
 *  - dispatchTrip     → Draft → Dispatched (transactional)
 *  - completeTrip     → Dispatched → Completed (transactional, TOCTOU-safe)
 *  - cancelTrip       → Dispatched → Cancelled (transactional, TOCTOU-safe)
 */

import mongoose from 'mongoose';
import Trip    from '../models/Trip.model';
import Vehicle from '../models/Vehicle.model';
import Driver  from '../models/Driver.model';
import { ApiError }      from '../utils/ApiError';
import { assertObjectId, normalisePagination, escapeRegExp } from '../utils/helpers';
import { TripStatus, VehicleStatus, DriverStatus } from '../constants/enums';
import { CreateTripInput } from '../validators/trip.validator';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TripListQuery {
  status?:  TripStatus;
  page?:    number;
  limit?:   number;
}

export interface TripHistoryQuery {
  page?:      number;
  limit?:     number;
  search?:    string;
  status?:    TripStatus;
  vehicle?:   string;
  driver?:    string;
  sortBy?:    'createdAt' | 'completedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateTripPayload {
  source?:          string;
  destination?:     string;
  vehicleId?:       string;
  driverId?:        string;
  cargoWeight?:     number;
  plannedDistance?: number;
}

// ── Pre-trip Creation Guard ───────────────────────────────────────────────────

/**
 * Runs all vehicle + driver eligibility checks in parallel before a trip
 * is created or updated. Throws a descriptive ApiError on the first failed rule.
 *
 * Checks performed:
 *  Vehicle:
 *    1. Vehicle exists in the database
 *    2. Vehicle is not Retired
 *    3. Vehicle is not In Shop
 *    4. Vehicle status is Available
 *    5. Cargo weight ≤ vehicle.maxLoadCapacity
 *
 *  Driver:
 *    6. Driver exists in the database
 *    7. Driver is not Suspended
 *    8. Driver license is not expired (licenseExpiry > now)
 *    9. Driver status is Available
 */
async function validateTripPreConditions(
  vehicleId:   string,
  driverId:    string,
  cargoWeight: number,
): Promise<void> {
  // Fetch both in parallel — one round-trip to the DB
  const [vehicle, driver] = await Promise.all([
    Vehicle.findById(vehicleId).select('status registrationNumber maxLoadCapacity').lean(),
    Driver.findById(driverId).select('status licenseExpiryDate name').lean(),
  ]);

  // ── Vehicle checks ────────────────────────────────────────────────────────
  if (!vehicle) {
    throw new ApiError(404, `Vehicle not found (id: ${vehicleId})`);
  }

  if (vehicle.status === VehicleStatus.RETIRED) {
    throw new ApiError(
      422,
      `Vehicle "${vehicle.registrationNumber}" is Retired and cannot be assigned to a trip`,
    );
  }

  if (vehicle.status === VehicleStatus.IN_SHOP) {
    throw new ApiError(
      422,
      `Vehicle "${vehicle.registrationNumber}" is currently In Shop (under maintenance) and cannot be dispatched`,
    );
  }

  if (vehicle.status !== VehicleStatus.AVAILABLE) {
    throw new ApiError(
      422,
      `Vehicle "${vehicle.registrationNumber}" is not Available. Current status: ${vehicle.status}`,
    );
  }

  // ── Cargo weight vs vehicle capacity ─────────────────────────────────────
  if (cargoWeight > vehicle.maxLoadCapacity) {
    throw new ApiError(
      400,
      `Cargo weight (${cargoWeight} kg) exceeds vehicle capacity (${vehicle.maxLoadCapacity} kg).`,
    );
  }

  // ── Driver checks ─────────────────────────────────────────────────────────
  if (!driver) {
    throw new ApiError(404, `Driver not found (id: ${driverId})`);
  }

  if (driver.status === DriverStatus.SUSPENDED) {
    throw new ApiError(
      422,
      `Driver "${driver.name}" is Suspended and cannot be assigned to a trip`,
    );
  }

  const now = new Date();
  if (new Date(driver.licenseExpiryDate) <= now) {
    const expiredOn = new Date(driver.licenseExpiryDate).toLocaleDateString('en-IN');
    throw new ApiError(
      422,
      `Driver "${driver.name}" has an expired license (expired on ${expiredOn}). Renew the license before assigning trips`,
    );
  }

  if (driver.status !== DriverStatus.AVAILABLE) {
    throw new ApiError(
      422,
      `Driver "${driver.name}" is not Available. Current status: ${driver.status}`,
    );
  }
}

// ── Service Methods ───────────────────────────────────────────────────────────

/**
 * POST /api/trips
 * Creates a new trip with status = Draft.
 * tripNumber is auto-generated by the model's pre-validate hook.
 */
export async function createTrip(input: CreateTripInput) {
  const { vehicleId, driverId, ...rest } = input;

  assertObjectId(vehicleId, 'vehicleId');
  assertObjectId(driverId,  'driverId');

  // Pre-creation eligibility checks (vehicle + driver must exist and be Available).
  // Throws a descriptive 404/422 ApiError on any failure.
  await validateTripPreConditions(vehicleId, driverId, rest.cargoWeight);

  const trip = await Trip.create({
    ...rest,
    vehicle: vehicleId,
    driver:  driverId,
    status:  TripStatus.DRAFT,   // always Draft on creation — explicit, not relied on default
  });

  return trip;
}


/**
 * GET /api/trips
 * Returns a paginated list of trips, newest first.
 * Supports optional ?status=Draft|Dispatched|Completed|Cancelled filter.
 * count + find are executed in parallel to halve DB round-trips.
 */
export async function getAllTrips(query: TripListQuery = {}) {
  const { status } = query;
  const { page, limit } = normalisePagination(query.page, query.limit);

  const filter: Record<string, unknown> = {};
  if (status) {
    if (!Object.values(TripStatus).includes(status)) {
      throw new ApiError(400, `Invalid status value. Must be one of: ${Object.values(TripStatus).join(', ')}`);
    }
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  // Execute count and find in parallel — same filter, independent queries.
  const [total, trips] = await Promise.all([
    Trip.countDocuments(filter),
    Trip.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('vehicle', 'registrationNumber type')
      .populate('driver',  'name licenseNumber'),
  ]);

  return {
    trips,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * GET /api/trips/history
 * Returns a searchable, filterable trip history with compact vehicle and driver
 * details. Separate from getAllTrips because this supports broader filters
 * and caller-selected date sorting.
 */
export async function getTripHistory(query: TripHistoryQuery = {}) {
  const {
    search,
    status,
    vehicle: vehicleId,
    driver:  driverId,
    sortBy    = 'createdAt',
    sortOrder = 'desc',
  } = query;
  const { page, limit } = normalisePagination(query.page, query.limit);

  // All query-param validation is done in the Zod schema on the route layer.
  // The guards below are a defence-in-depth backstop for programmatic callers.
  if (status && !Object.values(TripStatus).includes(status)) {
    throw new ApiError(400, 'Invalid status value. Must be one of: ' + Object.values(TripStatus).join(', '));
  }
  if (vehicleId) assertObjectId(vehicleId, 'vehicle ID');
  if (driverId)  assertObjectId(driverId,  'driver ID');

  const filter: Record<string, unknown> = {};
  if (status)    filter.status  = status;
  if (vehicleId) filter.vehicle = vehicleId;
  if (driverId)  filter.driver  = driverId;

  if (search?.trim()) {
    const searchPattern = new RegExp(escapeRegExp(search.trim()), 'i');
    const [matchingVehicles, matchingDrivers] = await Promise.all([
      Vehicle.find({
        $or: [{ registrationNumber: searchPattern }, { name: searchPattern }],
      }).distinct('_id'),
      Driver.find({
        $or: [{ name: searchPattern }, { licenseNumber: searchPattern }],
      }).distinct('_id'),
    ]);

    filter.$or = [
      { tripNumber:   searchPattern },
      { source:       searchPattern },
      { destination:  searchPattern },
      ...(matchingVehicles.length ? [{ vehicle: { $in: matchingVehicles } }] : []),
      ...(matchingDrivers.length  ? [{ driver:  { $in: matchingDrivers  } }] : []),
    ];
  }

  const skip          = (page - 1) * limit;
  const sortDirection = sortOrder === 'asc' ? 1 : -1;

  const [total, trips] = await Promise.all([
    Trip.countDocuments(filter),
    Trip.find(filter)
      .select('tripNumber source destination vehicle driver cargoWeight plannedDistance actualDistance fuelConsumed status dispatchedAt completedAt createdAt')
      .sort({ [sortBy]: sortDirection, _id: sortDirection })
      .skip(skip)
      .limit(limit)
      .populate('vehicle', 'registrationNumber name type status')
      .populate('driver',  'name licenseNumber contactNumber status')
      .lean(),
  ]);

  return {
    trips,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * GET /api/trips/:id
 * Finds a single trip by MongoDB _id.
 * Throws 404 if not found.
 */
export async function getTripById(id: string) {
  assertObjectId(id, 'trip ID');

  const trip = await Trip.findById(id)
    .populate('vehicle', 'registrationNumber type maxLoadCapacity')
    .populate('driver',  'name licenseNumber contactNumber');

  if (!trip) {
    throw new ApiError(404, `Trip not found`);
  }

  return trip;
}

/**
 * PUT /api/trips/:id
 * Updates editable fields of a trip.
 *
 * Business rules:
 *  - Only Draft trips can have their core fields edited.
 *  - Dispatched / Completed / Cancelled trips are immutable via this endpoint.
 *  - Re-runs eligibility checks on the final proposed vehicle/driver state.
 */
export async function updateTrip(id: string, payload: UpdateTripPayload) {
  assertObjectId(id, 'trip ID');

  const trip = await Trip.findById(id);
  if (!trip) throw new ApiError(404, 'Trip not found');

  if (trip.status !== TripStatus.DRAFT) {
    throw new ApiError(
      409,
      `Only Draft trips can be edited. Current status: ${trip.status}`,
    );
  }

  const { vehicleId, driverId, ...rest } = payload;

  // Validate references and all eligibility rules using the final proposed state.
  // This prevents an update from bypassing the checks performed at creation.
  const finalVehicleId = vehicleId ?? trip.vehicle.toString();
  const finalDriverId  = driverId  ?? trip.driver.toString();
  const cargoWeight    = payload.cargoWeight ?? trip.cargoWeight;

  assertObjectId(finalVehicleId, 'vehicleId');
  assertObjectId(finalDriverId,  'driverId');
  await validateTripPreConditions(finalVehicleId, finalDriverId, cargoWeight);

  if (vehicleId) {
    trip.vehicle = new mongoose.Types.ObjectId(finalVehicleId);
  }
  if (driverId) {
    trip.driver = new mongoose.Types.ObjectId(finalDriverId);
  }

  // Apply scalar field updates
  if (rest.source          !== undefined) trip.source          = rest.source;
  if (rest.destination     !== undefined) trip.destination     = rest.destination;
  if (rest.cargoWeight     !== undefined) trip.cargoWeight     = rest.cargoWeight;
  if (rest.plannedDistance !== undefined) trip.plannedDistance = rest.plannedDistance;

  await trip.save();
  return trip;
}

/**
 * DELETE /api/trips/:id
 * Hard-deletes a trip.
 *
 * Business rules:
 *  - Only Draft or Cancelled trips may be deleted.
 *  - Active (Dispatched) or completed trips must be retained for audit.
 */
export async function deleteTrip(id: string) {
  assertObjectId(id, 'trip ID');

  const trip = await Trip.findById(id);
  if (!trip) throw new ApiError(404, 'Trip not found');

  const deletableStatuses: TripStatus[] = [TripStatus.DRAFT, TripStatus.CANCELLED];
  if (!deletableStatuses.includes(trip.status)) {
    throw new ApiError(
      409,
      `Cannot delete a trip with status "${trip.status}". Only Draft or Cancelled trips can be deleted.`,
    );
  }

  await Trip.deleteOne({ _id: id });
  return { tripNumber: trip.tripNumber };
}

/**
 * PATCH /api/trips/:id/dispatch
 * Atomically dispatches a trip:
 *  - Enforces status = Draft
 *  - Re-validates vehicle + driver eligibility inside the transaction
 *  - Sets trip status to Dispatched and dispatchedAt to now
 *  - Sets vehicle status to On Trip
 *  - Sets driver status to On Trip
 *
 * Uses Mongoose transaction session to ensure all or nothing is committed.
 * All reads happen inside the session to prevent TOCTOU race conditions.
 */
export async function dispatchTrip(id: string) {
  assertObjectId(id, 'trip ID');

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Read the trip inside the transaction so a concurrent mutation cannot
    // bypass the status check with stale data.
    const trip = await Trip.findById(id).session(session);
    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    if (trip.status !== TripStatus.DRAFT) {
      throw new ApiError(
        409,
        `Only Draft trips can be dispatched. Current status: ${trip.status}`,
      );
    }

    const [vehicle, driver] = await Promise.all([
      Vehicle.findById(trip.vehicle).session(session),
      Driver.findById(trip.driver).session(session),
    ]);

    if (!vehicle) {
      throw new ApiError(404, 'Vehicle assigned to this trip not found');
    }
    if (vehicle.status === VehicleStatus.ON_TRIP) {
      throw new ApiError(422, `Vehicle "${vehicle.registrationNumber}" is already On Trip`);
    }
    if (vehicle.status === VehicleStatus.IN_SHOP) {
      throw new ApiError(422, `Vehicle "${vehicle.registrationNumber}" is In Shop and cannot be dispatched`);
    }
    if (vehicle.status === VehicleStatus.RETIRED) {
      throw new ApiError(422, `Vehicle "${vehicle.registrationNumber}" is Retired and cannot be dispatched`);
    }
    if (vehicle.status !== VehicleStatus.AVAILABLE) {
      throw new ApiError(422, `Vehicle "${vehicle.registrationNumber}" is not Available. Current status: ${vehicle.status}`);
    }

    if (!driver) {
      throw new ApiError(404, 'Driver assigned to this trip not found');
    }
    if (driver.status === DriverStatus.ON_TRIP) {
      throw new ApiError(422, `Driver "${driver.name}" is already On Trip`);
    }
    if (driver.status === DriverStatus.SUSPENDED) {
      throw new ApiError(422, `Driver "${driver.name}" is Suspended and cannot be dispatched`);
    }
    if (new Date(driver.licenseExpiryDate) <= new Date()) {
      throw new ApiError(422, `Driver "${driver.name}" has an expired license and cannot be dispatched`);
    }
    if (driver.status !== DriverStatus.AVAILABLE) {
      throw new ApiError(422, `Driver "${driver.name}" is not Available. Current status: ${driver.status}`);
    }

    // Update the trip and its resources only after all checks pass.
    trip.status       = TripStatus.DISPATCHED;
    trip.dispatchedAt = new Date();
    await trip.save({ session });

    vehicle.status = VehicleStatus.ON_TRIP;
    driver.status  = DriverStatus.ON_TRIP;
    await Promise.all([vehicle.save({ session }), driver.save({ session })]);

    await session.commitTransaction();
    return trip;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * PATCH /api/trips/:id/complete
 * Atomically completes a trip:
 *  - Enforces status = Dispatched (checked inside the transaction — TOCTOU-safe)
 *  - Stores actualDistance, finalOdometer, fuelConsumed, and completedAt
 *  - Updates Vehicle status to Available and advances its odometer
 *  - Updates Driver status to Available
 *
 * ALL reads happen inside the transaction session to prevent race conditions
 * where a concurrent operation could slip in between the status check and write.
 */
export async function completeTrip(
  id: string,
  payload: {
    actualDistance: number;
    finalOdometer:  number;
    fuelConsumed:   number;
  },
) {
  assertObjectId(id, 'trip ID');

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Read trip INSIDE the session — prevents stale status check (TOCTOU fix)
    const trip = await Trip.findById(id).session(session);
    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    if (trip.status !== TripStatus.DISPATCHED) {
      throw new ApiError(
        409,
        `Only Dispatched trips can be completed. Current status: ${trip.status}`,
      );
    }

    // 2. Fetch Vehicle inside the session to check odometer
    const vehicle = await Vehicle.findById(trip.vehicle).session(session);
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle assigned to this trip not found');
    }

    if (payload.finalOdometer < vehicle.odometer) {
      throw new ApiError(
        400,
        `Final odometer (${payload.finalOdometer} km) cannot be less than the vehicle's current odometer (${vehicle.odometer} km).`,
      );
    }

    // 3. Update Trip completion fields & status
    trip.status         = TripStatus.COMPLETED;
    trip.actualDistance = payload.actualDistance;
    trip.finalOdometer  = payload.finalOdometer;
    trip.fuelConsumed   = payload.fuelConsumed;
    trip.completedAt    = new Date();
    await trip.save({ session });

    // 4. Update Vehicle status & odometer
    vehicle.status   = VehicleStatus.AVAILABLE;
    vehicle.odometer = payload.finalOdometer;
    await vehicle.save({ session });

    // 5. Release Driver back to Available
    const driver = await Driver.findByIdAndUpdate(
      trip.driver,
      { status: DriverStatus.AVAILABLE },
      { session, new: true },
    );
    if (!driver) {
      throw new ApiError(404, 'Driver assigned to this trip not found');
    }

    await session.commitTransaction();
    return trip;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}

/**
 * PATCH /api/trips/:id/cancel
 * Atomically cancels a dispatched trip:
 *  - Enforces status = Dispatched (checked inside the transaction — TOCTOU-safe)
 *  - Sets trip status to Cancelled
 *  - Releases Vehicle back to Available
 *  - Releases Driver back to Available
 *
 * ALL reads happen inside the transaction session to prevent race conditions.
 */
export async function cancelTrip(id: string) {
  assertObjectId(id, 'trip ID');

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Read trip INSIDE the session — prevents stale status check (TOCTOU fix)
    const trip = await Trip.findById(id).session(session);
    if (!trip) {
      throw new ApiError(404, 'Trip not found');
    }

    if (trip.status !== TripStatus.DISPATCHED) {
      throw new ApiError(
        409,
        `Only Dispatched trips can be cancelled. Current status: ${trip.status}`,
      );
    }

    // 2. Update Trip status to Cancelled
    trip.status = TripStatus.CANCELLED;
    await trip.save({ session });

    // 3. Release Vehicle back to Available
    const vehicle = await Vehicle.findByIdAndUpdate(
      trip.vehicle,
      { status: VehicleStatus.AVAILABLE },
      { session, new: true },
    );
    if (!vehicle) {
      throw new ApiError(404, 'Vehicle assigned to this trip not found');
    }

    // 4. Release Driver back to Available
    const driver = await Driver.findByIdAndUpdate(
      trip.driver,
      { status: DriverStatus.AVAILABLE },
      { session, new: true },
    );
    if (!driver) {
      throw new ApiError(404, 'Driver assigned to this trip not found');
    }

    await session.commitTransaction();
    return trip;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
