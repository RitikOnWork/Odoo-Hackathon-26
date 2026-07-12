/**
 * types/driver.types.ts
 * TypeScript interfaces for the Driver domain.
 */

import { Document } from 'mongoose';
import { DriverStatus } from '../constants/enums';

export interface IDriver {
  name:              string;
  phone:             string;
  email:             string;
  licenseNumber:     string;
  licenseExpiry:     Date;     // used to check expiry before trip creation
  status:            DriverStatus;
}

export interface IDriverDocument extends IDriver, Document {
  createdAt: Date;
  updatedAt: Date;
}
