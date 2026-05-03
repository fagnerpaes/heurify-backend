import { v4 as uuidv4 } from 'uuid';
import { store } from '../models/in-memory.store.js';
import { AppError } from '../utils/error-handler.js';
import { ERROR_CODES } from '../config/error-codes.js';
import { logger } from '../utils/logger.js';

/**
 * SBTM Session Service - Gerencia sessões de teste baseadas em charter
 */
export class SbtmService {
  /**
   * Criar nova sessão SBTM
   * @async
   * @param {Object} sessaoData - Dados da sessão
   * @param {string} userId - ID do usuário criador
   * @returns {Object} Sessão criada
   */
  async criar(sessaoData, userId) {
    try {
      // Validar se charter existe
      const charter = store.obterCharterPorId(sessaoData.charterId);
      if (!charter) {
        throw new AppError(
          'Charter não encontrado',
          404,
          ERROR_CODES.NOT_FOUND
        );
      }

      const novaSessao = {
        id: uuidv4(),
        nome: sessaoData.nome,
        charterId: sessaoData.charterId,
        testador: sessaoData.testador,
        dataInicio: sessaoData.dataInicio,
        dataFim: null,
        observacoesInicio: sessaoData.observacoesInicio || null,
        status: 'em-progresso',
        achados: [],
        observacoesFinais: null,
        criadoPor: userId,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };

      store.salvarSessao(novaSessao);

      // Atualizar charter com referência à sessão
      charter.sessoesSbtmIds = charter.sessoesSbtmIds || [];
      charter.sessoesSbtmIds.push(novaSessao.id);
      store.salvarCharter(charter);

      logger.info(`Sessão SBTM criada: ${novaSessao.id} para charter ${sessaoData.charterId}`);
      return novaSessao;
    } catch (error) {
      logger.error('Erro ao criar sessão SBTM:', error);
      throw error;
    }
  }

  /**
   * Obter sessão por ID
   * @async
   * @param {string} id - ID da sessão
   * @returns {Object} Sessão
   */
  async obterPorId(id) {
    try {
      const sessao = store.obterSessaoPorId(id);
      if (!sessao) {
        throw new AppError(
          'Sessão SBTM não encontrada',
          404,
          ERROR_CODES.NOT_FOUND
        );
      }
      return sessao;
    } catch (error) {
      logger.error(`Erro ao obter sessão ${id}:`, error);
      throw error;
    }
  }

  /**
   * Listar sessões com filtros e paginação
   * @async
   * @param {Object} filters - Filtros
   * @returns {Object} Array de sessões e metadados
   */
  async listar(filters = {}) {
    try {
      const { search = '', status = '', charterId = '', limit = 20, skip = 0 } = filters;

      let sessoes = store.listarSessoes();

      // Aplicar filtros
      if (status) {
        sessoes = sessoes.filter(s => s.status === status);
      }

      if (charterId) {
        sessoes = sessoes.filter(s => s.charterId === charterId);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        sessoes = sessoes.filter(s =>
          s.nome.toLowerCase().includes(searchLower) ||
          s.testador.toLowerCase().includes(searchLower)
        );
      }

      // Ordenar por data de criação (mais recente primeiro)
      sessoes = sessoes.sort(
        (a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)
      );

      const total = sessoes.length;
      const paginated = sessoes.slice(skip, skip + limit);

      return {
        data: paginated,
        total,
        limit,
        skip,
      };
    } catch (error) {
      logger.error('Erro ao listar sessões SBTM:', error);
      throw error;
    }
  }

  /**
   * Atualizar status da sessão
   * @async
   * @param {string} id - ID da sessão
   * @param {Object} updateData - Dados para atualizar
   * @param {string} userId - ID do usuário
   * @returns {Object} Sessão atualizada
   */
  async atualizar(id, updateData, userId) {
    try {
      const sessao = await this.obterPorId(id);

      // Validações de transição de estado
      if (updateData.status) {
        const transicoes = {
          'em-progresso': ['pausada', 'finalizada'],
          pausada: ['em-progresso', 'finalizada'],
          finalizada: [],
        };

        if (!transicoes[sessao.status]?.includes(updateData.status)) {
          throw new AppError(
            `Transição de status não permitida: ${sessao.status} → ${updateData.status}`,
            400,
            ERROR_CODES.CONFLICT
          );
        }
      }

      const sessaoAtualizada = {
        ...sessao,
        ...updateData,
        atualizadoEm: new Date().toISOString(),
        ultimoAtualizado: {
          por: userId,
          em: new Date().toISOString(),
        },
      };

      store.salvarSessao(sessaoAtualizada);
      logger.info(`Sessão SBTM atualizada: ${id}`);
      return sessaoAtualizada;
    } catch (error) {
      logger.error(`Erro ao atualizar sessão ${id}:`, error);
      throw error;
    }
  }

  /**
   * Finalizar sessão com registro de achados
   * @async
   * @param {string} id - ID da sessão
   * @param {Object} finalizacaoData - Dados de finalização (achados, observações, dataFim)
   * @param {string} userId - ID do usuário
   * @returns {Object} Sessão finalizada com achados
   */
  async finalizar(id, finalizacaoData, userId) {
    try {
      const sessao = await this.obterPorId(id);

      if (sessao.status === 'finalizada') {
        throw new AppError(
          'Sessão já foi finalizada',
          400,
          ERROR_CODES.CONFLICT
        );
      }

      // Salvar achados
      const achados = finalizacaoData.achados || [];
      const achadosSalvos = [];

      for (const achado of achados) {
        const novoAchado = {
          id: uuidv4(),
          sessaoId: id,
          titulo: achado.titulo,
          descricao: achado.descricao,
          severidade: achado.severidade,
          tipo: achado.tipo,
          passosPara: achado.passosPara || null,
          ambienteOcorrencia: achado.ambienteOcorrencia || null,
          status: 'aberto',
          criadoPor: userId,
          criadoEm: new Date().toISOString(),
        };

        store.salvarAchado(novoAchado);
        achadosSalvos.push(novoAchado);
      }

      // Atualizar sessão
      const sessaoFinalizada = {
        ...sessao,
        status: 'finalizada',
        dataFim: finalizacaoData.dataFim,
        observacoesFinais: finalizacaoData.observacoesFinais || null,
        achados: achadosSalvos,
        atualizadoEm: new Date().toISOString(),
      };

      store.salvarSessao(sessaoFinalizada);
      logger.info(`Sessão SBTM finalizada: ${id} com ${achadosSalvos.length} achados`);

      return sessaoFinalizada;
    } catch (error) {
      logger.error(`Erro ao finalizar sessão ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletar sessão
   * @async
   * @param {string} id - ID da sessão
   * @param {string} userId - ID do usuário
   * @returns {Object} Confirmação de deleção
   */
  async deletar(id, userId) {
    try {
      const sessao = await this.obterPorId(id);

      // Não permitir deletar se está em progresso
      if (sessao.status === 'em-progresso') {
        throw new AppError(
          'Não é possível deletar sessão em progresso',
          400,
          ERROR_CODES.CONFLICT
        );
      }

      // Remover referência do charter
      const charter = store.obterCharterPorId(sessao.charterId);
      if (charter) {
        charter.sessoesSbtmIds = (charter.sessoesSbtmIds || []).filter(sId => sId !== id);
        store.salvarCharter(charter);
      }

      // Deletar achados relacionados
      const todosAchados = store.listarAchados();
      todosAchados
        .filter(a => a.sessaoId === id)
        .forEach(a => store.deletarAchado(a.id));

      store.deletarSessao(id);
      logger.info(`Sessão SBTM deletada: ${id} por usuario ${userId}`);

      return {
        id,
        message: 'Sessão SBTM deletada com sucesso',
        deletedAt: new Date().toISOString(),
      };
    } catch (error) {
      logger.error(`Erro ao deletar sessão ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obter estatísticas de sessões
   * @async
   * @returns {Object} Estatísticas
   */
  async obterEstatisticas() {
    try {
      const sessoes = store.listarSessoes();
      const achados = store.listarAchados();

      const stats = {
        totalSessoes: sessoes.length,
        sessoesPorStatus: {
          'em-progresso': sessoes.filter(s => s.status === 'em-progresso').length,
          pausada: sessoes.filter(s => s.status === 'pausada').length,
          finalizada: sessoes.filter(s => s.status === 'finalizada').length,
        },
        totalAchados: achados.length,
        achadosPorSeveridade: {
          critica: achados.filter(a => a.severidade === 'critica').length,
          alta: achados.filter(a => a.severidade === 'alta').length,
          media: achados.filter(a => a.severidade === 'media').length,
          baixa: achados.filter(a => a.severidade === 'baixa').length,
        },
        achadosPorTipo: {
          bug: achados.filter(a => a.tipo === 'bug').length,
          usabilidade: achados.filter(a => a.tipo === 'usabilidade').length,
          performance: achados.filter(a => a.tipo === 'performance').length,
          seguranca: achados.filter(a => a.tipo === 'seguranca').length,
          outro: achados.filter(a => a.tipo === 'outro').length,
        },
      };

      return stats;
    } catch (error) {
      logger.error('Erro ao obter estatísticas de sessões:', error);
      throw error;
    }
  }
}

export const sbtmService = new SbtmService();
