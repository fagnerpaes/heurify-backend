import { verifyToken } from '../utils/jwt.utils.js';
import { HTTP_STATUS, ERROR_CODES } from '../config/error-codes.js';
import { formatError } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      logger.warn(`[${req.id}] Missing authorization header`);
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatError(
          ERROR_CODES.UNAUTHORIZED,
          'Authorization header missing',
        ),
      );
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      logger.warn(`[${req.id}] Invalid authorization header format`);
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatError(ERROR_CODES.UNAUTHORIZED, 'Invalid authorization format'),
      );
    }

    const token = parts[1];
    const decoded = verifyToken(token);

    req.user = decoded;
    req.token = token;

    next();
  } catch (error) {
    logger.warn(`[${req.id}] Token verification failed: ${error.message}`);

    if (error.message.includes('expired')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatError(ERROR_CODES.TOKEN_EXPIRED, 'Token has expired'),
      );
    }

    res.status(HTTP_STATUS.UNAUTHORIZED).json(
      formatError(ERROR_CODES.INVALID_TOKEN, 'Invalid token'),
    );
  }
};

export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }

    const token = parts[1];
    const decoded = verifyToken(token);

    req.user = decoded;
    req.token = token;

    next();
  } catch (error) {
    logger.debug(`[${req.id}] Optional auth failed, continuing: ${error.message}`);
    next();
  }
};

export const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatError(ERROR_CODES.UNAUTHORIZED, 'User not authenticated'),
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`[${req.id}] User ${req.user.id} with role ${req.user.role} attempted access to restricted resource`);
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        formatError(ERROR_CODES.FORBIDDEN, 'Insufficient permissions'),
      );
    }

    next();
  };
};
