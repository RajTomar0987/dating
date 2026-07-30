import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import healthRoute from './routes/health.js';
import authRoute from './routes/auth.js';
import profilesRoute from './routes/profiles.js';
import likesRoute from './routes/likes.js';
import chatsRoute from './routes/chats.js';
import reportsRoute from './routes/reports.js';
import wingmanRoute from './routes/wingman.js';
import subscriptionsRoute from './routes/subscriptions.js';
import plannerRoute from './routes/planner.js';
import { authenticateJWT } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Logging Middlewares
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('combined'));
app.use(express.json());

// Rate Limiter: max 100 requests per minute per IP (supporting 100 concurrent MVP users)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded. Please slow down requests.' }
});

app.use('/api', apiLimiter);

// Public Routes
app.use('/api', healthRoute);
app.use('/api/auth', authRoute);

// JWT Protected Routes
app.use('/api/profiles', authenticateJWT, profilesRoute);
app.use('/api/likes', authenticateJWT, likesRoute);
app.use('/api/chats', authenticateJWT, chatsRoute);
app.use('/api/reports', authenticateJWT, reportsRoute);
app.use('/api/wingman', authenticateJWT, wingmanRoute);
app.use('/api/subscriptions', authenticateJWT, subscriptionsRoute);
app.use('/api/planner', authenticateJWT, plannerRoute);

// Global 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Global Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message || 'An unknown error occurred' });
});

app.listen(PORT, () => {
  console.log(`⚡ AuraAI Express REST API running on port ${PORT}`);
  console.log(`🩺 Health check available at http://localhost:${PORT}/api/health`);
});
