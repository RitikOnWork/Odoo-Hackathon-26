/**
 * models/Driver.model.ts
 *
<<<<<<< HEAD
 * Mongoose schema and compiled Model for the Driver collection.
 *
 * Key design decisions:
 *  - licenseNumber is unique, same reasoning as Vehicle.registrationNumber.
 *  - licenseExpiryDate is a plain Date — expiry checks (used to block trip
 *    assignment) are computed at query/service time (`licenseExpiryDate <
 *    now`), not stored as a derived boolean, so it never goes stale.
 *  - safetyScore is a bounded 0-100 number, informational for the Safety
 *    Officer role; not enforced against dispatch eligibility here.
=======
 * Mongoose schema for the Driver collection.
 * Only fields needed for trip pre-validation are marked required here;
 * the full HR schema can extend this later.
 *
 * Key fields for trip pre-creation checks:
 *  - status:        must be DriverStatus.AVAILABLE  (not Suspended / On Leave / On Trip)
 *  - licenseExpiry: must be in the future
 *  - licenseNumber: unique identifier
>>>>>>> 5e3340f331afcc3c13731876201c79dc18f61cda
 */

import { Schema, model } from 'mongoose';
import { IDriverDocument } from '../types/driver.types';
import { DriverStatus } from '../constants/enums';

<<<<<<< HEAD
// ── Schema Definition ─────────────────────────────────────────────────────────
=======
>>>>>>> 5e3340f331afcc3c13731876201c79dc18f61cda
const DriverSchema = new Schema<IDriverDocument>(
  {
    name: {
      type:     String,
<<<<<<< HEAD
      required: [true, 'Name is required'],
      trim:     true,
    },

=======
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

>>>>>>> 5e3340f331afcc3c13731876201c79dc18f61cda
    licenseNumber: {
      type:     String,
      required: [true, 'License number is required'],
      unique:   true,
      trim:     true,
      uppercase: true,
<<<<<<< HEAD
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
=======
    },

    licenseExpiry: {
      type:     Date,
      required: [true, 'License expiry date is required'],
      index:    true,   // queried on every trip creation
>>>>>>> 5e3340f331afcc3c13731876201c79dc18f61cda
    },

    status: {
      type:     String,
      enum:     Object.values(DriverStatus),
      default:  DriverStatus.AVAILABLE,
      required: true,
<<<<<<< HEAD
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
=======
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

>>>>>>> 5e3340f331afcc3c13731876201c79dc18f61cda
const Driver = model<IDriverDocument>('Driver', DriverSchema);

export default Driver;
