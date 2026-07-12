import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import { connectDB }               from './config/db';
import { errorHandler, notFound }  from './middleware/errorHandler.middleware';
import tripRoutes                  from './routes/trip.routes';

const app: Application = express();

// ── Core Middleware ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'TransitOps API', timestamp: new Date().toISOString() });
});

// ── Route Mounting ─────────────────────────────────────────────────────────────
app.use('/api/trips', tripRoutes);

// Future routes — uncomment as you build them:
// app.use('/api/maintenance', maintenanceRoutes);
// app.use('/api/auth',        authRoutes);
// app.use('/api/vehicles',    vehicleRoutes);
// app.use('/api/drivers',     driverRoutes);

// ── Error Handling (must be last) ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 TransitOps server running on port ${PORT}`);
  });
});

export default app;
