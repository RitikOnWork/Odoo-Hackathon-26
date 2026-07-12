/**
 * models/Maintenance.model.ts
 *
 * Mongoose schema and compiled Model for the Maintenance collection.
 *
 * Key design decisions:
 *  - endDate is optional — set only when status transitions to Completed.
 *  - A pre-save hook enforces the business rule: if status is Completed,
 *    endDate must be present.
 *  - Index on (vehicle, status) supports "active maintenance per vehicle" queries
 *    which are needed to block trip dispatch while maintenance is ongoing.
 *  - cost is stored as a plain Number (no currency conversion layer here);
 *    formatting is the consumer's responsibility.
 */

import { Schema, model } from 'mongoose';
import { IMaintenanceDocument } from '../types/maintenance.types';
import { MaintenanceStatus, MaintenanceType } from '../constants/enums';

// ── Schema Definition ─────────────────────────────────────────────────────────
const MaintenanceSchema = new Schema<IMaintenanceDocument>(
  {
    vehicle: {
      type:     Schema.Types.ObjectId,
      ref:      'Vehicle',
      required: [true, 'Vehicle reference is required'],
      index:    true,
    },

    maintenanceType: {
      type:     String,
      enum:     Object.values(MaintenanceType),
      required: [true, 'Maintenance type is required'],
    },

    description: {
      type:     String,
      required: [true, 'Description is required'],
      trim:     true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    cost: {
      type:     Number,
      required: [true, 'Cost is required'],
      min:      [0, 'Cost cannot be negative'],
    },

    status: {
      type:     String,
      enum:     Object.values(MaintenanceStatus),
      default:  MaintenanceStatus.ACTIVE,
      required: true,
    },

    startDate: {
      type:     Date,
      required: [true, 'Start date is required'],
    },

    endDate: {
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
MaintenanceSchema.index({ vehicle: 1, status: 1 });           // active-maintenance check per vehicle
MaintenanceSchema.index({ status: 1, startDate: -1 });        // ops dashboard: latest active jobs

// ── Virtual: durationDays ─────────────────────────────────────────────────────
// Computed on the fly — no need to store it in the DB.
MaintenanceSchema.virtual('durationDays').get(function (this: IMaintenanceDocument) {
  if (!this.endDate) return null;
  const ms = this.endDate.getTime() - this.startDate.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
});

// ── Pre-save Hook: Business Rule Validation ───────────────────────────────────
MaintenanceSchema.pre<IMaintenanceDocument>('save', function (next) {
  // Rule: Completed maintenance must have an endDate
  if (this.status === MaintenanceStatus.COMPLETED && !this.endDate) {
    return next(new Error('endDate is required when status is Completed'));
  }
  // Rule: endDate must not be before startDate
  if (this.endDate && this.endDate < this.startDate) {
    return next(new Error('endDate cannot be earlier than startDate'));
  }
  next();
});

// ── Compiled Model ────────────────────────────────────────────────────────────
const Maintenance = model<IMaintenanceDocument>('Maintenance', MaintenanceSchema);

export default Maintenance;
