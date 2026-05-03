import { charterService } from '../services/charter.service.js';
import { asyncHandler } from '../utils/error-handler.js';
import { formatSuccess } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';

/**
 * POST /charters
 * Create a new charter
 */
export const criar = asyncHandler(async (req, res) => {
  const charterData = req.validatedBody;
  const userId = req.user?.id;

  logger.info(`Creating charter by user: ${userId}`);

  const charter = await charterService.criar(charterData, userId);

  res.status(201).json(
    formatSuccess(charter, {
      message: 'Charter criado com sucesso',
    })
  );
});

/**
 * GET /charters/:id
 * Get charter by ID
 */
export const obterPorId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  logger.info(`Getting charter: ${id}`);

  const charter = await charterService.obterPorId(id);

  res.status(200).json(formatSuccess(charter));
});

/**
 * GET /charters
 * List all charters with optional filters
 */
export const listar = asyncHandler(async (req, res) => {
  const filters = req.validatedQuery || {};

  logger.info(`Listing charters with filters:`, filters);

  const result = await charterService.listar(filters);

  res.status(200).json(
   formatSuccess(result.data, {
     total: result.total,
     limit: result.limit,
     skip: result.skip,
   })
  );

});

/**
 * PUT /charters/:id
 * Update charter
 */
export const atualizar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.validatedBody;
  const userId = req.user?.id;

  logger.info(`Updating charter: ${id} by user: ${userId}`);

  const charter = await charterService.atualizar(id, updateData, userId);

  res.status(200).json(
    formatSuccess(charter, {
      message: 'Charter atualizado com sucesso',
    })
  );
});

/**
 * DELETE /charters/:id
 * Delete charter
 */
export const deletar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  logger.info(`Deleting charter: ${id} by user: ${userId}`);

  const result = await charterService.deletar(id, userId);

  res.status(200).json(formatSuccess(result));
});

/**
 * GET /charters/stats/estatisticas
 * Get charters statistics
 */
export const obterEstatisticas = asyncHandler(async (req, res) => {
  logger.info('Getting charters statistics');

  const stats = await charterService.obterEstatisticas();

  res.status(200).json(formatSuccess(stats));
});
