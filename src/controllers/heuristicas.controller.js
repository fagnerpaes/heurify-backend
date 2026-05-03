import { heuristicasService } from '../services/heuristicas.service.js';
import { asyncHandler } from '../utils/error-handler.js';
import { formatSuccess } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';

/**
 * POST /heuristicas
 * Create a new heuristica
 * @async
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns {Object} Created heuristica
 */
export const criar = asyncHandler(async (req, res) => {
  const heuristicaData = req.validatedBody;
  const userId = req.user?.id;

  logger.info(`Creating heuristica by user: ${userId}`);

  const heuristica = await heuristicasService.criar(heuristicaData, userId);

  res.status(201).json(
    formatSuccess(heuristica, {
      message: 'Heurística criada com sucesso',
    })
  );
});

/**
 * GET /heuristicas/:id
 * Get heuristica by ID
 * @async
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns {Object} Heuristica data
 */
export const obterPorId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  logger.info(`Getting heuristica: ${id}`);

  const heuristica = await heuristicasService.obterPorId(id);

  res.status(200).json(formatSuccess(heuristica));
});

/**
 * GET /heuristicas
 * List all heuristicas with optional filters
 * @async
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns {Object} Array of heuristicas with pagination
 */
export const listar = asyncHandler(async (req, res) => {
  const filters = req.validatedQuery || {};
  const result = await heuristicasService.listar(filters);

  res.status(200).json(
    formatSuccess(result.data, {
      total: result.total,
      limit: result.limit,
      skip: result.skip,
    })
  );
});

/**
 * PUT /heuristicas/:id
 * Update heuristica
 * @async
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns {Object} Updated heuristica
 */
export const atualizar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.validatedBody;
  const userId = req.user?.id;

  logger.info(`Updating heuristica: ${id} by user: ${userId}`);

  const heuristica = await heuristicasService.atualizar(id, updateData, userId);

  res.status(200).json(
    formatSuccess(heuristica, {
      message: 'Heurística atualizada com sucesso',
    })
  );
});

/**
 * DELETE /heuristicas/:id
 * Delete heuristica
 * @async
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns {Object} Deletion confirmation
 */
export const deletar = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  logger.info(`Deleting heuristica: ${id} by user: ${userId}`);

  const result = await heuristicasService.deletar(id, userId);

  res.status(200).json(formatSuccess(result));
});

/**
 * GET /heuristicas/busca/termo
 * Search heuristicas
 * @async
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns {Object} Array of matching heuristicas
 */
export const buscar = asyncHandler(async (req, res) => {
  const { termo } = req.params;
  const filters = req.validatedQuery || {};

  const result = await heuristicasService.buscar(termo, filters);

  res.status(200).json(
    formatSuccess(result.data, {
      searchTerm: termo,
      total: result.total,
    })
  );
});

/**
 * GET /heuristicas/stats/estatisticas
 * Get heuristicas statistics
 * @async
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns {Object} Statistics
 */
export const obterEstatisticas = asyncHandler(async (req, res) => {
  logger.info('Getting heuristicas statistics');

  const stats = await heuristicasService.obterEstatisticas();

  res.status(200).json(formatSuccess(stats));
});
