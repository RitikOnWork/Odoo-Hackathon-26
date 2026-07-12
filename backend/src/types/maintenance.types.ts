/**
 * types/maintenance.types.ts
 * TypeScript interfaces for the Maintenance domain.
 */

import { Document, Types } from 'mongoose';
import { MaintenanceStatus, MaintenanceType } from '../constants/enums';

// ── Plain data shape (used in services, validators, DTOs) ─────────────────────
export interface IMaintenance {
  vehicle:          Types.ObjectId;
  maintenanceType:  MaintenanceType;
  description:      string;
  cost:             number;          // in currency units (e.g. INR)
  status:           MaintenanceStatus;
  startDate:        Date;
  endDate?:         Date;            // optional until maintenance is completed
}

// ── Mongoose Document (extends IMaintenance + Document for model usage) ────────
export interface IMaintenanceDocument extends IMaintenance, Document {
  createdAt: Date;
  updatedAt: Date;
}
