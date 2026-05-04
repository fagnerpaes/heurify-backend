# 📚 Taxonomia de Heurísticas

Como heurísticas são organizadas e categorizadas no Heurify.

---

## 1. Estrutura Hierárquica

```
HEURIFY CATALOG
│
├── 🔐 SEGURANÇA
│   ├─ Autenticação & Autorização
│   │  ├─ "Teste valores vazios em campos de login"
│   │  ├─ "Verifique timeout de sessão"
│   │  └─ "Teste força de senha com regex"
│   │
│   ├─ Criptografia & Dados
│   │  ├─ "Capture tráfego em plain text"
│   │  ├─ "Teste SQL injection em inputs"
│   │  └─ "Valide certificados SSL/TLS"
│   │
│   └─ Controle de Acesso
│      ├─ "Teste privilege escalation"
│      └─ "Verifique rate limiting"
│
├── ⚡ PERFORMANCE
│   ├─ Carga & Throughput
│   │  ├─ "Teste com 1k+ usuários simultâneos"
│   │  ├─ "Monitore memória em stress"
│   │  └─ "Meça latência p99"
│   │
│   ├─ Escalabilidade
│   │  ├─ "Teste autoscaling triggers"
│   │  └─ "Valide connection pooling"
│   │
│   └─ Otimização
│      ├─ "Verifique cache hit rate"
│      └─ "Analise query performance"
│
├── 💄 USABILIDADE
│   ├─ Interface & Layout
│   │  ├─ "Teste responsividade em devices"
│   │  ├─ "Valide acessibilidade WCAG 2.1"
│   │  └─ "Teste fluxo sem mouse"
│   │
│   ├─ Navegação
│   │  ├─ "Teste botão back do navegador"
│   │  └─ "Valide deep linking"
│   │
│   └─ Feedback ao Usuário
│      ├─ "Teste mensagens de erro claras"
│      └─ "Valide indicadores de progresso"
│
├── ✅ FUNCIONALIDADE
│   ├─ Core Features
│   │  ├─ "Teste CRUD básico"
│   │  ├─ "Verifique regras de negócio"
│   │  └─ "Valide cálculos e datas"
│   │
│   ├─ Integração com 3rd Party
│   │  ├─ "Teste fallback sem API"
│   │  └─ "Verifique timeout de chamadas"
│   │
│   └─ Edge Cases
│      ├─ "Teste limites de valores"
│      └─ "Valide ordem de operações"
│
└── 📊 DADOS
    ├─ Integridade
    │  ├─ "Teste transaction rollback"
    │  ├─ "Valide foreign keys"
    │  └─ "Verifique duplicatas"
    │
    ├─ Qualidade
    │  ├─ "Teste importação com dados ruins"
    │  └─ "Valide normalização"
    │
    └─ Conformidade
       ├─ "Teste GDPR compliance"
       └─ "Valide audit trails"
```

---

## 2. Dimensões de Classificação

Cada heurística tem **metadados multi-dimensionais** para melhor descoberta:

### 📊 Por Técnica

| Técnica | Descrição | Exemplo |
|---------|-----------|---------|
| **Exploratory Testing** | Abordagem ad-hoc baseada em conhecimento | "Explore fluxos alternativos de checkout" |
| **Boundary Value Analysis** | Testa valores no limiar | "Teste -1, 0, 1 em campos numéricos" |
| **Error Guessing** | Usa experiência para adivinhar erros | "Tente formatos de data inválidos" |
| **Equivalence Partitioning** | Agrupa inputs similares | "Testes com user roles: admin, editor, viewer" |
| **State Transition** | Testa mudanças de estado | "Verifique transições de status do order" |
| **Session-Based Testing** | SBTM - estruturado em sessões | "Charter de 60min para testes de checkout" |
| **User Story Testing** | Baseado em histórias do usuário | "Usuário faz login e vê dashboard" |
| **Specification-Based** | Testa contra requirements | "Valida regras do SLA documentadas" |

### 🎯 Por Contexto de Aplicação

| Contexto | Heurísticas Aplicáveis |
|----------|------------------------|
| **Web Application** | Navegação, responsividade, cache |
| **Mobile App** | Offline, battery, network interruption |
| **API REST** | Status codes, payloads, versioning |
| **E-commerce** | Checkout, pagamento, inventory |
| **SaaS** | Multitenancy, billing, integrations |
| **Real-time** | Latency, concurrent connections, broadcasting |

### 📏 Por Nível de Maturidade

| Status | Significado | Ação |
|--------|-------------|------|
| **Draft** | Proposta, não validada | Contribuidor pode revisar |
| **Reviewed** | Revisor examinou | Pronto para aprovação |
| **Approved** | Comunidade aprovou | Recomendado usar |
| **Archived** | Obsoleta, depreciada | Informação apenas |

### 🎓 Por Nível de Dificuldade

| Nível | Pré-requisitos | Exemplo |
|-------|----------------|---------|
| **Iniciante** | Conhecimento básico teste | "Teste campo obrigatório vazio" |
| **Intermediário** | Experiência com ferramentas | "Teste com BurpSuite para XSS" |
| **Avançado** | Conhecimento profundo domínio | "Teste race conditions em transações" |

---

## 3. Estrutura de Dados de Heurística

```javascript
{
  // Identificadores
  id: "uuid-v4",
  
  // Conteúdo Principal
  title: "Teste limites de valores em campos numéricos",
  description: "Estratégia de teste de boundary values...",
  technique: "Boundary Value Analysis",  // Link para técnica
  
  // Aplicabilidade
  applicationScenario: "Campos de entrada numéricos em formulários",
  contexts: ["web", "mobile"],            // Aplicável a
  tags: ["boundary-values", "numeric", "validation"],
  
  // Exemplos Práticos
  examples: [
    "Teste com -1, 0, 1 em campo de quantidade",
    "Teste com valores muito grandes (> 2^31)",
    "Teste com valores negativos onde não esperado"
  ],
  
  // Notas de Risco
  riskNotes: "Omitir pode perder bugs de overflow",
  
  // Metadados de Curadoria
  status: "approved",                    // draft, reviewed, approved, archived
  statusEditorial: "approved",
  criadoPor: "user-123",
  criadoEm: "2026-05-01T10:00:00Z",
  atualizadoEm: "2026-05-03T15:30:00Z",
  curadorId: "curator-456",              // Quem aprovou
  
  // Versionamento
  versao: 2,                              // Histórico de mudanças
  
  // Vinculações
  charterId: null,                        // Usado em charter
  sessoesSbtmIds: ["sess-1", "sess-2"]   // Onde foi aplicada
}
```

---

## 4. Busca e Filtros

### Query Exemplos

```
GET /heuristicas?search=login&technique=Exploratory&status=approved&limit=20

GET /heuristicas?tags=security,performance&contexts=mobile

GET /heuristicas/busca/authentication?status=approved
```

### Filtros Suportados

| Filtro | Valores | Exemplos |
|--------|---------|----------|
| `search` | string | "login", "performance", "xss" |
| `technique` | enum | "Exploratory Testing", "Boundary Value Analysis" |
| `status` | enum | "draft", "reviewed", "approved", "archived" |
| `contexts` | array | ["web", "mobile", "api"] |
| `tags` | array | ["security", "boundary-values"] |
| `limit` | 1-100 | Paginação |
| `skip` | >= 0 | Offset paginação |

---

## 5. Exemplos de Heurísticas por Domínio

### 🔐 Segurança - Autenticação

**Heurística 1: Teste Força de Senha**
```
Título: "Valide força de senha com regex apropriado"
Technique: Equivalence Partitioning
Aplicável a: Web, Mobile, API
Tags: [security, authentication, password-validation]
Exemplos:
  - Senha vazia
  - Senha < 8 caracteres
  - Senha sem maiúscula
  - Senha com caracteres especiais válidos
  - Senha > 100 caracteres
```

### 💄 Usabilidade - Responsividade

**Heurística 2: Teste em Múltiplos Devices**
```
Título: "Verifique layout responsivo em breakpoints"
Technique: State Transition (de 320px até 2560px)
Aplicável a: Web
Tags: [usability, responsive, mobile-first]
Exemplos:
  - Mobile (320px), Tablet (768px), Desktop (1024px), 4K (2560px)
  - Teste zoom em/out do navegador
  - Teste em modo portrait e landscape
```

### ✅ Funcionalidade - CRUD

**Heurística 3: Teste CRUD Básico**
```
Título: "Verifique create, read, update, delete"
Technique: User Story Testing
Aplicável a: Web, API, Mobile
Tags: [functional, crud, core-feature]
Exemplos:
  - Create: POST com dados válidos → 201
  - Read: GET retorna dados completos
  - Update: PUT modifica campos sem danificar outros
  - Delete: DELETE remove e GET retorna 404
```

---

## 6. Comunidade e Curadoria

### Fluxo de Aprovação

```
Contribuidor
     ↓
[Propõe heurística via PR]
     ↓
Status: draft
     ↓
Revisor
     ↓
[Examina clareza, relevância, exemplos]
     ↓
Status: reviewed
     ↓
Comunidade Vota
     ↓
[3+ aprovações ou 2 curadores]
     ↓
Status: approved
     ↓
Publicado no Catálogo
```

### Critérios de Aprovação

- ✅ **Clareza:** Descrição é compreensível
- ✅ **Relevância:** Aplicável a contextos reais
- ✅ **Exemplos:** Pelo menos 2 exemplos práticos
- ✅ **Técnica Válida:** Baseada em metodologia conhecida
- ✅ **Sem Duplicata:** Não duplica heurística existente

---

## 7. Integração com SBTM

Heurísticas são usadas em **Charters** para **Sessões SBTM**:

```
Charter
├─ Heurística 1: "Teste boundary values"
├─ Heurística 2: "Teste fluxos alternativos"
└─ Heurística 3: "Verifique mensagens de erro"

Sessão SBTM (60 minutos)
├─ Aplica Heurística 1 → Encontra bug #1
├─ Aplica Heurística 2 → Encontra bug #2
└─ Aplica Heurística 3 → Encontra improvement #1

Resultado:
3 achados registrados e vinculados às heurísticas
```

---

## 8. Estatísticas & Analytics

### Métricas por Heurística

- **Uso Frequência:** Quantas vezes usada em sessões
- **Taxa de Efetividade:** Bugs encontrados / horas testadas
- **Última Usada:** Data do último uso
- **Contribuidor:** Quem criou
- **Aprovações:** Quantas comunidade aprovou

### Exemplo Dashboard

```
Top 5 Heurísticas Mais Efetivas:
1. "Teste boundary values" - 85% taxa de descoberta
2. "Teste fluxos alternativos" - 72% taxa
3. "Verifique async/await" - 68% taxa
...

Técnicas Mais Usadas:
- Exploratory Testing: 45%
- Boundary Value: 30%
- State Transition: 15%
- Outros: 10%

Heurísticas por Status:
- Approved: 142
- Reviewed: 8
- Draft: 3
- Archived: 12
```

---

## 9. Nomenclatura Consistente

### Padrão de Título

```
[Verbo Imperativo] [Objeto/Contexto] [Resultado]

Exemplos:
✅ "Teste valores boundary em campos numéricos"
✅ "Valide mensagens de erro claras para usuário"
✅ "Verifique transições de estado permitidas"

❌ "Testing boundary" (vago)
❌ "O que testar em campos numéricos" (pergunta)
❌ "Heurística de teste de campos" (genérico)
```

---

## 10. Descoberta Inteligente

### Sugestões do Sistema

Quando criando um **Charter**, sistema sugere heurísticas baseado em:

1. **Contexto:** Se charter é para "checkout", sugere heurísticas de e-commerce
2. **Histórico:** Se time usou "Boundary Values", sugere similares
3. **Técnicas:** Se charter especifica "SBTM", filtra para session-based
4. **Popularidade:** Heurísticas mais usadas aparecem primeiro

---

## Links Relacionados

- [[Guia de Contribuição]] - Como adicionar heurística
- [[Heurísticas de VADER]] - Metodologia VADER
- [[Integração com SBTM]] - Como usar em sessões
- [[Visão Geral]] - Conceitos principais

