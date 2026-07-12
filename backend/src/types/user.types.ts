/**
 * types/user.types.ts
 * TypeScript interfaces for the User (auth/account) domain.
 */

import { Document } from 'mongoose';
import { UserRole } from '../constants/enums';

// ── Plain data shape (used in services, validators, DTOs) ─────────────────────
export interface IUser {
  name:      string;
  email:     string;
  password:  string;          // hashed — never returned in API responses
  role:      UserRole;
  isActive:  boolean;
}

// ── Mongoose Document (extends IUser + Document for model usage) ───────────────
export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}
