import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import * as path from 'path';
import * as fs from 'fs';
import { env } from './config/env.config';
import { requestLogger } from './middleware/requestLogger.middleware';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import { apiRouter } from './routes/api.router';

export function createApp(): Application {
  const app = express();

  // Security Middleware
  app.use(helmet());

  // Rate Limiting — global
  app.use(
    rateLimit({
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX_REQUESTS,
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: 'Too many requests, please try again later.' },
    })
  );

  // Rate Limiting — strict on auth routes (10 req/min)
  const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { success: false, message: 'Too many login attempts, please wait a minute.' },
  });

  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // Body Parsing Middleware — 25mb to support base64 bill image uploads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Serve uploaded bill images
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  app.use('/uploads', express.static(uploadsDir));

  // Request Logging
  app.use(requestLogger);

  // Base API v1 Routes
  app.use('/api/v1/auth', authLimiter);
  app.use('/api/v1', apiRouter);

  // 404 Route Catch-All
  app.use(notFoundHandler);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
