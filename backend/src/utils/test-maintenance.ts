import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Vehicle from '../models/Vehicle.model';
import Maintenance from '../models/Maintenance.model';
import { VehicleStatus, MaintenanceType, MaintenanceStatus } from '../constants/enums';

async function testMaintenanceCRUD() {
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
      Maintenance.deleteMany({}),
    ]);

    // 2. Seed Vehicle A (Available)
    const vehicleA = await Vehicle.create({
      registrationNumber: 'MH-12-XY-9999',
      name: 'Mahindra Blazo X',
      type: 'Truck',
      maxLoadCapacity: 15000,
      odometer: 45000,
      acquisitionCost: 3500000,
      status: VehicleStatus.AVAILABLE,
    });
    console.log(`🚗 Seeded Vehicle A: ${vehicleA.registrationNumber} (Status: ${vehicleA.status})`);

    // 3. Seed Vehicle B (Retired)
    const vehicleB = await Vehicle.create({
      registrationNumber: 'MH-12-RE-1111',
      name: 'Tata LPT 1613',
      type: 'Truck',
      maxLoadCapacity: 10000,
      odometer: 250000,
      acquisitionCost: 2000000,
      status: VehicleStatus.RETIRED,
    });
    console.log(`🚗 Seeded Vehicle B: ${vehicleB.registrationNumber} (Status: ${vehicleB.status})`);

    // ─── FLOW 1: STANDARD MAINTENANCE START & COMPLETE ───
    console.log('\n--- FLOW 1: STANDARD VEHICLE MAINTENANCE ---');

    // Create Maintenance on Vehicle A
    console.log('🚀 Creating maintenance record for Vehicle A...');
    const postResponseA = await fetch('http://localhost:5000/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehicleId: vehicleA._id,
        maintenanceType: MaintenanceType.PREVENTIVE,
        description: 'Routine oil change and brake pad check.',
        cost: 4500.00,
        startDate: new Date().toISOString(),
      }),
    });
    const postResultA = await postResponseA.json() as any;
    console.log(`📥 Response Status: ${postResponseA.status} (Expected: 201)`);
    console.log(`Maintenance Log Status: ${postResultA.data.maintenance.status}`);
    console.log(`Returned Vehicle Status: ${postResultA.data.vehicle.status} (Expected: In Shop)`);

    // Verify Vehicle A status in DB is "In Shop"
    let dbVehicleA = await Vehicle.findById(vehicleA._id);
    console.log(`🔍 DB Vehicle A Status: ${dbVehicleA?.status} (Expected: In Shop)`);

    // Complete Maintenance on Vehicle A
    console.log('\n🚀 Completing maintenance for Vehicle A...');
    const logIdA = postResultA.data.maintenance._id;
    const completeResponseA = await fetch(`http://localhost:5000/api/maintenance/${logIdA}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endDate: new Date().toISOString(),
        cost: 4800.00,
      }),
    });
    const completeResultA = await completeResponseA.json() as any;
    console.log(`📥 Response Status: ${completeResponseA.status} (Expected: 200)`);
    console.log(`Returned Vehicle Status: ${completeResultA.data.vehicle.status} (Expected: Available)`);

    // Verify Vehicle A status in DB is "Available"
    dbVehicleA = await Vehicle.findById(vehicleA._id);
    console.log(`🔍 DB Vehicle A Status: ${dbVehicleA?.status} (Expected: Available)`);

    if (dbVehicleA?.status === VehicleStatus.AVAILABLE) {
      console.log('🎉 STANDARD MAINTENANCE FLOW PASSED!');
    } else {
      console.error('❌ STANDARD MAINTENANCE FLOW FAILED!');
    }


    // ─── FLOW 2: RETIRED VEHICLE MAINTENANCE ───
    console.log('\n--- FLOW 2: RETIRED VEHICLE MAINTENANCE ---');

    // Create Maintenance on Vehicle B (Retired)
    console.log('🚀 Creating maintenance record for Retired Vehicle B...');
    const postResponseB = await fetch('http://localhost:5000/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehicleId: vehicleB._id,
        maintenanceType: MaintenanceType.CORRECTIVE,
        description: 'Engine overhaul check on decommissioned truck.',
        cost: 15000.00,
        startDate: new Date().toISOString(),
      }),
    });
    const postResultB = await postResponseB.json() as any;
    console.log(`📥 Response Status: ${postResponseB.status} (Expected: 201)`);
    console.log(`Returned Vehicle Status: ${postResultB.data.vehicle.status} (Expected: Retired)`);

    // Verify Vehicle B status in DB remains "Retired"
    let dbVehicleB = await Vehicle.findById(vehicleB._id);
    console.log(`🔍 DB Vehicle B Status: ${dbVehicleB?.status} (Expected: Retired)`);

    // Complete Maintenance on Vehicle B
    console.log('\n🚀 Completing maintenance for Retired Vehicle B...');
    const logIdB = postResultB.data.maintenance._id;
    const completeResponseB = await fetch(`http://localhost:5000/api/maintenance/${logIdB}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endDate: new Date().toISOString(),
      }),
    });
    const completeResultB = await completeResponseB.json() as any;
    console.log(`📥 Response Status: ${completeResponseB.status} (Expected: 200)`);
    console.log(`Returned Vehicle Status: ${completeResultB.data.vehicle.status} (Expected: Retired)`);

    // Verify Vehicle B status in DB remains "Retired"
    dbVehicleB = await Vehicle.findById(vehicleB._id);
    console.log(`🔍 DB Vehicle B Status: ${dbVehicleB?.status} (Expected: Retired)`);

    if (dbVehicleB?.status === VehicleStatus.RETIRED) {
      console.log('🎉 RETIRED VEHICLE MAINTENANCE FLOW PASSED!');
      console.log('\n🎉 ALL BUSINESS RULE TESTS PASSED SUCCESSFULLY!');
    } else {
      console.error('❌ RETIRED VEHICLE MAINTENANCE FLOW FAILED!');
    }
  } catch (error) {
    console.error('❌ Test encountered error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected database.');
  }
}

testMaintenanceCRUD();
