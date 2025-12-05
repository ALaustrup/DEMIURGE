import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import abyssidRoutes from './routes/abyssid.js';
import drc369Routes from './routes/drc369.js';
import runtimeRoutes from './routes/runtime.js';
import computeMarketRoutes from './routes/computeMarket.js';
import miningRoutes from './routes/mining.js';
import { getDb } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8082;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://demiurge.cloud';

// Middleware
app.use(cors({
  origin: [CORS_ORIGIN, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/healthz', (req, res) => {
  try {
    // Quick DB check
    const db = getDb();
    db.prepare('SELECT 1').get();
    res.json({ status: 'ok', service: 'abyssid-service' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// API routes
app.use('/api/abyssid', abyssidRoutes);
app.use('/api/drc369', drc369Routes);
app.use('/api/runtime', runtimeRoutes);
app.use('/api/compute-market', computeMarketRoutes);
app.use('/api/mining', miningRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
});

// Start server
app.listen(PORT, () => {
  console.log(`AbyssID Service running on port ${PORT}`);
  console.log(`CORS origin: ${CORS_ORIGIN}`);
  console.log(`Database initialized`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

