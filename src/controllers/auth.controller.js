import { authService } from '../services/auth.service.js';
import { asyncHandler } from '../utils/error-handler.js';
import { formatSuccess } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';

/**
 * POST /auth/login
 * Login user and return JWT token
 * @async
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns {Object} User and JWT token
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  logger.info(`Login attempt for email: ${email}`);

  const result = await authService.login(email, password);

  res.status(200).json(
    formatSuccess(result, {
      message: 'Login realizado com sucesso',
      timestamp: new Date().toISOString(),
    })
  );
});

/**
 * POST /auth/register
 * Register new user and return JWT token
 * @async
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns {Object} New user and JWT token
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  logger.info(`Registration attempt for email: ${email}`);

  const result = await authService.register(name, email, password);

  res.status(201).json(
    formatSuccess(result, {
      message: 'Usuário registrado com sucesso',
      timestamp: new Date().toISOString(),
    })
  );
});

/**
 * POST /auth/logout
 * Logout user (for symmetry, MVP just returns success)
 * @async
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns {Object} Success message
 */
export const logout = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  logger.info(`Logout attempt for user: ${userId}`);

  const result = await authService.logout(userId);

  res.status(200).json(formatSuccess(result));
});

/**
 * GET /auth/me
 * Get current user info from token
 * @async
 * @param {Object} req - Express request (requires auth middleware)
 * @param {Object} res - Express response
 * @returns {Object} Current user info
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  logger.info(`Get current user: ${user?.id}`);

  res.status(200).json(
    formatSuccess({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    })
  );
});
