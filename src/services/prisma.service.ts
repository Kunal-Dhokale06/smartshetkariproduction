import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { env } from '../config/env.config';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('🐘 Connected to Neon PostgreSQL database successfully via Prisma.');
  } catch (error: any) {
    logger.warn('⚠️ Database connection deferred or unreachable: ' + (error?.message || error));
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info('🔌 Disconnected Prisma from PostgreSQL.');
  } catch (error: any) {
    logger.error('Error disconnecting database:', error?.message);
  }
}
