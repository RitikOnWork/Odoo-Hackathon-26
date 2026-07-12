/**
 * models/Vehicle.model.ts
 *
<<<<<<< HEAD
 * Mongoose schema and compiled Model for the Vehicle collection.
 *
 * Key design decisions:
 *  - registrationNumber is unique — enforced at the DB level via a unique
 *    index, and re-checked at the service layer for a clean 409 error
 *    instead of a raw duplicate-key exception.
 *  - status drives dispatch eligibility: Retired/In Shop vehicles must
 *    never appear in the driver's vehicle-selection pool (enforced by
 *    query filters in the vehicle/trip services, not here).
 *  - region is optional and only used to power dashboard filters.
=======
 * Mongoose schema for the Vehicle collection.
 * Only fields needed for trip pre-validation are marked required here;
 * the full fleet-management schema can extend this later.
 *
 * Key fields for trip pre-creation checks:
 *  - status: must be VehicleStatus.AVAILABLE
 *  - plateNumber: unique identifier
>>>>>>> 5e3340f331afcc3c13731876201c79dc18f61cda
 */

import { Schema, model } from 'mongoose';
import { IVehicleDocument } from '../types/vehicle.types';
import { VehicleStatus } from '../constants/enums';

<<<<<<< HEAD
// ── Schema Definition ─────────────────────────────────────────────────────────
const VehicleSchema = new Schema<IVehicleDocument>(
  {
    registrationNumber: {
      type:     String,
      required: [true, 'Registration number is required'],
      unique:   true,
      trim:     true,
      uppercase: true,
      index:    true,
    },

    name: {
      type:     String,
      required: [true, 'Vehicle name/model is required'],
      trim:     true,
    },

=======
const VehicleSchema = new Schema<IVehicleDocument>(
  {
    plateNumber: {
      type:     String,
      required: [true, 'Plate number is required'],
      unique:   true,
      trim:     true,
      uppercase: true,
    },

    make: {
      type:     String,
      required: [true, 'Make is required'],
      trim:     true,
    },

    vehicleModel: {
      type:     String,
      required: [true, 'Model is required'],
      trim:     true,
    },

    year: {
      type:     Number,
      required: [true, 'Year is required'],
      min:      [1900, 'Year must be >= 1900'],
    },

>>>>>>> 5e3340f331afcc3c13731876201c79dc18f61cda
    type: {
      type:     String,
      required: [true, 'Vehicle type is required'],
      trim:     true,
    },

<<<<<<< HEAD
    maxLoadCapacity: {
      type:     Number,
      required: [true, 'Maximum load capacity (kg) is required'],
      min:      [0, 'Maximum load capacity cannot be negative'],
    },

    odometer: {
      type:     Number,
      required: [true, 'Odometer reading is required'],
      min:      [0, 'Odometer cannot be negative'],
      default:  0,
    },

    acquisitionCost: {
      type:     Number,
      required: [true, 'Acquisition cost is required'],
      min:      [0, 'Acquisition cost cannot be negative'],
    },

    region: {
      type:  String,
      trim:  true,
      default: null,
    },

    status: {
      type:     String,
      enum:     Object.values(VehicleStatus),
      default:  VehicleStatus.AVAILABLE,
      required: true,
      index:    true,
    },
  },
  {
    timestamps: true,              // adds createdAt & updatedAt automatically
    versionKey: false,             // removes __v field
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
VehicleSchema.index({ status: 1, type: 1, region: 1 });   // dashboard filters

// ── Compiled Model ────────────────────────────────────────────────────────────
=======
    capacity: {
      type:     Number,
      required: [true, 'Capacity (kg) is required'],
      min:      [0, 'Capacity cannot be negative'],
    },

    currentOdometer: {
      type:    Number,
      default: 0,
      min:     [0, 'Odometer cannot be negative'],
    },

    status: {
      type:    String,
      enum:    Object.values(VehicleStatus),
      default: VehicleStatus.AVAILABLE,
      required: true,
      index:   true,   // queried on every trip creation
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  },
);

>>>>>>> 5e3340f331afcc3c13731876201c79dc18f61cda
const Vehicle = model<IVehicleDocument>('Vehicle', VehicleSchema);

export default Vehicle;
