import { sbtmService } from '../services/sbtm.service.js';
import { asyncHandler } from '../utils/error-handler.js';
import { formatSuccess } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';

/**
 * POST /sessoes-sbtm
 * Create a new SBTM session
 */
export const criar = asyncHandler(async (req, res) => {
  const sessaoData = req.validatedBody;
  const userId = req.user?.id;

  logger.info(`Creating SBTM session by user: ${userId}`);

  const sessao = await sbtmService.criar(sessaoData, userId);

  res.status(201).json(
    formatSuccess(sessao, {
      message: 'Sessão SBTM criada com sucesso',
    })
  );
});

/**
 * GET /sessoes-sbtm/:id
 * Get SBTM session by ID
 */
export const obterPorId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  logger.info(`Getting SBTM session: ${id}`);

  const sessao = await sbtmService.obterPorId(id);

  res.status(200).json(formatSuccess(sessao));
});

/**
 * GET /sessoes-sbtm
 * List all SBTM sessions with optional filters
 */
export const listar = asyncHandler(async (req, res) => {
  const filters = req.validatedQuery || {};

  logger.info(`Listing SBTM sessions with filters:`, filters);

  const result = await sbtmService.listar(filters);

  res.status(200).json(
    formatSuccess(result.data, {
      total: result.total,
      limit: result.limit,
      skip: result.skip,
    })
  );
});

/**
 * PUT /sessoes-sbtm/:id
 * Update SBTM session status
 */
export const atualizar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.validatedBody;
  const userId = req.user?.id;

  logger.info(`Updating SBTM session: ${id} by user: ${userId}`);

  const sessao = await sbtmService.atualizar(id, updateData, userId);

  res.status(200).json(
    formatSuccess(sessao, {
      message: 'Sessão SBTM atualizada com sucesso',
    })
  );
});

/**
 * POST /sessoes-sbtm/:id/finalizar
 * Complete SBTM session with findings
 */
export const finalizar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const finalizacaoData = req.validatedBody;
  const userId = req.user?.id;

  logger.info(`Completing SBTM session: ${id} by user: ${userId}`);

  const sessao = await sbtmService.finalizar(id, finalizacaoData, userId);

  res.status(200).json(
    formatSuccess(sessao, {
      message: 'Sessão SBTM finalizada com sucesso',
      achadosRegistrados: sessao.achados?.length || 0,
    })
  );
});

/**
 * DELETE /sessoes-sbtm/:id
 * Delete SBTM session
 */
export const deletar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  logger.info(`Deleting SBTM session: ${id} by user: ${userId}`);

  const result = await sbtmService.deletar(id, userId);

  res.status(200).json(formatSuccess(result));
});

/**
 * GET /sessoes-sbtm/stats/estatisticas
 * Get SBTM sessions statistics
 */
export const obterEstatisticas = asyncHandler(async (req, res) => {
  logger.info('Getting SBTM sessions statistics');

  const stats = await sbtmService.obterEstatisticas();

  res.status(200).json(formatSuccess(stats));
});
