/**
 * models/Vehicle.model.ts
 *
 * Mongoose schema for the Vehicle collection.
 * Only fields needed for trip pre-validation are marked required here;
 * the full fleet-management schema can extend this later.
 *
 * Key fields for trip pre-creation checks:
 *  - status: must be VehicleStatus.AVAILABLE
 *  - plateNumber: unique identifier
 */

import { Schema, model } from 'mongoose';
import { IVehicleDocument } from '../types/vehicle.types';
import { VehicleStatus } from '../constants/enums';

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

    type: {
      type:     String,
      required: [true, 'Vehicle type is required'],
      trim:     true,
    },

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

const Vehicle = model<IVehicleDocument>('Vehicle', VehicleSchema);

export default Vehicle;
