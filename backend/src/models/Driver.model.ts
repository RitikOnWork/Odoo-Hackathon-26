/**
 * models/Driver.model.ts
 *
 * Mongoose schema for the Driver collection.
 * Only fields needed for trip pre-validation are marked required here;
 * the full HR schema can extend this later.
 *
 * Key fields for trip pre-creation checks:
 *  - status:        must be DriverStatus.AVAILABLE  (not Suspended / On Leave / On Trip)
 *  - licenseExpiry: must be in the future
 *  - licenseNumber: unique identifier
 */

import { Schema, model } from 'mongoose';
import { IDriverDocument } from '../types/driver.types';
import { DriverStatus } from '../constants/enums';

const DriverSchema = new Schema<IDriverDocument>(
  {
    name: {
      type:     String,
      required: [true, 'Driver name is required'],
      trim:     true,
    },

    phone: {
      type:     String,
      required: [true, 'Phone number is required'],
      trim:     true,
    },

    email: {
      type:     String,
      required: [true, 'Email is required'],
      unique:   true,
      trim:     true,
      lowercase: true,
    },

    licenseNumber: {
      type:     String,
      required: [true, 'License number is required'],
      unique:   true,
      trim:     true,
      uppercase: true,
    },

    licenseExpiry: {
      type:     Date,
      required: [true, 'License expiry date is required'],
      index:    true,   // queried on every trip creation
    },

    status: {
      type:     String,
      enum:     Object.values(DriverStatus),
      default:  DriverStatus.AVAILABLE,
      required: true,
      index:    true,   // queried on every trip creation
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  },
);

const Driver = model<IDriverDocument>('Driver', DriverSchema);

export default Driver;
