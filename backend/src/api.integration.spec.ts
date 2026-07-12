/**
 * api.integration.spec.ts
 *
 * End-to-end integration tests for the Trip and Maintenance APIs.
 * Uses mongodb-memory-server (ReplicaSet) for transaction support.
 *
 * Auth: Tests generate a valid JWT using the same JWT_SECRET so that
 * the authenticate middleware passes without mocking.
 */

import mongoose   from 'mongoose';
import request    from 'supertest';
import jwt        from 'jsonwebtoken';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import app         from './server';
import Vehicle     from './models/Vehicle.model';
import Driver      from './models/Driver.model';
import Trip        from './models/Trip.model';
import Maintenance from './models/Maintenance.model';
import { DriverStatus, MaintenanceType, TripStatus, UserRole, VehicleStatus } from './constants/enums';

// ── Test setup ────────────────────────────────────────────────────────────────

let mongo: MongoMemoryReplSet;
let serial    = 0;
let authToken = '';

const JWT_SECRET = 'test-secret-for-integration-tests';

const futureDate = () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
const pastDate   = () => new Date(Date.now() - 24 * 60 * 60 * 1000);

beforeAll(async () => {
  // Inject test secret before server starts
  process.env.JWT_SECRET = JWT_SECRET;

  mongo = await MongoMemoryReplSet.create({
    replSet: { storageEngine: 'wiredTiger' },
  });
  await mongoose.connect(mongo.getUri());

  // Generate a valid Fleet Manager token for all test requests
  authToken = jwt.sign(
    { userId: new mongoose.Types.ObjectId().toString(), role: UserRole.FLEET_MANAGER, email: 'test@transitops.dev' },
    JWT_SECRET,
    { expiresIn: '1h' },
  );
});

afterEach(async () => {
  await Promise.all([
    Trip.deleteMany({}),
    Maintenance.deleteMany({}),
    Vehicle.deleteMany({}),
    Driver.deleteMany({}),
  ]);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

// ── Seed helpers ──────────────────────────────────────────────────────────────

async function seedVehicle(status = VehicleStatus.AVAILABLE) {
  serial += 1;
  return Vehicle.create({
    registrationNumber: `MH-12-TS-${String(serial).padStart(4, '0')}`,
    name:              `Test Truck ${serial}`,
    type:              'Truck',
    maxLoadCapacity:   5000,
    odometer:          1000,
    acquisitionCost:   1_000_000,
    status,
  });
}

async function seedDriver(status = DriverStatus.AVAILABLE, licenseExpiryDate = futureDate()) {
  serial += 1;
  return Driver.create({
    name:              `Test Driver ${serial}`,
    licenseNumber:     `LIC-${serial}`,
    licenseCategory:   'HMV',
    licenseExpiryDate,
    contactNumber:     '+919876543210',
    safetyScore:       95,
    status,
  });
}

async function seedDraftTrip(vehicle: string, driver: string, cargoWeight = 1000) {
  return Trip.create({
    source:          'Pune',
    destination:     'Mumbai',
    vehicle,
    driver,
    cargoWeight,
    plannedDistance: 150,
    status:          TripStatus.DRAFT,
  });
}

/** Authenticated supertest helper — wraps each HTTP method with the auth header. */
const api = {
  get:    (url: string) => request(app).get(url).set('Authorization', `Bearer ${authToken}`),
  post:   (url: string) => request(app).post(url).set('Authorization', `Bearer ${authToken}`),
  put:    (url: string) => request(app).put(url).set('Authorization', `Bearer ${authToken}`),
  patch:  (url: string) => request(app).patch(url).set('Authorization', `Bearer ${authToken}`),
  delete: (url: string) => request(app).delete(url).set('Authorization', `Bearer ${authToken}`),
};

// ── Trip API ──────────────────────────────────────────────────────────────────

describe('Trip API', () => {

  it('rejects unauthenticated requests with 401', async () => {
    const response = await request(app).get('/api/trips');
    expect(response.status).toBe(401);
  });

  it('creates a draft trip and returns its generated trip number', async () => {
    const vehicle = await seedVehicle();
    const driver  = await seedDriver();

    const response = await api.post('/api/trips').send({
      source:          'Pune',
      destination:     'Mumbai',
      vehicleId:       vehicle.id,
      driverId:        driver.id,
      cargoWeight:     1000,
      plannedDistance: 150,
    });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe(TripStatus.DRAFT);
    expect(response.body.data.tripNumber).toMatch(/^TRIP-\d{6}$/);
  });

  it('rejects cargo above the vehicle capacity', async () => {
    const vehicle  = await seedVehicle();
    const driver   = await seedDriver();
    const response = await api.post('/api/trips').send({
      source: 'Pune', destination: 'Mumbai', vehicleId: vehicle.id, driverId: driver.id,
      cargoWeight: 5001, plannedDistance: 150,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Cargo weight.*exceeds/);

  });

  it.each([
    [DriverStatus.ON_TRIP,   futureDate(), 'On Trip'],
    [DriverStatus.SUSPENDED, futureDate(), 'Suspended'],
    [DriverStatus.AVAILABLE, pastDate(),   'expired license'],
  ])('rejects dispatch for driver status=%s / expiry=%s', async (status, expiry, expected) => {
    const vehicle = await seedVehicle();
    const driver  = await seedDriver(status, expiry);
    const trip    = await seedDraftTrip(vehicle.id, driver.id);
    const response = await api.patch(`/api/trips/${trip.id}/dispatch`);
    expect(response.status).toBe(422);
    expect(response.body.message).toMatch(new RegExp(expected, 'i'));
  });

  it.each([
    [VehicleStatus.ON_TRIP, 'On Trip'],
    [VehicleStatus.IN_SHOP, 'In Shop'],
    [VehicleStatus.RETIRED, 'Retired'],
  ])('rejects dispatch for vehicle status=%s', async (status, expected) => {
    const vehicle  = await seedVehicle(status);
    const driver   = await seedDriver();
    const trip     = await seedDraftTrip(vehicle.id, driver.id);
    const response = await api.patch(`/api/trips/${trip.id}/dispatch`);
    expect(response.status).toBe(422);
    expect(response.body.message).toMatch(expected);
  });

  it('dispatches an eligible trip and changes both resource statuses', async () => {
    const vehicle  = await seedVehicle();
    const driver   = await seedDriver();
    const trip     = await seedDraftTrip(vehicle.id, driver.id);
    const response = await api.patch(`/api/trips/${trip.id}/dispatch`);

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe(TripStatus.DISPATCHED);
    expect((await Vehicle.findById(vehicle.id))?.status).toBe(VehicleStatus.ON_TRIP);
    expect((await Driver.findById(driver.id))?.status).toBe(DriverStatus.ON_TRIP);
  });

  it('completes a dispatched trip and releases its vehicle and driver', async () => {
    const vehicle = await seedVehicle();
    const driver  = await seedDriver();
    const trip    = await seedDraftTrip(vehicle.id, driver.id);
    await api.patch(`/api/trips/${trip.id}/dispatch`);

    const response = await api.patch(`/api/trips/${trip.id}/complete`).send({
      actualDistance: 155,
      finalOdometer:  1155,
      fuelConsumed:   20,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe(TripStatus.COMPLETED);
    expect((await Vehicle.findById(vehicle.id))?.status).toBe(VehicleStatus.AVAILABLE);
    expect((await Driver.findById(driver.id))?.status).toBe(DriverStatus.AVAILABLE);
    // Odometer should be updated to finalOdometer
    expect((await Vehicle.findById(vehicle.id))?.odometer).toBe(1155);
  });

  it('rejects completing a trip with a final odometer less than current vehicle odometer', async () => {
    const vehicle = await seedVehicle(); // odometer = 1000
    const driver  = await seedDriver();
    const trip    = await seedDraftTrip(vehicle.id, driver.id);
    await api.patch(`/api/trips/${trip.id}/dispatch`);

    const response = await api.patch(`/api/trips/${trip.id}/complete`).send({
      actualDistance: 155,
      finalOdometer:  500,  // less than current 1000
      fuelConsumed:   20,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/cannot be less than/i);
  });

  it('cancels a dispatched trip and releases its resources', async () => {
    const vehicle  = await seedVehicle();
    const driver   = await seedDriver();
    const trip     = await seedDraftTrip(vehicle.id, driver.id);
    await api.patch(`/api/trips/${trip.id}/dispatch`);
    const response = await api.patch(`/api/trips/${trip.id}/cancel`);

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe(TripStatus.CANCELLED);
    expect((await Vehicle.findById(vehicle.id))?.status).toBe(VehicleStatus.AVAILABLE);
    expect((await Driver.findById(driver.id))?.status).toBe(DriverStatus.AVAILABLE);
  });

  it('rejects cancelling a non-dispatched trip', async () => {
    const vehicle  = await seedVehicle();
    const driver   = await seedDriver();
    const trip     = await seedDraftTrip(vehicle.id, driver.id);
    const response = await api.patch(`/api/trips/${trip.id}/cancel`);

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/Only Dispatched/);
  });

  it('rejects deleting a dispatched trip', async () => {
    const vehicle  = await seedVehicle();
    const driver   = await seedDriver();
    const trip     = await seedDraftTrip(vehicle.id, driver.id);
    await api.patch(`/api/trips/${trip.id}/dispatch`);
    const response = await api.delete(`/api/trips/${trip.id}`);

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/Cannot delete/);
  });
});

// ── Maintenance API ───────────────────────────────────────────────────────────

describe('Maintenance API', () => {
  const payload = (vehicleId: string) => ({
    vehicleId,
    maintenanceType: MaintenanceType.PREVENTIVE,
    description:     'Routine service and brake inspection.',
    cost:            2500,
    startDate:       new Date().toISOString(),
  });

  it('rejects unauthenticated requests with 401', async () => {
    const response = await request(app).get('/api/maintenance');
    expect(response.status).toBe(401);
  });

  it('creates maintenance, marks the vehicle In Shop, and returns it', async () => {
    const vehicle  = await seedVehicle();
    const response = await api.post('/api/maintenance').send(payload(vehicle.id));

    expect(response.status).toBe(201);
    expect(response.body.data.vehicle.status).toBe(VehicleStatus.IN_SHOP);
    expect((await Vehicle.findById(vehicle.id))?.status).toBe(VehicleStatus.IN_SHOP);
  });

  it('rejects creating a second Active maintenance log for the same vehicle', async () => {
    const vehicle = await seedVehicle();
    await api.post('/api/maintenance').send(payload(vehicle.id));

    // Second request for same vehicle — should be rejected with a descriptive 409
    const response = await api.post('/api/maintenance').send(payload(vehicle.id));
    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/already has an active maintenance log/i);
  });

  it('completes maintenance, marks the vehicle Available, and returns it', async () => {
    const vehicle = await seedVehicle();
    const created = await api.post('/api/maintenance').send(payload(vehicle.id));

    const response = await api.patch(`/api/maintenance/${created.body.data.maintenance._id}/complete`)
      .send({ endDate: new Date().toISOString() });

    expect(response.status).toBe(200);
    expect(response.body.data.vehicle.status).toBe(VehicleStatus.AVAILABLE);
    expect((await Vehicle.findById(vehicle.id))?.status).toBe(VehicleStatus.AVAILABLE);
  });

  it('does not change a Retired vehicle during maintenance lifecycle', async () => {
    const vehicle = await seedVehicle(VehicleStatus.RETIRED);
    const created = await api.post('/api/maintenance').send(payload(vehicle.id));

    const response = await api.patch(`/api/maintenance/${created.body.data.maintenance._id}/complete`)
      .send({ endDate: new Date().toISOString() });

    expect(created.body.data.vehicle.status).toBe(VehicleStatus.RETIRED);
    expect(response.status).toBe(200);
    expect(response.body.data.vehicle.status).toBe(VehicleStatus.RETIRED);
  });

  it('blocks deletion of an Active maintenance log (vehicle would be stuck In Shop)', async () => {
    const vehicle  = await seedVehicle();
    const created  = await api.post('/api/maintenance').send(payload(vehicle.id));
    const id       = created.body.data.maintenance._id;

    const response = await api.delete(`/api/maintenance/${id}`);

    expect(response.status).toBe(409);
    expect(response.body.message).toMatch(/Cannot delete an Active maintenance/i);
    // Vehicle must still be In Shop — not freed by the blocked delete
    expect((await Vehicle.findById(vehicle.id))?.status).toBe(VehicleStatus.IN_SHOP);
  });

  it('allows deletion of a Completed maintenance log', async () => {
    const vehicle = await seedVehicle();
    const created = await api.post('/api/maintenance').send(payload(vehicle.id));
    const id      = created.body.data.maintenance._id;

    // Complete it first
    await api.patch(`/api/maintenance/${id}/complete`)
      .send({ endDate: new Date().toISOString() });

    const response = await api.delete(`/api/maintenance/${id}`);
    expect(response.status).toBe(200);
  });
});
