/**
 * models/User.model.ts
 *
 * Mongoose schema and compiled Model for the User collection.
 *
 * Key design decisions:
 *  - Role is a plain enum field (UserRole) rather than a separate Role
 *    collection — RBAC only needs to gate on a fixed, small set of roles,
 *    so a normalized Roles table would add complexity without benefit.
 *  - Password is hashed with bcrypt in a pre-save hook — plaintext never
 *    touches the database or leaves this file.
 *  - comparePassword() is used by the auth service during login instead of
 *    re-implementing bcrypt.compare() at every call site.
 */

import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUserDocument } from '../types/user.types';
import { UserRole } from '../constants/enums';

// ── Schema Definition ─────────────────────────────────────────────────────────
const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type:     String,
      required: [true, 'Name is required'],
      trim:     true,
    },

    email: {
      type:     String,
      required: [true, 'Email is required'],
      unique:   true,
      lowercase: true,
      trim:     true,
      index:    true,
    },

    password: {
      type:     String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select:   false,          // never returned by default on find/findOne
    },

    role: {
      type:     String,
      enum:     Object.values(UserRole),
      required: [true, 'Role is required'],
    },

    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  {
    timestamps: true,              // adds createdAt & updatedAt automatically
    versionKey: false,             // removes __v field
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

// ── Pre-save Hook: Hash password on create/change ─────────────────────────────
UserSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// ── Instance Method: comparePassword ──────────────────────────────────────────
UserSchema.methods.comparePassword = function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

// ── Compiled Model ────────────────────────────────────────────────────────────
const User = model<IUserDocument>('User', UserSchema);

export default User;
