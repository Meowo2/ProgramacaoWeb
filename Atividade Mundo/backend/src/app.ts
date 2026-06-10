import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';
import continentRoutes from './routes/continentRoutes';
import countryRoutes from './routes/countryRoutes';
import cityRoutes from './routes/cityRoutes';
import externalApiRoutes from './routes/externalApiRoutes';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();

// ── Middlewares globais ───────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ── Rotas ─────────────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/continentes', continentRoutes);
app.use('/paises', countryRoutes);
app.use('/cidades', cityRoutes);
app.use('/api-externas', externalApiRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

// ── Error handler (deve ser o último) ────────────────────────────────────────
app.use(errorHandler);

export default app;
