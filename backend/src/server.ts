import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// ── Core Middleware ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'TransitOps API', timestamp: new Date().toISOString() });
});

// ── Route Mounting (add as you build each domain) ─────────────────────────────
// app.use('/api/v1/auth',     authRoutes);
// app.use('/api/v1/vehicles', vehicleRoutes);
// app.use('/api/v1/drivers',  driverRoutes);
// app.use('/api/v1/routes',   routeRoutes);
// app.use('/api/v1/trips',    tripRoutes);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`🚀 TransitOps server running on port ${PORT}`);
});

export default app;
