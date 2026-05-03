import { Router } from 'express';
import {
  criar,
  obterPorId,
  listar,
  atualizar,
  deletar,
  buscar,
  obterEstatisticas,
} from '../controllers/heuristicas.controller.js';
import { createValidator, createQueryValidator } from '../middleware/validation.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  createHeuristicaSchema,
  updateHeuristicaSchema,
  searchHeuristicaSchema,
} from '../validators/heuristicas.validator.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * POST /heuristicas
 * @swagger
 * /heuristicas:
 *   post:
 *     summary: Create a new heuristica
 *     tags: [Heuristicas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - technique
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 200
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 2000
 *               technique:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *               applicationScenario:
 *                 type: string
 *               examples:
 *                 type: array
 *                 items:
 *                   type: string
 *               riskNotes:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Heuristica created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  createValidator(createHeuristicaSchema),
  criar
);

/**
 * GET /heuristicas
 * @swagger
 * /heuristicas:
 *   get:
 *     summary: List all heuristicas with optional filters
 *     tags: [Heuristicas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term (title, description, tags)
 *       - in: query
 *         name: technique
 *         schema:
 *           type: string
 *         description: Filter by technique
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, reviewed, approved, archived]
 *         description: Filter by status
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter by tags
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Items per page
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Items to skip (pagination)
 *     responses:
 *       200:
 *         description: List of heuristicas
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/',
  createQueryValidator(searchHeuristicaSchema),
  listar
);

/**
 * GET /heuristicas/busca/:termo
 * @swagger
 * /heuristicas/busca/{termo}:
 *   get:
 *     summary: Search heuristicas by term
 *     tags: [Heuristicas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: termo
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Search results
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/busca/:termo',
  createQueryValidator(searchHeuristicaSchema),
  buscar
);

/**
 * GET /heuristicas/stats/estatisticas
 * @swagger
 * /heuristicas/stats/estatisticas:
 *   get:
 *     summary: Get heuristicas statistics
 *     tags: [Heuristicas]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics
 *       401:
 *         description: Unauthorized
 */
router.get('/stats/estatisticas', obterEstatisticas);

/**
 * GET /heuristicas/:id
 * @swagger
 * /heuristicas/{id}:
 *   get:
 *     summary: Get heuristica by ID
 *     tags: [Heuristicas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Heuristica ID
 *     responses:
 *       200:
 *         description: Heuristica data
 *       404:
 *         description: Heuristica not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', obterPorId);

/**
 * PUT /heuristicas/:id
 * @swagger
 * /heuristicas/{id}:
 *   put:
 *     summary: Update heuristica
 *     tags: [Heuristicas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Heuristica ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               technique:
 *                 type: string
 *               applicationScenario:
 *                 type: string
 *               examples:
 *                 type: array
 *               riskNotes:
 *                 type: string
 *               tags:
 *                 type: array
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Heuristica updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Heuristica not found
 *       401:
 *         description: Unauthorized
 */
router.put(
  '/:id',
  createValidator(updateHeuristicaSchema),
  atualizar
);

/**
 * DELETE /heuristicas/:id
 * @swagger
 * /heuristicas/{id}:
 *   delete:
 *     summary: Delete heuristica
 *     tags: [Heuristicas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Heuristica ID
 *     responses:
 *       200:
 *         description: Heuristica deleted
 *       404:
 *         description: Heuristica not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', deletar);

export default router;
