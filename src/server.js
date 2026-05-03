import { createApp } from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { seedDatabase } from './models/seed.js';

const app = createApp();

// Inicia o servidor apenas UMA vez
const server = app.listen(config.port, () => {
  logger.info(`
    ╔═══════════════════════════════════════╗
    ║     🎯 HEURIFY BACKEND API 🎯        ║
    ║                                       ║
    ║  Server running on port ${config.port}       ║
    ║  Environment: ${config.nodeEnv}           ║
    ║  Swagger: http://localhost:${config.port}/docs   ║
    ╚═══════════════════════════════════════╝
  `);

  // Executa o seed apenas se NÃO for ambiente de produção
  if (config.nodeEnv !== 'production') {
    try {
      seedDatabase();
    } catch (error) {
      logger.error('Falha ao executar o Seed do banco:', error);
    }
  }
});

// --- Manutenção dos Handlers de Graceful Shutdown ---
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default server;