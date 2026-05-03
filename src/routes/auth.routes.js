import { Router } from 'express';
import { login, register, logout, getCurrentUser } from '../controllers/auth.controller.js';
import { createValidator } from '../middleware/validation.middleware.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

const router = Router();

/**
 * POST /auth/login
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *           examples:
 *             valid:
 *               value:
 *                 email: "user@example.com"
 *                 password: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/Usuario'
 *                     token:
 *                       type: string
 *       400:
 *         description: Invalid payload
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', createValidator(loginSchema), login);

/**
 * POST /auth/register
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register new user and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               confirmPassword:
 *                 type: string
 *                 minLength: 6
 *           examples:
 *             valid:
 *               value:
 *                 name: "João Silva"
 *                 email: "joao@example.com"
 *                 password: "password123"
 *                 confirmPassword: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/Usuario'
 *                     token:
 *                       type: string
 *       400:
 *         description: Invalid payload
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
router.post('/register', createValidator(registerSchema), register);

/**
 * POST /auth/logout
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user (symmetry endpoint)
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authMiddleware, logout);

/**
 * GET /auth/me
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user info
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authMiddleware, getCurrentUser);

export default router;
