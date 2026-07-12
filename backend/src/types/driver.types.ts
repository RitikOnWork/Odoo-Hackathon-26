/**
 * types/driver.types.ts
<<<<<<< HEAD
 * TypeScript interfaces for the Driver (fleet driver profile) domain.
=======
 * TypeScript interfaces for the Driver domain.
>>>>>>> 5e3340f331afcc3c13731876201c79dc18f61cda
 */

import { Document } from 'mongoose';
import { DriverStatus } from '../constants/enums';

<<<<<<< HEAD
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
=======
export interface IDriver {
  name:              string;
  phone:             string;
  email:             string;
  licenseNumber:     string;
  licenseExpiry:     Date;     // used to check expiry before trip creation
  status:            DriverStatus;
}

>>>>>>> 5e3340f331afcc3c13731876201c79dc18f61cda
export interface IDriverDocument extends IDriver, Document {
  createdAt: Date;
  updatedAt: Date;
}
