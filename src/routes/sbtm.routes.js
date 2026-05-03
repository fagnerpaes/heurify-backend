import { Router } from 'express';
import {
  criar,
  obterPorId,
  listar,
  atualizar,
  finalizar,
  deletar,
  obterEstatisticas,
} from '../controllers/sbtm.controller.js';
import { createValidator, createQueryValidator } from '../middleware/validation.middleware.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  createSessaoSbtmSchema,
  updateSessaoSbtmSchema,
  completarSessaoSbtmSchema,
  searchSessaoSbtmSchema,
} from '../validators/sbtm.validator.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * POST /sessoes-sbtm
 * @swagger
 * /sessoes-sbtm:
 *   post:
 *     summary: Create a new SBTM session
 *     tags: [SBTM Sessions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - charterId
 *               - testador
 *               - dataInicio
 *             properties:
 *               nome:
 *                 type: string
 *               charterId:
 *                 type: string
 *               testador:
 *                 type: string
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *               observacoesInicio:
 *                 type: string
 *     responses:
 *       201:
 *         description: SBTM session created successfully
 */
router.post('/', createValidator(createSessaoSbtmSchema), criar);

/**
 * GET /sessoes-sbtm
 * @swagger
 * /sessoes-sbtm:
 *   get:
 *     summary: List all SBTM sessions
 *     tags: [SBTM Sessions]
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
 *           enum: [em-progresso, pausada, finalizada]
 *       - in: query
 *         name: charterId
 *         schema:
 *           type: string
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
 *         description: List of SBTM sessions
 */
router.get('/', createQueryValidator(searchSessaoSbtmSchema), listar);

/**
 * GET /sessoes-sbtm/stats/estatisticas
 * @swagger
 * /sessoes-sbtm/stats/estatisticas:
 *   get:
 *     summary: Get SBTM sessions statistics
 *     tags: [SBTM Sessions]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics
 */
router.get('/stats/estatisticas', obterEstatisticas);

/**
 * GET /sessoes-sbtm/:id
 * @swagger
 * /sessoes-sbtm/{id}:
 *   get:
 *     summary: Get SBTM session by ID
 *     tags: [SBTM Sessions]
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
 *         description: SBTM session data
 */
router.get('/:id', obterPorId);

/**
 * PUT /sessoes-sbtm/:id
 * @swagger
 * /sessoes-sbtm/{id}:
 *   put:
 *     summary: Update SBTM session status
 *     tags: [SBTM Sessions]
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
 *               status:
 *                 type: string
 *                 enum: [em-progresso, pausada, finalizada]
 *               observacoes:
 *                 type: string
 *     responses:
 *       200:
 *         description: SBTM session updated
 */
router.put('/:id', createValidator(updateSessaoSbtmSchema), atualizar);

/**
 * POST /sessoes-sbtm/:id/finalizar
 * @swagger
 * /sessoes-sbtm/{id}/finalizar:
 *   post:
 *     summary: Complete SBTM session with findings
 *     tags: [SBTM Sessions]
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
 *             required:
 *               - dataFim
 *             properties:
 *               achados:
 *                 type: array
 *                 items:
 *                   type: object
 *               observacoesFinais:
 *                 type: string
 *               dataFim:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: SBTM session completed
 */
router.post('/:id/finalizar', createValidator(completarSessaoSbtmSchema), finalizar);

/**
 * DELETE /sessoes-sbtm/:id
 * @swagger
 * /sessoes-sbtm/{id}:
 *   delete:
 *     summary: Delete SBTM session
 *     tags: [SBTM Sessions]
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
 *         description: SBTM session deleted
 */
router.delete('/:id', deletar);

export default router;
