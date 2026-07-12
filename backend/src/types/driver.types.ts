/**
 * types/driver.types.ts
 * TypeScript interfaces for the Driver (fleet driver profile) domain.
 */

import { Document } from 'mongoose';
import { DriverStatus } from '../constants/enums';

// ── Plain data shape (used in services, validators, DTOs) ─────────────────────
export interface IDriver {
  name:              string;
  licenseNumber:     string;          // unique
  licenseCategory:   string;          // e.g. LMV, HMV
  licenseExpiryDate: Date;
  contactNumber:     string;
  safetyScore:       number;          // 0-100
  status:            DriverStatus;
}

// ── Mongoose Document (extends IDriver + Document for model usage) ─────────────
export interface IDriverDocument extends IDriver, Document {
  createdAt: Date;
  updatedAt: Date;
}
