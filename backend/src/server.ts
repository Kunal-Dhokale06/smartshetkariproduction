import { createApp } from './app';
import { env } from './config/env.config';
import { logger } from './utils/logger';
import { connectDatabase, disconnectDatabase } from './services/prisma.service';

async function startServer() {
  const app = createApp();

  // Attempt database connection on startup
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 SmartShetkari backend server running on http://localhost:${env.PORT}`);
    logger.info(`📋 Health check available at: http://localhost:${env.PORT}/api/v1/health`);
    logger.info(`🌍 Environment: ${env.NODE_ENV}`);
  });

  // Graceful Shutdown Handlers
  const handleShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      logger.info('HTTP server closed.');
      process.exit(0);
    });

    // Force shutdown if taking longer than 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer().catch((err) => {
  logger.error('Fatal error starting server:', err);
  process.exit(1);
});
