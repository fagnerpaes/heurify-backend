import { store } from '../models/in-memory.store.js';
import { AppError } from '../utils/error-handler.js';
import { ERROR_CODES, HTTP_STATUS } from '../config/error-codes.js';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

/**
 * HeuristicasService - Handles heuristics CRUD operations
 * @class
 */
export class HeuristicasService {
  /**
   * Create a new heuristica
   * @async
   * @param {Object} heuristicaData - Heuristica data
   * @param {string} userId - User ID creating the heuristica
   * @returns {Object} Created heuristica
   * @throws {AppError}
   */
  async criar(heuristicaData, userId) {
    try {
      const novaHeuristica = {
        id: uuidv4(),
        ...heuristicaData,
        status: heuristicaData.status || 'draft',
        criadoPor: userId,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        // Metadados para curadoria futura
        statusEditorial: 'draft',
        curadorId: null,
        notasCurador: '',
        versao: 1,
      };

      store.salvarHeuristica(novaHeuristica);

      logger.info(`Heuristica created: ${novaHeuristica.id} by user ${userId}`);

      return novaHeuristica;
    } catch (error) {
      logger.error(`Error creating heuristica: ${error.message}`);
      throw new AppError(
        'Erro ao criar heurística',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_CODES.INTERNAL_ERROR
      );
    }
  }

  /**
   * Get heuristica by ID
   * @async
   * @param {string} id - Heuristica ID
   * @returns {Object} Heuristica data
   * @throws {AppError}
   */
  async obterPorId(id) {
    try {
      const heuristica = store.obterHeuristicaPorId(id);

      if (!heuristica) {
        logger.warn(`Heuristica not found: ${id}`);
        throw new AppError(
          'Heurística não encontrada',
          HTTP_STATUS.NOT_FOUND,
          ERROR_CODES.NOT_FOUND
        );
      }

      return heuristica;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error getting heuristica: ${error.message}`);
      throw new AppError(
        'Erro ao buscar heurística',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_CODES.INTERNAL_ERROR
      );
    }
  }

  /**
   * List all heuristicas with optional filters
   * @async
   * @param {Object} filters - Filter options { search, technique, status, tags, limit, skip }
   * @returns {Object} { data: [], total, limit, skip }
   * @throws {AppError}
   */
  async listar(filters = {}) {
    try {
        const { limit = 20, skip = 0, ...searchFilters } = filters;

        // O store retorna um Array direto
        const items = store.listarHeuristicas({ ...searchFilters, limit, skip });

        // Precisamos contar o total sem paginação para o meta (opcional, mas bom para o teste)
        const totalItems = store.listarHeuristicas(searchFilters).length;

        const result = {
        data: items,
        total: totalItems,
        limit: parseInt(limit),
        skip: parseInt(skip)
        };

        logger.info(`Heuristicas listed: ${result.data.length} items`);
        return result;
    } catch (error) {
        logger.error(`Error listing heuristicas: ${error.message}`);
        throw new AppError('Erro ao listar heurísticas', 500);
    }
  }

  /**
   * Update heuristica
   * @async
   * @param {string} id - Heuristica ID
   * @param {Object} updateData - Data to update
   * @param {string} userId - User ID making the update
   * @returns {Object} Updated heuristica
   * @throws {AppError}
   */
  async atualizar(id, updateData, userId) {
    try {
      const heuristica = store.obterHeuristicaPorId(id);

      if (!heuristica) {
        logger.warn(`Heuristica not found for update: ${id}`);
        throw new AppError(
          'Heurística não encontrada',
          HTTP_STATUS.NOT_FOUND,
          ERROR_CODES.NOT_FOUND
        );
      }

      // Update fields
      const heuristicaAtualizada = {
        ...heuristica,
        ...updateData,
        id: heuristica.id, // Ensure ID doesn't change
        criadoPor: heuristica.criadoPor, // Preserve original creator
        criadoEm: heuristica.criadoEm, // Preserve creation date
        atualizadoEm: new Date().toISOString(),
        versao: (heuristica.versao || 1) + 1,
        ultimoAtualizado: {
          por: userId,
          em: new Date().toISOString(),
        },
      };

      store.atualizarHeuristica(heuristicaAtualizada);

      logger.info(`Heuristica updated: ${id} by user ${userId}`);

      return heuristicaAtualizada;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error updating heuristica: ${error.message}`);
      throw new AppError(
        'Erro ao atualizar heurística',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_CODES.INTERNAL_ERROR
      );
    }
  }

  /**
   * Delete heuristica
   * @async
   * @param {string} id - Heuristica ID
   * @param {string} userId - User ID requesting deletion
   * @returns {Object} Deletion confirmation
   * @throws {AppError}
   */
  async deletar(id, userId) {
    try {
      const heuristica = store.obterHeuristicaPorId(id);

      if (!heuristica) {
        logger.warn(`Heuristica not found for deletion: ${id}`);
        throw new AppError(
          'Heurística não encontrada',
          HTTP_STATUS.NOT_FOUND,
          ERROR_CODES.NOT_FOUND
        );
      }

      store.deletarHeuristica(id);

      logger.info(`Heuristica deleted: ${id} by user ${userId}`);

      return {
        id,
        message: 'Heurística deletada com sucesso',
        deletedAt: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(`Error deleting heuristica: ${error.message}`);
      throw new AppError(
        'Erro ao deletar heurística',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_CODES.INTERNAL_ERROR
      );
    }
  }

  /**
   * Search heuristicas by term and filters
   * @async
   * @param {string} searchTerm - Search term (title, description, tags)
   * @param {Object} filters - Additional filters
   * @returns {Object} { data: [], total }
   * @throws {AppError}
   */
  async buscar(termo, filters = {}) {
    try {
        // Garante que o termo existe e é string para evitar erro no .toLowerCase() do store
        const searchTerm = termo || '';
        const limit = parseInt(filters.limit) || 20;
        const skip = parseInt(filters.skip) || 0;

        const items = store.listarHeuristicas({ search: searchTerm, limit, skip }) || [];

        const result = {
        data: items,
        total: items.length, // Agora é seguro pois items é no mínimo []
        searchTerm: searchTerm
        };

        logger.info(`Search for "${searchTerm}" returned ${result.data.length} items`);
        return result;
    } catch (error) {
        logger.error(`Error searching heuristicas: ${error.message}`);
        // Se for erro de validação ou do AppError, relance. Senão, 500.
        if (error instanceof AppError) throw error;
        throw new AppError('Erro ao buscar heurísticas', 500);
    }
  }

  /**
   * Get heuristicas statistics
   * @async
   * @returns {Object} Statistics
   * @throws {AppError}
   */
  async obterEstatisticas() {
    try {
      const stats = store.obterEstatisticas();

      logger.info('Heuristicas statistics retrieved');

      return stats;
    } catch (error) {
      logger.error(`Error getting statistics: ${error.message}`);
      throw new AppError(
        'Erro ao obter estatísticas',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_CODES.INTERNAL_ERROR
      );
    }
  }
}

export const heuristicasService = new HeuristicasService();
