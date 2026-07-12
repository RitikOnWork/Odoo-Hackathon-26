/**
 * models/Driver.model.ts
 *
 * Mongoose schema and compiled Model for the Driver collection.
 *
 * Key design decisions:
 *  - licenseNumber is unique, same reasoning as Vehicle.registrationNumber.
 *  - licenseExpiryDate is a plain Date — expiry checks (used to block trip
 *    assignment) are computed at query/service time (`licenseExpiryDate <
 *    now`), not stored as a derived boolean, so it never goes stale.
 *  - safetyScore is a bounded 0-100 number, informational for the Safety
 *    Officer role; not enforced against dispatch eligibility here.
 */

import { Schema, model } from 'mongoose';
import { IDriverDocument } from '../types/driver.types';
import { DriverStatus } from '../constants/enums';

// ── Schema Definition ─────────────────────────────────────────────────────────
const DriverSchema = new Schema<IDriverDocument>(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },

    licenseNumber: {
      type:     String,
      required: [true, 'License number is required'],
      unique:   true,
      trim:     true,
      uppercase: true,
      index:    true,
    },

    licenseCategory: {
      type:     String,
      required: [true, 'License category is required'],
      trim:     true,
    },

    licenseExpiryDate: {
      type:     Date,
      required: [true, 'License expiry date is required'],
    },

    contactNumber: {
      type:     String,
      required: [true, 'Contact number is required'],
      trim:     true,
    },

    safetyScore: {
      type:     Number,
      min:      [0, 'Safety score cannot be negative'],
      max:      [100, 'Safety score cannot exceed 100'],
      default:  100,
    },

    status: {
      type:     String,
      enum:     Object.values(DriverStatus),
      default:  DriverStatus.AVAILABLE,
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

// ── Virtual: isLicenseExpired ─────────────────────────────────────────────────
DriverSchema.virtual('isLicenseExpired').get(function (this: IDriverDocument) {
  return this.licenseExpiryDate.getTime() < Date.now();
});

// ── Indexes ───────────────────────────────────────────────────────────────────
DriverSchema.index({ status: 1, licenseExpiryDate: 1 });   // dispatch-eligibility queries

// ── Compiled Model ────────────────────────────────────────────────────────────
const Driver = model<IDriverDocument>('Driver', DriverSchema);

export default Driver;
