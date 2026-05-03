import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

import { config } from './config/env.js';
import { logger } from './utils/logger.js';
import { specs } from './config/swagger.js';
import { requestLogger } from './middleware/logger.middleware.js';
import { errorHandler } from './utils/error-handler.js';

// Routes
import healthRoutes from './routes/health.routes.js';

export const createApp = () => {
  const app = express();

  // Middlewares - Parsing e logging
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ limit: '10kb', extended: true }));
  app.use(requestLogger);
  app.use(cors({ origin: config.corsOrigin }));

  // Documentation
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  }));

  // Health check (non-protected)
  app.use(healthRoutes);

  // Catch-all for undefined routes
  app.use((req, res) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.method} ${req.originalUrl} not found`,
        timestamp: new Date().toISOString(),
      },
    });
  });

  // Error handling (deve ser o último middleware)
  app.use(errorHandler);

  return app;
};
