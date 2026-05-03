import { generateToken, verifyToken } from '../utils/jwt.utils.js';
import { store } from '../models/in-memory.store.js';
import { AppError } from '../utils/error-handler.js';
import { ERROR_CODES, HTTP_STATUS } from '../config/error-codes.js';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

/**
 * AuthService - Handles authentication logic
 * @class
 */
export class AuthService {
  /**
   * Login user and return JWT token
   * @async
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} { user, token }
   * @throws {AppError} If credentials are invalid
   */
  async login(email, password) {
    try {
      // Find user by email
      const usuario = store.obterUsuarioPorEmail(email);

      if (!usuario) {
        logger.warn(`Login failed: User not found - ${email}`);
        throw new AppError(
          'Credenciais inválidas',
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_CODES.INVALID_CREDENTIALS
        );
      }

      // Validate password (for MVP, simple comparison - production should use bcrypt)
      if (usuario.password !== password) {
        logger.warn(`Login failed: Invalid password - ${email}`);
        throw new AppError(
          'Credenciais inválidas',
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_CODES.INVALID_CREDENTIALS
        );
      }

      // Generate JWT token
      const token = generateToken({
        id: usuario.id,
        email: usuario.email,
        role: usuario.role,
      });

      logger.info(`User logged in successfully: ${email}`);

      return {
        user: {
          id: usuario.id,
          name: usuario.name,
          email: usuario.email,
          role: usuario.role,
        },
        token,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Login error: ${error.message}`);
      throw new AppError(
        'Erro ao realizar login',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_CODES.INTERNAL_ERROR
      );
    }
  }

  /**
   * Register new user
   * @async
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} { user, token }
   * @throws {AppError} If email already exists
   */
  async register(name, email, password) {
    try {
      // Check if user already exists
      const usuarioExistente = store.obterUsuarioPorEmail(email);

      if (usuarioExistente) {
        logger.warn(`Registration failed: Email already exists - ${email}`);
        throw new AppError(
          'Email já cadastrado',
          HTTP_STATUS.CONFLICT,
          ERROR_CODES.CONFLICT,
          { field: 'email' }
        );
      }

      // Create new user
      const novoUsuario = {
        id: uuidv4(),
        name,
        email,
        password, // In production, should be hashed with bcrypt
        role: 'editor', // Default role
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save user to store
      store.salvarUsuario(novoUsuario);

      // Generate JWT token
      const token = generateToken({
        id: novoUsuario.id,
        email: novoUsuario.email,
        role: novoUsuario.role,
      });

      logger.info(`User registered successfully: ${email}`);

      return {
        user: {
          id: novoUsuario.id,
          name: novoUsuario.name,
          email: novoUsuario.email,
          role: novoUsuario.role,
        },
        token,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Registration error: ${error.message}`);
      throw new AppError(
        'Erro ao registrar usuário',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_CODES.INTERNAL_ERROR
      );
    }
  }

  /**
   * Verify token validity
   * @async
   * @param {string} token - JWT token
   * @returns {Object} Token payload
   * @throws {AppError} If token is invalid or expired
   */
  async verifyToken(token) {
    try {
      const payload = verifyToken(token);
      return payload;
    } catch (error) {
      logger.warn(`Token verification failed: ${error.message}`);
      throw new AppError(
        'Token inválido ou expirado',
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_CODES.UNAUTHORIZED
      );
    }
  }

  /**
   * Logout user (in MVP, just returns success)
   * @async
   * @param {string} userId - User ID
   * @returns {Object} Success message
   */
  async logout(userId) {
    logger.info(`User logged out: ${userId}`);
    return { message: 'Logout realizado com sucesso' };
  }
}

export const authService = new AuthService();
