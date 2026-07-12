/**
 * config/db.ts
 *
 * Mongoose connection helper.
 * Call connectDB() once at startup (in server.ts).
 *
 * Design:
 *  - Uses MONGO_URI from environment variables.
 *  - Logs connection state clearly.
 *  - On failure the process exits so the container/pm2 can restart it.
 */

import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('❌  MONGO_URI is not set in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(`✅  MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌  MongoDB connection failed:', error);
    process.exit(1);
  }
}
