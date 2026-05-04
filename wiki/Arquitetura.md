# 🏗️ Arquitetura

Visão técnica completa da plataforma Heurify, incluindo design, padrões e decisões arquiteturais.

---

## 1. Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                     │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Frontend (React + TypeScript)                      │   │
│  │  ├─ UI Components (Dashboard, Catálogo)            │   │
│  │  ├─ State Management (Redux/Context)               │   │
│  │  └─ HTTP Client (REST)                             │   │
│  └────────────────┬──────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                    │
                    │ HTTPS REST API
                    ↓
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express Application Server             │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ MIDDLEWARE STACK (Ordem)                     │ │  │
│  │  │ 1. CORS Middleware                           │ │  │
│  │  │ 2. JSON Body Parser                          │ │  │
│  │  │ 3. Request Logger (Winston)                  │ │  │
│  │  │ 4. Auth Middleware (JWT validation)          │ │  │
│  │  │ 5. Routes                                    │ │  │
│  │  │ 6. 404 Handler                               │ │  │
│  │  │ 7. Error Handler (centralized)               │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ ROUTES (13 endpoints, 5 resource paths)       │ │  │
│  │  │ ├─ POST   /auth/login                        │ │  │
│  │  │ ├─ POST   /auth/register                      │ │  │
│  │  │ ├─ POST   /heuristicas                        │ │  │
│  │  │ ├─ GET    /heuristicas                        │ │  │
│  │  │ ├─ GET    /heuristicas/:id                    │ │  │
│  │  │ ├─ PUT    /heuristicas/:id                    │ │  │
│  │  │ ├─ DELETE /heuristicas/:id                    │ │  │
│  │  │ ├─ POST   /charters                           │ │  │
│  │  │ ├─ GET    /charters/:id                       │ │  │
│  │  │ ├─ POST   /sessoes-sbtm                       │ │  │
│  │  │ ├─ GET    /sessoes-sbtm/:id                   │ │  │
│  │  │ ├─ POST   /sessoes-sbtm/:id/finalizar         │ │  │
│  │  │ └─ GET    /health                             │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ CONTROLLERS (Request Handlers)                │ │  │
│  │  │ ├─ AuthController                             │ │  │
│  │  │ ├─ HeuristicasController                       │ │  │
│  │  │ ├─ CharterController                           │ │  │
│  │  │ └─ SBTMController                              │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ SERVICES (Business Logic)                     │ │  │
│  │  │ ├─ AuthService                                │ │  │
│  │  │ ├─ HeuristicasService                          │ │  │
│  │  │ ├─ CharterService                              │ │  │
│  │  │ └─ SBTMService                                 │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ PERSISTENCE (Models)                          │ │  │
│  │  │ └─ InMemoryStore (Maps em memória)            │ │  │
│  │  │    ├─ usuarios Map<id, User>                  │ │  │
│  │  │    ├─ heuristicas Map<id, Heuristica>         │ │  │
│  │  │    ├─ charters Map<id, Charter>               │ │  │
│  │  │    ├─ sessoes Map<id, SessaoSBTM>             │ │  │
│  │  │    └─ achados Map<id, Achado>                 │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          UTILITIES & CONFIGURATION                  │  │
│  │  ├─ JWT Utils (Sign, Verify, Decode)              │  │
│  │  ├─ Logger (Winston)                              │  │
│  │  ├─ Error Handler (AppError class)                │  │
│  │  ├─ Helpers (formatSuccess, formatError)          │  │
│  │  ├─ Validators (Joi schemas)                      │  │
│  │  └─ Config (Environment, Constants, Swagger)      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Padrão MVC (Model-View-Controller)

### Fluxo de Requisição

```
Cliente (Browser)
     ↓
[HTTP Request]
     ↓
Express App
     ↓
CORS Middleware ✓
     ↓
JSON Parser ✓
     ↓
Logger Middleware ✓
     ↓
Auth Middleware ✓ (valida JWT)
     ↓
Router (resolve rota)
     ↓
CONTROLLER
│ ├─ Valida entrada (validateBody)
│ ├─ Extrai userId de req.user
│ └─ Chama Service
│
SERVICE
│ ├─ Executa lógica de negócio
│ ├─ Acessa dados via MODEL
│ ├─ Lida com validações de regra
│ └─ Retorna resultado ou erro
│
MODEL (InMemoryStore)
│ ├─ GET/SET em Maps
│ ├─ Valida integridade de dados
│ └─ Retorna entidade
│
     ↑
[Resultado processado]
     ↓
RESPONSE Formatter
│ ├─ Sucesso: { success: true, data, timestamp }
│ └─ Erro: { success: false, error: { code, message, details } }
     ↓
[HTTP Response]
     ↓
Cliente (Browser)
```

---

## 3. Estrutura de Diretórios

```
heurify-backend/
│
├── 📋 Configuração
│   ├── package.json              (dependências e scripts)
│   ├── .env.example              (variáveis exemplo)
│   ├── .eslintrc.json            (linting rules)
│   ├── .prettierrc                (code formatting)
│   ├── .mocharc.json             (test configuration)
│   └── .gitignore                 (git ignore rules)
│
├── 📁 src/ (código-fonte)
│   │
│   ├── app.js                    (Express factory)
│   ├── server.js                 (Bootstrap HTTP server)
│   │
│   ├── 📁 config/                (configurações)
│   │   ├── env.js                 (variáveis ambiente)
│   │   ├── constants.js           (enums, constantes)
│   │   ├── error-codes.js        (códigos de erro padronizados)
│   │   └── swagger.js             (OpenAPI/Swagger config)
│   │
│   ├── 📁 middleware/            (middleware express)
│   │   ├── logger.middleware.js   (logging com Winston)
│   │   ├── validation.middleware.js (Joi validation)
│   │   ├── auth.middleware.js    (JWT validation + RBAC)
│   │   └── error-handler.middleware.js (erro handling)
│   │
│   ├── 📁 routes/                (rotas HTTP)
│   │   ├── auth.routes.js        (POST /auth/*, GET /auth/me)
│   │   ├── heuristicas.routes.js (CRUD heurísticas)
│   │   ├── charter.routes.js     (CRUD charters)
│   │   ├── sbtm.routes.js        (SBTM sessions + achados)
│   │   └── health.routes.js      (GET /health)
│   │
│   ├── 📁 controllers/           (handlers HTTP)
│   │   ├── auth.controller.js    (login, register, logout, me)
│   │   ├── heuristicas.controller.js
│   │   ├── charter.controller.js
│   │   ├── sbtm.controller.js
│   │   └── health.controller.js
│   │
│   ├── 📁 services/              (lógica de negócio)
│   │   ├── auth.service.js
│   │   ├── heuristicas.service.js
│   │   ├── charter.service.js
│   │   └── sbtm.service.js
│   │
│   ├── 📁 models/                (persistência de dados)
│   │   └── in-memory.store.js    (Store com 5 Maps)
│   │
│   ├── 📁 validators/            (schemas Joi)
│   │   ├── auth.validator.js
│   │   ├── heuristicas.validator.js
│   │   ├── charter.validator.js
│   │   └── sbtm.validator.js
│   │
│   └── 📁 utils/                 (funções auxiliares)
│       ├── logger.js             (Winston logger)
│       ├── jwt.utils.js          (sign, verify, decode)
│       ├── helpers.js            (formatSuccess, formatError)
│       └── error-handler.js      (AppError class)
│
├── 🧪 test/                      (testes)
│   ├── setup.js                  (configuração Mocha/Chai)
│   ├── 📁 unit/                  (testes unitários)
│   │   ├── auth.test.js
│   │   ├── heuristicas.test.js
│   │   ├── charter.test.js
│   │   └── sbtm.test.js
│   └── 📁 examples/
│       └── VADER_test_example.js (exemplos VADER)
│
├── 📚 docs/                      (documentação)
│   ├── QA_TEST_STRATEGY.md       (estratégia VADER)
│   ├── QUICK_START_TESTS.md      (quick start testes)
│   ├── TEST_PATTERNS_AND_BEST_PRACTICES.md
│   ├── TEST_IMPLEMENTATION_ROADMAP.md
│   └── VADER_COVERAGE_CHECKLIST.md
│
├── 📖 wiki/                      (wiki técnica)
│   ├── home.md
│   ├── Visao-Geral.md
│   ├── Arquitetura.md
│   ├── SPRINT_1.md, 2.md, 3.md
│   └── ... (outras páginas)
│
├── 📄 README.md                  (guia principal)
├── 📄 CHANGELOG.md               (histórico de mudanças)
└── 📄 SUMARIO_EXECUTIVO.md       (resumo executivo)
```

---

## 4. Fluxos de Dados

### Autenticação (Login)

```
POST /auth/login
├─ Payload: { email, password }
├─ Middleware: validation (Joi) → auth (skip, sem token ainda)
├─ Controller: validateBody → authService.login()
│
├─ Service:
│  ├─ Find user by email in store
│  ├─ Compare password (bcrypt in future)
│  ├─ JWT sign com payload { id, email, role }
│  └─ Return { user, token }
│
└─ Response: 200 + { success, data: { user, token } }
```

### CRUD Heurística (POST)

```
POST /heuristicas
├─ Payload: { title, description, technique, ... }
├─ Headers: { Authorization: "Bearer <jwt>" }
├─ Middleware: validation (Joi) → auth (valida JWT) ✓
├─ Controller: 
│  ├─ validateBody
│  ├─ req.user = { id, email, role } (do token)
│  └─ heuristicasService.criar(payload, userId)
│
├─ Service:
│  ├─ Valida regras de negócio
│  ├─ Gera UUID para ID
│  ├─ Cria entidade com metadados:
│  │  ├─ criadoPor: userId
│  │  ├─ criadoEm: timestamp ISO
│  │  ├─ status: "draft"
│  │  └─ versao: 1
│  ├─ Salva em store.heuristicas Map
│  └─ Retorna entidade criada
│
└─ Response: 201 + { success, data: { id, title, ... } }
```

### Sessão SBTM Completa

```
┌─────────────────────────────────────────┐
│ 1. POST /sessoes-sbtm                  │
│    └─ Cria session em-progresso        │
│       └─ Vinculada a charter           │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 2. Testador executa em paralelo        │
│    (sessão fica em-progresso)          │
│    ├─ Aplica heurísticas do charter   │
│    ├─ Encontra achados                │
│    └─ Testa funcionalidades            │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ 3. POST /sessoes-sbtm/:id/finalizar    │
│    ├─ Payload: { achados: [...] }     │
│    └─ Para cada achado:               │
│       ├─ Valida { titulo, descricao } │
│       ├─ Valida { severidade, tipo }  │
│       ├─ Cria Achado entity           │
│       └─ Salva em store.achados       │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ Session Status: em-progresso → finalizada
│ Response: 200 + { achados registrados }
└─────────────────────────────────────────┘
```

---

## 5. Decisões Arquiteturais

### ✅ Por que In-Memory Store no MVP?

| Aspecto | In-Memory | PostgreSQL |
|--------|-----------|-----------|
| Setup | ✓ Instant | ✗ Requer infra |
| Testes | ✓ Rápido | ✗ Flakiness |
| Deploy | ✓ Simples | ✗ Complexo |
| Dados | ✗ Perdidos restart | ✓ Persistem |
| Scale | ✗ Limitado | ✓ Escalável |

**Decisão:** In-Memory para MVP (v0.1), preparado para migração PostgreSQL.

**Migração futura:**
```javascript
// Hoje
const store = new InMemoryStore();

// Amanhã
const store = new PostgreSQLStore();
// Interface idêntica, implementação diferente
```

### ✅ Por que Joi para Validação?

- ✓ Schema declarativo
- ✓ Mensagens de erro detalhe
- ✓ Type coercion
- ✓ Comunidade ativa

### ✅ Por que JWT?

- ✓ Stateless (sem sessão)
- ✓ Standard (RFC 7519)
- ✓ Escalável (não precisa de sessão storage)
- ✓ Suporta roles para RBAC

### ✅ Por que Factory Pattern em app.js?

```javascript
// Permite testes sem side effects
const app = createApp();
const request = require('supertest')(app);
```

---

## 6. Camadas de Validação

```
┌──────────────────────────────────┐
│ 1. HTTP Validation               │
│    └─ Content-Type, method       │
└──────────────────────────────────┘
           ↓
┌──────────────────────────────────┐
│ 2. Schema Validation (Joi)       │
│    └─ Tipo, range, formato       │
└──────────────────────────────────┘
           ↓
┌──────────────────────────────────┐
│ 3. Business Logic Validation     │
│    └─ Regras domínio, refs exist │
└──────────────────────────────────┘
           ↓
┌──────────────────────────────────┐
│ 4. Error Handler                 │
│    └─ Resposta consistente       │
└──────────────────────────────────┘
```

---

## 7. Error Handling

```javascript
// Padrão AppError
class AppError extends Error {
  constructor(message, statusCode, errorCode, details) {
    this.statusCode = statusCode;
    this.errorCode = errorCode;     // Ex: "VALIDATION_ERROR"
    this.details = details;          // Array de erros específicos
  }
}

// Uso
throw new AppError('Title required', 400, 'VALIDATION_ERROR', [{
  field: 'title',
  message: 'Título é obrigatório'
}]);

// Resposta normalizada
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Title required',
    details: [{
      field: 'title',
      message: 'Título é obrigatório'
    }]
  }
}
```

---

## 8. Segurança

### Autenticação
- ✅ JWT com HS256
- ✅ Bearer token em header Authorization
- ✅ 24h expiration
- ✅ Stored in JWT_SECRET (env var)

### Validação
- ✅ Joi schemas rigorosos
- ✅ Type coercion controlada
- ✅ stripUnknown (campos extras ignorados)

### CORS
- ✅ Habilitado conforme config
- ✅ Whitelist de origens

### RBAC Base (Sprint 1)
- ✅ Roles: admin, editor, viewer
- ✅ Preparação para controle de acesso futuro

---

## 9. Performance

### Otimizações

- **In-memory Maps** → O(1) lookups by ID
- **Paginação** → limit/skip para grandes datasets
- **Query filters** → evita full-table scans (futuro: índices DB)
- **Logging estruturado** → Winston com níveis

### Targets

- Tempo médio response: < 100ms
- Throughput: > 1000 req/s (in-memory)
- CPU durante testes: < 50%

---

## 10. Extensibilidade

### Adicionar Novo Recurso

```
1. Criar validator em src/validators/novo.validator.js
2. Criar service em src/services/novo.service.js
3. Criar controller em src/controllers/novo.controller.js
4. Criar routes em src/routes/novo.routes.js
5. Adicionar métodos ao InMemoryStore
6. Escrever testes em test/unit/novo.test.js
7. Atualizar swagger.js
8. Atualizar README
```

Todos os layers seguem padrão consistente, facilitando adição.

---

## Links Relacionados

- [[Onboarding]] - Setup local
- [[Guia de Contribuição]] - Como adicionar features
- [[Integração com SBTM]] - Fluxo de sessões
- [[Heurísticas de VADER]] - Metodologia de testes
- [[Roadmap]] - Próximas arquiteturas

