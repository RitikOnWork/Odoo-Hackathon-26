import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Vehicle from '../models/Vehicle.model';
import Driver from '../models/Driver.model';
import Trip from '../models/Trip.model';
import { VehicleStatus, DriverStatus } from '../constants/enums';

async function testDispatch() {
  console.log('🔄 Connecting to database for seeding...');
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('MONGO_URI not found in env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log('✅ Connected to database.');

  try {
    // 1. Clean existing records
    await Promise.all([
      Vehicle.deleteMany({}),
      Driver.deleteMany({}),
      Trip.deleteMany({}),
    ]);

    // 2. Seed Vehicle (Available)
    const vehicle = await Vehicle.create({
      registrationNumber: 'MH-12-AB-1234',
      name: 'Tata Ultra T.7',
      type: 'Truck',
      maxLoadCapacity: 5000,
      odometer: 15000,
      acquisitionCost: 1200000,
      status: VehicleStatus.AVAILABLE,
    });
    console.log(`🚗 Seeded Vehicle: ${vehicle.registrationNumber} (Status: ${vehicle.status})`);

    // 3. Seed Driver (Available, license not expired)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 2); // Expiry in 2 years

    const driver = await Driver.create({
      name: 'Rohan Deshmukh',
      licenseNumber: 'MH1220230009876',
      licenseCategory: 'HMV',
      licenseExpiryDate: expiryDate,
      contactNumber: '+919876543210',
      safetyScore: 95,
      status: DriverStatus.AVAILABLE,
    });
    console.log(`👨 Seeded Driver: ${driver.name} (Status: ${driver.status})`);


    // 4. Create Trip (Draft)
    const trip = await Trip.create({
      source: 'Pune Warehouse A',
      destination: 'Mumbai Port Hub',
      vehicle: vehicle._id,
      driver: driver._id,
      cargoWeight: 4500,
      plannedDistance: 150.5,
    });
    console.log(`📋 Created Trip: ${trip.tripNumber} (Status: ${trip.status})`);

    // 5. Send POST to dispatch endpoint via built-in fetch
    console.log(`🚀 Sending PATCH request to dispatch trip: ${trip._id}...`);
    const response = await fetch(`http://localhost:5000/api/trips/${trip._id}/dispatch`, {
      method: 'PATCH',
    });

    const result = await response.json() as any;
    console.log(`📥 Response Status: ${response.status}`);
    console.log('📥 Response Data:', JSON.stringify(result, null, 2));

    // 6. Verify statuses after dispatch
    const [updatedTrip, updatedVehicle, updatedDriver] = await Promise.all([
      Trip.findById(trip._id),
      Vehicle.findById(vehicle._id),
      Driver.findById(driver._id),
    ]);

    console.log('\n🔍 Verification after dispatch:');
    console.log(`Trip Status: ${updatedTrip?.status} (Expected: Dispatched)`);
    console.log(`Vehicle Status: ${updatedVehicle?.status} (Expected: On Trip)`);
    console.log(`Driver Status: ${updatedDriver?.status} (Expected: On Trip)`);

    if (
      updatedTrip?.status === 'Dispatched' &&
      updatedVehicle?.status === 'On Trip' &&
      updatedDriver?.status === 'On Trip'
    ) {
      console.log('\n🎉 TEST PASSED SUCCESSFULLY!');
    } else {
      console.error('\n❌ TEST FAILED: Statuses did not match expected values.');
    }
  } catch (error) {
    console.error('❌ Test encountered error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected database.');
  }
}

testDispatch();
