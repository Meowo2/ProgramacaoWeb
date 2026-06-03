import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/authRoutes';
import continenteRoutes from './routes/continenteRoutes';
import paisRoutes from './routes/paisRoutes';
import cidadeRoutes from './routes/cidadeRoutes';
import { errorHandler } from './middleware/errorHandler';

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/continentes', continenteRoutes);
app.use('/api/paises', paisRoutes);
app.use('/api/cidades', cidadeRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Mundo API is running' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
