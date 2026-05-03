import { HTTP_STATUS, ERROR_CODES } from '../config/error-codes.js';
import { logger } from '../utils/logger.js';
import { formatError } from '../utils/helpers.js';

export class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errorCode = ERROR_CODES.INTERNAL_ERROR, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

export const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    statusCode: err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      formatError(err.errorCode, err.message, err.details),
    );
  }

  // Joi validation errors
  if (err.isJoi) {
    const statusCode = err.status === 'OBJECT_REQUIRED' ? HTTP_STATUS.BAD_REQUEST : HTTP_STATUS.UNPROCESSABLE_ENTITY;
    const message = err.details.map((d) => d.message).join('; ');
    return res.status(statusCode).json(
      formatError(ERROR_CODES.VALIDATION_ERROR, message),
    );
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      formatError(ERROR_CODES.INVALID_TOKEN, 'Invalid token'),
    );
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      formatError(ERROR_CODES.TOKEN_EXPIRED, 'Token has expired'),
    );
  }

  // Default error
  res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
    formatError(
      ERROR_CODES.INTERNAL_ERROR,
      err.message || 'Internal server error',
    ),
  );
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
