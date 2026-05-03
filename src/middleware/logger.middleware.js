import { logger } from '../utils/logger.js';
import { generateRequestId } from '../utils/helpers.js';

export const requestLogger = (req, res, next) => {
  const requestId = generateRequestId();
  req.id = requestId;

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(
      `[${requestId}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`,
    );
  });

  next();
};
