/**
 * models/Vehicle.model.ts
 *
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
 */

import { Schema, model } from 'mongoose';
import { IVehicleDocument } from '../types/vehicle.types';
import { VehicleStatus } from '../constants/enums';

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

    type: {
      type:     String,
      required: [true, 'Vehicle type is required'],
      trim:     true,
    },

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
const Vehicle = model<IVehicleDocument>('Vehicle', VehicleSchema);

export default Vehicle;
