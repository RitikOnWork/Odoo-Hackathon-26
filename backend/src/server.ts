import express, { Application } from 'express';
import cors    from 'cors';
import dotenv  from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

import { connectDB }               from './config/db';
import { errorHandler, notFound }  from './middleware/errorHandler.middleware';
import tripRoutes                  from './routes/trip.routes';
import maintenanceRoutes           from './routes/maintenance.routes';
import authRoutes                  from './routes/auth.routes';

const app: Application = express();

// ── Core Middleware ────────────────────────────────────────────────────────────

// CORS: restrict to a configured origin in production; allow all in development.
// Set CORS_ORIGIN in your .env file (e.g. http://localhost:5173).
const corsOrigin = process.env.CORS_ORIGIN ?? '*';
app.use(cors({ origin: corsOrigin }));

// Limit JSON payload size to prevent DoS via oversized request bodies.
// Trip and maintenance payloads are small — 10kb is generous.
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Health Check ───────────────────────────────────────────────────────────────
// Reports both application liveness and MongoDB connection state.
// A load balancer or Kubernetes probe should check db.status === 'connected'.
app.get('/api/health', (_req, res) => {
  const dbStateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbStatus = dbStateMap[mongoose.connection.readyState] ?? 'unknown';

  res.status(dbStatus === 'connected' ? 200 : 503).json({
    status:    dbStatus === 'connected' ? 'ok' : 'degraded',
    service:   'TransitOps API',
    timestamp: new Date().toISOString(),
    db: {
      status: dbStatus,
      host:   mongoose.connection.host ?? null,
    },
  });
});

// ── Route Mounting ─────────────────────────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/trips',       tripRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// Future routes — uncomment as you build them:
// app.use('/api/vehicles', vehicleRoutes);
// app.use('/api/drivers',  driverRoutes);

// ── Error Handling (must be last) ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 5000;

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 TransitOps server running on port ${PORT}`);
      console.log(`🔒 CORS origin: ${corsOrigin}`);
    });
  });
}

export default app;
