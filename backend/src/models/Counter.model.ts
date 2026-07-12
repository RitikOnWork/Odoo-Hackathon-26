/**
 * models/Counter.model.ts
 *
 * A generic auto-increment counter collection.
 * Used by Trip.model.ts (and any future models) to generate
 * sequential, human-readable IDs (e.g. TRIP-000001).
 *
 * Collection: counters
 * Document shape: { _id: "tripNumber", seq: 42 }
 */

import { Schema, model } from 'mongoose';

// We intentionally keep _id as string, so we bypass Document's ObjectId
// constraint by using `any` on the model — this is the standard Mongoose
// pattern for string-keyed counter documents.
const CounterSchema = new Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { _id: false } // prevent Mongoose from auto-adding an ObjectId _id
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Counter = model<any>('Counter', CounterSchema);

export default Counter;
