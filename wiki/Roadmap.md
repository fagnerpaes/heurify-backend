# 🗺️ Roadmap

Planejamento estratégico do Heurify, dividido em fases de desenvolvimento.

---

## 📊 Visão Geral

```
v0.1 (MVP)     v0.2 (Curadoria)    v1.0 (Analytics)    v1.1+ (IA)
│              │                   │                   │
├─ Sprints 1-3 ├─ Q2 2026         ├─ Q3 2026          └─ Q4 2026+
└─ Maio 2026   └─ Junho-Julho     └─ Agosto-Setembro


Phases: Infrastructure → Auth → CRUD → Advanced Features → AI
```

---

## ✅ Fase 1: MVP (Maio 2026) - CONCLUÍDA

### Status: 🟢 COMPLETO

**Objetivo:** Plataforma funcional com CRUD básico e SBTM.

### Sprints

#### 🏆 [[SPRINT 1]] - Autenticação JWT

- **Data:** 1 de maio de 2026
- **Status:** ✅ COMPLETO
- **Issues:** #4 (JWT), #8 (RBAC Base)

**Features:**
- POST `/auth/login` - Autenticação com JWT
- POST `/auth/register` - Registro de usuários
- GET `/auth/me` - Dados do usuário autenticado
- POST `/auth/logout` - Logout
- RBAC base (roles: admin, editor, viewer)

**Endpoints:** 4  
**Testes:** 12 ✅  
**Coverage:** 95%+

**Documentação:** Ver [SPRINT_1.md](./SPRINT_1.md)

---

#### 🏆 [[SPRINT 2]] - CRUD Heurísticas + Busca

- **Data:** 2 de maio de 2026
- **Status:** ✅ COMPLETO
- **Issues:** #5 (CRUD), #6 (Busca), #7 (Metadados)

**Features:**
- POST `/heuristicas` - Criar heurística
- GET `/heuristicas` - Listar com paginação
- GET `/heuristicas/:id` - Obter detalhes
- PUT `/heuristicas/:id` - Atualizar
- DELETE `/heuristicas/:id` - Deletar
- GET `/heuristicas/busca/:termo` - Buscar
- Metadados: status, curator, version

**Endpoints:** 7  
**Testes:** 24 ✅  
**Coverage:** 90%+

**Documentação:** Ver [SPRINT_2.md](./SPRINT_2.md)

---

#### 🏆 [[SPRINT 3]] - Charter & SBTM Sessions + Achados

- **Data:** 3 de maio de 2026
- **Status:** ✅ COMPLETO
- **Issues:** #9 (Charter), #10 (SBTM), #11 (Achados)

**Features - Charter:**
- POST `/charters` - Criar charter com heurísticas
- GET `/charters` - Listar charters
- GET `/charters/:id` - Obter charter
- PUT `/charters/:id` - Atualizar status/dados
- DELETE `/charters/:id` - Deletar (com validação)
- GET `/charters/stats/estatisticas` - Métricas

**Features - SBTM:**
- POST `/sessoes-sbtm` - Criar sessão ligada a charter
- GET `/sessoes-sbtm` - Listar sessões
- GET `/sessoes-sbtm/:id` - Obter sessão
- PUT `/sessoes-sbtm/:id` - Atualizar (ex: status)
- POST `/sessoes-sbtm/:id/finalizar` - Finalizar com achados
- DELETE `/sessoes-sbtm/:id` - Deletar (com regras)

**Features - Achados:**
- Registrar achados durante `finalizar`
- Categorizar por severidade (crítico, alto, médio, baixo)
- Registrar tipo (bug, melhoria, pergunta)
- Vincular à heurística usada

**Endpoints:** 13 (6 Charter + 7 SBTM)  
**Testes:** 23+ ✅  
**Coverage:** 85%+

**Documentação:** Ver [SPRINT_3.md](./SPRINT_3.md) e [[Integração com SBTM]]

---

### v0.1 Resumo

```
Total Endpoints:  13
Total Tests:      59+
Coverage:         85%+
Issues:           11 fechadas
Status:           🟢 MVP PRONTO PARA USO
```

**Arquivos Core:**
- `src/` - 26 arquivos
- `test/` - 3 test files
- `docs/` - 10+ documentos
- **Linhas de Código:** 5.000+

---

## 🔄 Fase 2: Curadoria (Q2 2026 - Junho/Julho)

### Status: 🟡 PLANEJADO

**Objetivo:** Permitir comunidade validar e curatar heurísticas.

### Issues Planejadas

| Issue | Título | Horas | Prioridade |
|-------|--------|-------|-----------|
| #12 | Workflow de aprovação | 8h | P0 |
| #13 | Designar curadores | 4h | P1 |
| #14 | Versionamento de heurísticas | 6h | P1 |
| #15 | Comentários comunitários | 5h | P2 |

### Features Esperadas

- ✅ Status: draft → reviewed → approved → published
- ✅ Curadores designados por categoria
- ✅ Histórico de mudanças
- ✅ Votação comunitária
- ✅ Comentários em heurísticas
- ✅ Badge de contribuidor

### Timeline

```
Semana 1: Design de workflow
Semana 2: Implementação backend
Semana 3: Testes e validação
Semana 4: Deploy e monitoramento
```

---

## 📊 Fase 3: Analytics (Q3 2026 - Agosto/Setembro)

### Status: 🟡 PLANEJADO

**Objetivo:** Dashboard com insights de testes e cobertura.

### Issues Planejadas

| Issue | Título | Horas | Prioridade |
|-------|--------|-------|-----------|
| #16 | Dashboard de cobertura | 10h | P0 |
| #17 | Relatórios de heurísticas | 8h | P0 |
| #18 | Integração com bug tracking | 6h | P1 |
| #19 | Analytics real-time | 7h | P1 |

### Features Esperadas

- ✅ Dashboard mostrando:
  - Heurísticas mais usadas
  - Taxa de descoberta de bugs por heurística
  - Cobertura por categoria
  - Sessões SBTM por período
- ✅ Relatórios exportáveis (PDF, CSV)
- ✅ Integração com JIRA/GitHub Issues
- ✅ Alertas de cobertura baixa

### Technology Stack

- **Frontend:** React Charts (Recharts/Chart.js)
- **Backend:** Agregações em banco de dados
- **Export:** PDFKit, csv-writer

---

## 🤖 Fase 4: IA (Q4 2026+)

### Status: 🔵 CONCEITUAL

**Objetivo:** Sugestões inteligentes e automação.

### Ideias

- 🧠 **Recomendador:** Sugere heurísticas baseado em contexto
- 🔍 **Detecção de Sobreposição:** Identifica heurísticas duplicadas
- 📈 **Análise Preditiva:** Prevê quais técnicas são mais efetivas
- 🤖 **Geração:** Gera padrões a partir de achados históricos

### Tecnologia

- LLM integration (OpenAI API, Hugging Face)
- Vector embedding para similaridade
- ML models treinados com dados do Heurify

---

## 🎯 Roadmap de Infraestrutura

### Banco de Dados (Ongoing)

```
v0.1: In-Memory Store ✅
v0.2: PostgreSQL Migration 🔄
v1.0: Sharding & Caching ⏳
```

### Frontend (Parallel)

```
v0.1: MVP React + REST
v0.2: TypeScript + State Management
v1.0: Real-time WebSocket
v1.1: Mobile PWA
```

### DevOps (Parallel)

```
v0.1: GitHub + npm ✅
v0.2: Docker + CI/CD 🔄
v1.0: Kubernetes ⏳
v1.1: Monitoring & Observability ⏳
```

---

## 📅 Cronograma Detalhado

### Maio 2026 (✅ Concluído)

```
1-7 maio:    Sprint 0 (Infrastructure) ✅
8-14 maio:   Sprint 1 (Auth JWT) ✅
15-21 maio:  Sprint 2 (CRUD Heurísticas) ✅
22-31 maio:  Sprint 3 (Charter + SBTM) ✅
```

### Junho 2026 (🔄 Em Progresso)

```
1-7 junho:   Workflow aprovação (Issue #12)
8-14 junho:  Designar curadores (Issue #13)
15-21 junho: Versionamento (Issue #14)
22-30 junho: Testes & Deploy v0.2
```

### Julho 2026 (⏳ Próximo)

```
1-7 julho:   Comentários comunitários (Issue #15)
8-14 julho:  Integração SBTM melhorada
15-21 julho: Dashboard Beta
22-31 julho: Feedback da comunidade
```

---

## 🚀 Método de Release

### Versionamento: Semantic Versioning

```
v0.1.0 - First Release (MVP)
v0.2.0 - Curadoria feature
v1.0.0 - Analytics feature
v1.1.0 - IA feature
```

### Release Process

1. **Feature Freeze** - Não aceita features novas
2. **Bug Fixes** - Última rodada de correções
3. **Testing** - QA completa
4. **Documentation** - Atualizar wikis e guides
5. **Release** - Tag no GitHub + deploy
6. **Announcement** - Changelog publicado

---

## 🎖️ Milestones Comunidade

### Bronze (v0.1)
- ✅ 10+ heurísticas aprovadas
- ✅ 5+ contribuidores
- ✅ 100+ testes unitários

### Silver (v0.2)
- 🔄 30+ heurísticas aprovadas
- 🔄 15+ contribuidores
- 🔄 Dashboard funcional

### Gold (v1.0)
- ⏳ 100+ heurísticas
- ⏳ 50+ contribuidores ativos
- ⏳ Integração com ferramentas enterprise

---

## 📋 Como Contribuir para Roadmap

1. **Votação:** Comente em issues para priorizar
2. **Ideias:** Abra issue com `enhancement` label
3. **PRs:** Contribua com código para qualquer fase
4. **Feedback:** Share experiência usando Heurify

---

## Links Relacionados

- [[Visão Geral]] - O que é Heurify
- [[Arquitetura]] - Design técnico
- [[Guia de Contribuição]] - Como ajudar
- [[Heurísticas de VADER]] - Metodologia de teste
- [[Integração com SBTM]] - Session-Based Test Management
- [[SPRINT 1]] - Detalhes de autenticação
- [[SPRINT 2]] - Detalhes de CRUD
- [[SPRINT 3]] - Detalhes de Charter/SBTM

