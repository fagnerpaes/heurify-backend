import { v4 as uuidv4 } from 'uuid';
import { store } from '../models/in-memory.store.js';
import { AppError } from '../utils/error-handler.js';
import { ERROR_CODES } from '../config/error-codes.js';
import { logger } from '../utils/logger.js';

/**
 * Charter Service - Gerencia geração e CRUD de charters de teste
 */
export class CharterService {
  /**
   * Criar novo charter
   * @async
   * @param {Object} charterData - Dados do charter
   * @param {string} userId - ID do usuário criador
   * @returns {Object} Charter criado
   */
  async criar(charterData, userId) {
    try {
      // Validar se todas as heurísticas existem
      const heuristicasIds = charterData.heuristicasIds || [];
      for (const hId of heuristicasIds) {
        const heuristica = store.obterHeuristicaPorId(hId);
        if (!heuristica) {
          throw new AppError(
            `Heurística com ID ${hId} não encontrada`,
            400,
            ERROR_CODES.NOT_FOUND
          );
        }
      }

      const novoCharter = {
        id: uuidv4(),
        titulo: charterData.titulo,
        objetivo: charterData.objetivo,
        escopo: charterData.escopo,
        duracao: charterData.duracao,
        heuristicasIds,
        ambienteTestado: charterData.ambienteTestado || null,
        versaoApp: charterData.versaoApp || null,
        observacoes: charterData.observacoes || null,
        status: 'planejado',
        criadoPor: userId,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        sessoesSbtmIds: [],
      };

      store.salvarCharter(novoCharter);
      logger.info(`Charter criado: ${novoCharter.id}`);
      return novoCharter;
    } catch (error) {
      logger.error(`Erro ao criar charter:`, error);
      throw error;
    }
  }

  /**
   * Obter charter por ID
   * @async
   * @param {string} id - ID do charter
   * @returns {Object} Charter
   */
  async obterPorId(id) {
    try {
      const charter = store.obterCharterPorId(id);
      if (!charter) {
        throw new AppError(
          'Charter não encontrado',
          404,
          ERROR_CODES.NOT_FOUND
        );
      }
      return charter;
    } catch (error) {
      logger.error(`Erro ao obter charter ${id}:`, error);
      throw error;
    }
  }

  /**
   * Listar charters com filtros e paginação
   * @async
   * @param {Object} filters - Filtros
   * @returns {Object} Array de charters e metadados
   */
  async listar(filters = {}) {
    try {
      const { search = '', status = '', limit = 20, skip = 0 } = filters;

      let charters = store.listarCharters();

      // Aplicar filtros
      if (status) {
        charters = charters.filter(c => c.status === status);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        charters = charters.filter(c =>
          c.titulo.toLowerCase().includes(searchLower) ||
          c.objetivo.toLowerCase().includes(searchLower) ||
          c.escopo.toLowerCase().includes(searchLower)
        );
      }

      // Ordenar por data de criação (mais recente primeiro)
      charters = charters.sort(
        (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)
      );

      const total = charters.length;
      const paginated = charters.slice(skip, skip + limit);

      return {
        data: paginated,
        total,
        limit,
        skip,
      };
    } catch (error) {
      logger.error('Erro ao listar charters:', error);
      throw error;
    }
  }

  /**
   * Atualizar charter
   * @async
   * @param {string} id - ID do charter
   * @param {Object} updateData - Dados para atualizar
   * @param {string} userId - ID do usuário
   * @returns {Object} Charter atualizado
   */
  async atualizar(id, updateData, userId) {
    try {
      const charter = await this.obterPorId(id);

      // Se status está mudando para em-execucao, validar
      if (updateData.status === 'em-execucao' && charter.status === 'planejado') {
        // Permitir iniciar execução
      }

      const chartered = {
        ...charter,
        ...updateData,
        atualizadoEm: new Date().toISOString(),
        ultimoAtualizado: {
          por: userId,
          em: new Date().toISOString(),
        },
      };

      store.salvarCharter(chartered);
      logger.info(`Charter atualizado: ${id}`);
      return chartered;
    } catch (error) {
      logger.error(`Erro ao atualizar charter ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletar charter
   * @async
   * @param {string} id - ID do charter
   * @param {string} userId - ID do usuário
   * @returns {Object} Confirmação de deleção
   */
  async deletar(id, userId) {
    try {
      const charter = await this.obterPorId(id);

      // Não permitir deletar se tem sessões em progresso
      if (charter.sessoesSbtmIds && charter.sessoesSbtmIds.length > 0) {
        const temSessaoEmProgresso = charter.sessoesSbtmIds.some(sId => {
          const sessao = store.obterSessaoPorId(sId);
          return sessao && sessao.status !== 'finalizada';
        });

        if (temSessaoEmProgresso) {
          throw new AppError(
            'Não é possível deletar charter com sessões em progresso',
            400,
            ERROR_CODES.CONFLICT
          );
        }
      }

      store.deletarCharter(id);
      logger.info(`Charter deletado: ${id} por usuario ${userId}`);

      return {
        id,
        message: 'Charter deletado com sucesso',
        deletedAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error(`Erro ao deletar charter ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obter estatísticas de charters
   * @async
   * @returns {Object} Estatísticas
   */
  async obterEstatisticas() {
    try {
      const charters = store.listarCharters();

      const stats = {
        totalCharters: charters.length,
        chartersPorStatus: {
          planejado: charters.filter(c => c.status === 'planejado').length,
          'em-execucao': charters.filter(c => c.status === 'em-execucao').length,
          finalizado: charters.filter(c => c.status === 'finalizado').length,
          cancelado: charters.filter(c => c.status === 'cancelado').length,
        },
        heuristicasUsadas: this._contarHeuristicasUnicas(charters),
      };

      return stats;
    } catch (error) {
      logger.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }

  /**
   * Contar heurísticas únicas usadas em charters
   * @private
   * @param {Array} charters - Array de charters
   * @returns {number} Total de heurísticas únicas
   */
  _contarHeuristicasUnicas(charters) {
    const uniqueIds = new Set();
    charters.forEach(charter => {
      (charter.heuristicasIds || []).forEach(id => uniqueIds.add(id));
    });
    return uniqueIds.size;
  }
}

export const charterService = new CharterService();
