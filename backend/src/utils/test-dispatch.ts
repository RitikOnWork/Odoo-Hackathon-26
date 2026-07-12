import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Vehicle from '../models/Vehicle.model';
import Driver from '../models/Driver.model';
import Trip from '../models/Trip.model';
import { VehicleStatus, DriverStatus, TripStatus } from '../constants/enums';

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

    // ─── TEST FLOW 1: DISPATCH AND CANCEL ───
    console.log('\n--- FLOW 1: DISPATCH AND CANCEL ---');

    // Create Trip 1 (Draft)
    const trip1 = await Trip.create({
      source: 'Pune Warehouse A',
      destination: 'Mumbai Port Hub',
      vehicle: vehicle._id,
      driver: driver._id,
      cargoWeight: 4000,
      plannedDistance: 150,
    });
    console.log(`📋 Created Trip 1: ${trip1.tripNumber} (Status: ${trip1.status})`);

    // Try to cancel a Draft trip (should fail with 409)
    console.log('🚀 Trying to cancel Draft trip (expecting 409)...');
    const cancelDraftResponse = await fetch(`http://localhost:5000/api/trips/${trip1._id}/cancel`, {
      method: 'PATCH',
    });
    const cancelDraftResult = await cancelDraftResponse.json() as any;
    console.log(`📥 Response Status: ${cancelDraftResponse.status} (Expected: 409)`);
    console.log(`📥 Response Message: ${cancelDraftResult.message}`);

    // Dispatch Trip 1
    console.log('🚀 Dispatching Trip 1...');
    const dispatchResponse1 = await fetch(`http://localhost:5000/api/trips/${trip1._id}/dispatch`, {
      method: 'PATCH',
    });
    const dispatchResult1 = await dispatchResponse1.json() as any;
    console.log(`📥 Response Status: ${dispatchResponse1.status} (Expected: 200)`);
    console.log(`Trip 1 Status after dispatch: ${dispatchResult1.data.status}`);

    // Cancel Trip 1
    console.log('🚀 Cancelling Trip 1...');
    const cancelResponse = await fetch(`http://localhost:5000/api/trips/${trip1._id}/cancel`, {
      method: 'PATCH',
    });
    const cancelResult = await cancelResponse.json() as any;
    console.log(`📥 Response Status: ${cancelResponse.status} (Expected: 200)`);
    console.log('📥 Response Data:', JSON.stringify(cancelResult, null, 2));

    // Verify DB states after cancellation
    const [cancelledTrip, releasedVehicle, releasedDriver] = await Promise.all([
      Trip.findById(trip1._id),
      Vehicle.findById(vehicle._id),
      Driver.findById(driver._id),
    ]);

    console.log('\n🔍 Verification after cancellation:');
    console.log(`Trip 1 Status: ${cancelledTrip?.status} (Expected: Cancelled)`);
    console.log(`Vehicle Status: ${releasedVehicle?.status} (Expected: Available)`);
    console.log(`Driver Status: ${releasedDriver?.status} (Expected: Available)`);

    if (
      cancelledTrip?.status === TripStatus.CANCELLED &&
      releasedVehicle?.status === VehicleStatus.AVAILABLE &&
      releasedDriver?.status === DriverStatus.AVAILABLE
    ) {
      console.log('🎉 CANCEL TEST PASSED!');
    } else {
      console.error('❌ CANCEL TEST FAILED!');
    }


    // ─── TEST FLOW 2: DISPATCH AND COMPLETE ───
    console.log('\n--- FLOW 2: DISPATCH AND COMPLETE ---');

    // Create Trip 2 (Draft)
    const trip2 = await Trip.create({
      source: 'Mumbai Port Hub',
      destination: 'Pune Warehouse A',
      vehicle: vehicle._id,
      driver: driver._id,
      cargoWeight: 4500,
      plannedDistance: 150.5,
    });
    console.log(`📋 Created Trip 2: ${trip2.tripNumber} (Status: ${trip2.status})`);

    // Dispatch Trip 2
    console.log('🚀 Dispatching Trip 2...');
    const dispatchResponse2 = await fetch(`http://localhost:5000/api/trips/${trip2._id}/dispatch`, {
      method: 'PATCH',
    });
    const dispatchResult2 = await dispatchResponse2.json() as any;
    console.log(`📥 Response Status: ${dispatchResponse2.status} (Expected: 200)`);
    console.log(`Trip 2 Status after dispatch: ${dispatchResult2.data.status}`);

    // Test Odometer Validation (Final Odometer less than current vehicle odometer)
    console.log('🚀 Testing invalid final odometer validation (expecting 400)...');
    const invalidCompleteResponse = await fetch(`http://localhost:5000/api/trips/${trip2._id}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actualDistance: 152.2,
        finalOdometer: 14000, // less than current odometer of 15000
        fuelConsumed: 12.5,
      }),
    });
    const invalidResult = await invalidCompleteResponse.json() as any;
    console.log(`📥 Response Status: ${invalidCompleteResponse.status} (Expected: 400)`);
    console.log(`📥 Response Message: ${invalidResult.message}`);

    // Test Valid Completion
    console.log('🚀 Sending PATCH request to complete Trip 2...');
    const completeResponse = await fetch(`http://localhost:5000/api/trips/${trip2._id}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actualDistance: 152.2,
        finalOdometer: 15152, // greater than current odometer of 15000
        fuelConsumed: 12.5,
      }),
    });

    const completeResult = await completeResponse.json() as any;
    console.log(`📥 Response Status: ${completeResponse.status} (Expected: 200)`);
    console.log('📥 Response Data:', JSON.stringify(completeResult, null, 2));

    // Verify DB states after completion
    const [finalTrip, finalVehicle, finalDriver] = await Promise.all([
      Trip.findById(trip2._id),
      Vehicle.findById(vehicle._id),
      Driver.findById(driver._id),
    ]);

    console.log('\n🔍 Verification after completion:');
    console.log(`Trip 2 Status: ${finalTrip?.status} (Expected: Completed)`);
    console.log(`Vehicle Status: ${finalVehicle?.status} (Expected: Available)`);
    console.log(`Vehicle Odometer: ${finalVehicle?.odometer} km (Expected: 15152 km)`);
    console.log(`Driver Status: ${finalDriver?.status} (Expected: Available)`);

    if (
      finalTrip?.status === TripStatus.COMPLETED &&
      finalVehicle?.status === VehicleStatus.AVAILABLE &&
      finalVehicle?.odometer === 15152 &&
      finalDriver?.status === DriverStatus.AVAILABLE
    ) {
      console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
    } else {
      console.error('❌ COMPLETION TEST FAILED!');
    }
  } catch (error) {
    console.error('❌ Test encountered error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected database.');
  }
}

testDispatch();
