import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { router as api } from './routes.js';
import { initDb } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.ORIGIN || '*';

// Middlewares
app.use(helmet());
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  max: Number(process.env.RATE_LIMIT_MAX || 60),
});
app.use(limiter);

app.get('/api/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use('/api', api);

// Start
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`[backend] listening on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to init DB', err);
  process.exit(1);
});
