import { Router } from 'express';
import {
  criar,
  obterPorId,
  listar,
  atualizar,
  deletar,
  obterEstatisticas,
} from '../controllers/charter.controller.js';
import { createValidator, createQueryValidator } from '../middleware/validation.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  createCharterSchema,
  updateCharterSchema,
  searchCharterSchema,
} from '../validators/charter.validator.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * POST /charters
 * @swagger
 * /charters:
 *   post:
 *     summary: Create a new charter
 *     tags: [Charters]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - objetivo
 *               - escopo
 *               - duracao
 *               - heuristicasIds
 *             properties:
 *               titulo:
 *                 type: string
 *               objetivo:
 *                 type: string
 *               escopo:
 *                 type: string
 *               duracao:
 *                 type: number
 *               heuristicasIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               ambienteTestado:
 *                 type: string
 *               versaoApp:
 *                 type: string
 *               observacoes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Charter created successfully
 */
router.post('/', createValidator(createCharterSchema), criar);

/**
 * GET /charters
 * @swagger
 * /charters:
 *   get:
 *     summary: List all charters
 *     tags: [Charters]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [planejado, em-execucao, finalizado, cancelado]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: List of charters
 */
router.get('/', createQueryValidator(searchCharterSchema), listar);

/**
 * GET /charters/stats/estatisticas
 * @swagger
 * /charters/stats/estatisticas:
 *   get:
 *     summary: Get charters statistics
 *     tags: [Charters]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics
 */
router.get('/stats/estatisticas', obterEstatisticas);

/**
 * GET /charters/:id
 * @swagger
 * /charters/{id}:
 *   get:
 *     summary: Get charter by ID
 *     tags: [Charters]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Charter data
 */
router.get('/:id', obterPorId);

/**
 * PUT /charters/:id
 * @swagger
 * /charters/{id}:
 *   put:
 *     summary: Update charter
 *     tags: [Charters]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               objetivo:
 *                 type: string
 *               escopo:
 *                 type: string
 *               duracao:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Charter updated
 */
router.put('/:id', createValidator(updateCharterSchema), atualizar);

/**
 * DELETE /charters/:id
 * @swagger
 * /charters/{id}:
 *   delete:
 *     summary: Delete charter
 *     tags: [Charters]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Charter deleted
 */
router.delete('/:id', deletar);

export default router;
