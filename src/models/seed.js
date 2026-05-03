import { v4 as uuidv4 } from 'uuid';
import { store } from './in-memory.store.js';
import { logger } from '../utils/logger.js';

export const seedDatabase = () => {
  logger.info('Iniciando seeding do InMemoryStore para cenários SBTM...');

  // 1. USUÁRIOS (Personas para testes de permissão e bias)
  const usuarios = [
    { id: uuidv4(), name: 'Admin Heurify', email: 'admin@heurify.com', role: 'admin' },
    { id: uuidv4(), name: 'Tester Senior', email: 'junior@heurify.com', role: 'editor' }, // Nome irônico para testar bias
    { id: uuidv4(), name: 'Guest User', email: 'guest@heurify.com', role: 'viewer' }
  ];
  usuarios.forEach(u => store.salvarUsuario({ ...u, password: 'password123' }));

  // 2. HEURÍSTICAS (Dados para Casos de Borda e Validação)
  const heuristicas = [
    {
      id: uuidv4(),
      title: 'Goldilocks: Limites de Input',
      description: 'Testar campos com valores: Muito Pequeno, Muito Grande e Just Right.',
      technique: 'Boundaries',
      tags: ['input', 'validacao', 'seguranca'],
      status: 'published'
    },
    {
      id: uuidv4(),
      title: 'RCRCRC: Regressão de Configuração',
      description: 'Focar em áreas Recent, Risky, e Configuration Sensitive.',
      technique: 'Mnemônico RCRCRC',
      tags: ['regressao', 'risco'],
      status: 'published'
    },
    {
      id: uuidv4(),
      title: 'String Longa & Caracteres Especiais',
      description: 'Heurística de Stress: Inserir 10.000 caracteres e emojis para testar quebra de layout.',
      technique: 'Starvation/Flood',
      tags: ['stress', 'layout'],
      status: 'published'
    },
    {
      id: uuidv4(),
      title: 'BINMEN (API Technical)',
      description: 'Boundary, Invalid entries, NULL, Method, Empty, Negative.',
      technique: 'Checklist Técnico de API',
      tags: ['técnico', 'api', 'validação'],
      status: 'published'
    },
    {
      id: uuidv4(),
      title: 'SFDPOT (Product Analysis)',
      description: 'Structure, Function, Data, Platform, Operations, Time.',
      technique: 'Análise Multidimensional',
      tags: ['produto', 'estratégia', 'geral'],
      status: 'published'
    },
    {
      id: uuidv4(),
      title: 'VADER (API Design)',
      description: 'Verbs, Authorization, Data, Errors, Responsiveness.',
      technique: 'Lente de Design de API',
      tags: ['api', 'segurança', 'design'],
      status: 'published'
    },
    {
      id: uuidv4(),
      title: 'I SLICED UP FUN (Mobile)',
      description: 'Inputs, Store, Location, Interactions, Communication, Ergonomics, Data, Usability, Platform, Function, User, Network.',
      technique: 'Teste Mobile Especializado',
      tags: ['mobile', 'usabilidade', 'rede'],
      status: 'published'
    }
  ];
  heuristicas.forEach(h => store.salvarHeuristica(h));

  // 3. CHARTERS (Missões baseadas em SBTM)
  const charters = [
    {
      id: uuidv4(),
      titulo: 'Explorar Fluxo de Checkout com Conexão Instável',
      objetivo: 'Identificar problemas de concorrência e timeout usando a heurística Interruption.',
      escopo: 'Carrinho de compras, seleção de frete e finalização de pagamento.',
      duracao: 90, // Sessão normal
      status: 'planejado',
      heuristicasIds: [heuristicas[1].id],
      criadoPor: usuarios[0].id
    },
    {
      id: uuidv4(),
      titulo: 'Teste de Sanidade em Tela de Perfil (Campos Vazios)',
      objetivo: 'Violar constraints de obrigatoriedade usando a heurística Constraints.',
      escopo: 'Formulário de edição de perfil e upload de avatar.',
      duracao: 45, // Sessão curta
      status: 'planejado',
      heuristicasIds: [heuristicas[0].id],
      criadoPor: usuarios[1].id
    },
    {
      id: uuidv4(),
      titulo: 'Missão BINMEN: Estresse de Limites na API de Charters',
      objetivo: 'Identificar quebras enviando campos nulos, vazios e tipos inválidos.',
      escopo: 'Endpoints POST e PUT de /charters.',
      duracao: 60,
      status: 'planejado',
      heuristicasIds: [heuristicas[3].id],
      criadoPor: usuarios[0].id
    },
    {
      id: uuidv4(),
      titulo: 'Missão SFDPOT: Sincronia e Performance de Dados',
      objetivo: 'Validar a dimensão "Data" e "Time" sob carga moderada.',
      escopo: 'Listagem de heurísticas com filtros complexos e paginação.',
      duracao: 90,
      status: 'planejado',
      heuristicasIds: [heuristicas[4].id],
      criadoPor: usuarios[0].id
    }      

  ];
  charters.forEach(c => store.salvarCharter(c));

  // 4. SESSÕES SBTM (Exemplo de sessão em andamento e uma finalizada)
  const sessaoAtiva = {
    id: uuidv4(),
    nome: 'Execução: Sanidade de Perfil',
    charterId: charters[1].id,
    testador: usuarios[1].name,
    status: 'em-progresso',
    dataInicio: new Date().toISOString(),
    setupTime: 10,
    testTime: 0,
    bugTime: 0,
    opportunityTime: 0,
    observacoesInicio: 'Iniciando com foco em campos obrigatórios do perfil.'
  };
  store.salvarSessao(sessaoAtiva);

  logger.info('Seeding concluído com sucesso.');
};