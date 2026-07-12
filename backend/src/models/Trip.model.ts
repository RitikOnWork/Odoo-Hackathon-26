/**
 * models/Trip.model.ts
 *
 * Mongoose schema and compiled Model for the Trip collection.
 *
 * Key design decisions:
 *  - tripNumber is auto-generated via a pre-validate hook using the Counter
 *    collection → produces padded IDs like "TRIP-000001".
 *  - Optional numeric fields (actualDistance, finalOdometer, fuelConsumed,
 *    dispatchedAt, completedAt) are set progressively as the trip moves through
 *    its lifecycle (Draft → Dispatched → Completed).
 *  - Compound index on (vehicle, status) speeds up fleet-status queries.
 *  - Compound index on (driver, status) speeds up driver-workload queries.
 */

import { Schema, model } from 'mongoose';
import { ITripDocument } from '../types/trip.types';
import { TripStatus } from '../constants/enums';
import Counter from './Counter.model';

// ── Schema Definition ─────────────────────────────────────────────────────────
const TripSchema = new Schema<ITripDocument>(
  {
    tripNumber: {
      type:   String,
      unique: true,
      index:  true,
      // Value injected by pre-validate hook below — not set manually.
    },

    source: {
      type:     String,
      required: [true, 'Source location is required'],
      trim:     true,
    },

    destination: {
      type:     String,
      required: [true, 'Destination location is required'],
      trim:     true,
    },

    vehicle: {
      type:     Schema.Types.ObjectId,
      ref:      'Vehicle',
      required: [true, 'Vehicle reference is required'],
      index:    true,
    },

    driver: {
      type:     Schema.Types.ObjectId,
      ref:      'Driver',
      required: [true, 'Driver reference is required'],
      index:    true,
    },

    cargoWeight: {
      type:     Number,
      required: [true, 'Cargo weight (kg) is required'],
      min:      [0, 'Cargo weight cannot be negative'],
    },

    plannedDistance: {
      type:     Number,
      required: [true, 'Planned distance (km) is required'],
      min:      [0, 'Planned distance cannot be negative'],
    },

    // ── Fields filled progressively during the trip lifecycle ─────────────────

    actualDistance: {
      type:    Number,
      min:     [0, 'Actual distance cannot be negative'],
      default: null,
    },

    finalOdometer: {
      type:    Number,
      min:     [0, 'Final odometer reading cannot be negative'],
      default: null,
    },

    fuelConsumed: {
      type:    Number,
      min:     [0, 'Fuel consumed cannot be negative'],
      default: null,
    },

    status: {
      type:     String,
      enum:     Object.values(TripStatus),
      default:  TripStatus.DRAFT,
      required: true,
    },

    dispatchedAt: {
      type:    Date,
      default: null,
    },

    completedAt: {
      type:    Date,
      default: null,
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
// Optimise common query patterns
TripSchema.index({ vehicle: 1, status: 1 });   // fleet status dashboard
TripSchema.index({ driver:  1, status: 1 });   // driver workload view
TripSchema.index({ status:  1, createdAt: -1 }); // status-filtered list, newest first

// ── Pre-validate Hook: Auto-generate tripNumber ───────────────────────────────
TripSchema.pre<ITripDocument>('validate', async function (next) {
  if (this.isNew && !this.tripNumber) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'tripNumber',                    // document _id in counters collection
        { $inc: { seq: 1 } },
        { new: true, upsert: true }      // create if it doesn't exist
      );
      // Format: TRIP-000001, TRIP-000042, etc.
      this.tripNumber = `TRIP-${String(counter!.seq).padStart(6, '0')}`;
    } catch (err) {
      return next(err as Error);
    }
  }
  next();
});

// ── Compiled Model ────────────────────────────────────────────────────────────
const Trip = model<ITripDocument>('Trip', TripSchema);

export default Trip;
