# 🎯 Heurify Backend

**RESTful API para gestão centralizada de heurísticas de teste, charters de SBTM e sessões exploratórias.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.18+-blue?style=flat-square&logo=express)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-MVP-orange?style=flat-square)](CHANGELOG.md)

---

## 📋 Índice

- [Descrição](#descrição)
- [Stack Tecnológica](#stack-tecnológica)
- [Pré-requisitos](#pré-requisitos)
- [Guia de Instalação](#guia-de-instalação)
- [Comandos de Execução](#comandos-de-execução)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Documentação da API](#documentação-da-api)
- [Testes](#testes)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## 📖 Descrição

O **Heurify Backend** é uma API RESTful desenvolvida em **Node.js/Express** que fornece:

### Funcionalidades Principais

✅ **Gestão de Heurísticas** - CRUD completo para catálogo de heurísticas de teste  
✅ **Autenticação JWT** - Sistema seguro de login/registro com roles (admin, editor, viewer)  
✅ **Geração de Charters** - Criação automática de charters para SBTM (Session-Based Test Management)  
✅ **Sessões SBTM** - Registro e gerenciamento de sessões exploratórias  
✅ **Registro de Achados** - Persistência de findings durante sessões  
✅ **Dashboard Analytics** - Endpoints para visualização de métricas e estatísticas  
✅ **Busca e Filtros** - Busca avançada com filtros por status, técnica e tags  
✅ **Preparação para Curadoria** - Metadados de status editorial para futuro workflow  

### Arquitetura

- **Persistência**: In-memory no MVP (preparado para migração para banco de dados)
- **Segurança**: Autenticação JWT, validação de payloads com Joi
- **Documentação**: Swagger/OpenAPI auto-gerada
- **Qualidade**: Testes unitários com Mocha/Chai, 80%+ coverage

---

## 🛠️ Stack Tecnológica

### Runtime e Framework

| Ferramenta | Versão | Propósito |
|-----------|--------|---------|
| **Node.js** | 18+ | Runtime JavaScript |
| **npm** | 9+ | Gerenciador de pacotes |

### Dependências Core

| Pacote | Versão | Propósito |
|--------|--------|---------|
| **express** | 4.18+ | Framework web |
| **jsonwebtoken** | 9.0+ | Autenticação JWT |
| **joi** | 17.9+ | Validação de schemas |
| **cors** | 2.8+ | CORS middleware |
| **swagger-ui-express** | 5.0+ | UI para documentação |
| **uuid** | 9.0+ | Geração de IDs únicos |
| **winston** | 3.8+ | Logging estruturado |

### Dependências de Desenvolvimento

| Pacote | Propósito |
|--------|---------|
| **mocha** | Framework de testes |
| **chai** | Assertion library |
| **sinon** | Mocking/stubbing |
| **supertest** | Testes HTTP |
| **eslint** | Linting |
| **prettier** | Code formatting |
| **nodemon** | Auto-reload em dev |

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se que possui instalado:

### Sistema

- **Node.js** ≥ 18.0.0  
  ```bash
  # Verificar versão
  node --version
  ```

- **npm** ≥ 9.0.0  
  ```bash
  # Verificar versão
  npm --version
  ```

- **Git** (para versionamento)  
  ```bash
  git --version
  ```

### Recomendações

- **VS Code** ou editor de sua preferência
- **Postman** ou **Insomnia** para testes de API
- **Docker** (opcional, para containerização)

---

## 🚀 Guia de Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/heurify-backend.git
cd heurify-backend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e ajuste as valores:

```bash
cp .env.example .env
```

**Arquivo `.env`:**

```env
# Server
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS
CORS_ORIGIN=http://localhost:3001

# Swagger
SWAGGER_HOST=localhost:3000
SWAGGER_SCHEMES=http
```

⚠️ **IMPORTANTE**: Em produção, substitua `JWT_SECRET` por uma chave forte e secreta!

### 4. Criar diretório de logs (opcional)

```bash
mkdir -p logs
```

---

## 🎮 Comandos de Execução

### Desenvolvimento

#### Iniciar servidor com auto-reload

```bash
npm run dev
```

O servidor estará disponível em **http://localhost:3000**  
Documentação Swagger em **http://localhost:3000/docs**

#### Lint do código

```bash
npm run lint
```

#### Formatar código com Prettier

```bash
npm run format
```

#### Verificar formatação

```bash
npm run format:check
```

### Testes

#### Executar testes unitários

```bash
npm test
```

#### Executar testes em modo watch

```bash
npm run test:watch
```

#### Gerar relatório de cobertura

```bash
npm run test:coverage
```

#### Executar testes de integração

```bash
npm run test:integration
```

### Produção

#### Iniciar servidor

```bash
npm start
```

#### Build (se aplicável)

```bash
npm run build
```

---

## 📁 Estrutura de Pastas

```
heurify-backend/
│
├── src/                          # Código-fonte da aplicação
│   ├── app.js                    # Factory da aplicação Express
│   ├── server.js                 # Bootstrap do servidor
│   │
│   ├── config/
│   │   ├── env.js                # Configurações de ambiente
│   │   ├── constants.js          # Constantes e enums
│   │   ├── swagger.js            # Configuração do Swagger/OpenAPI
│   │   └── jwt-config.js         # Configurações JWT
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js    # Validação de JWT
│   │   ├── validation.middleware.js
│   │   ├── logger.middleware.js
│   │   └── error-handler.middleware.js
│   │
│   ├── routes/
│   │   ├── health.routes.js
│   │   ├── auth.routes.js
│   │   ├── heuristicas.routes.js
│   │   ├── charter.routes.js
│   │   ├── sessoes-sbtm.routes.js
│   │   ├── achados.routes.js
│   │   └── dashboard.routes.js
│   │
│   ├── controllers/
│   │   ├── health.controller.js
│   │   ├── auth.controller.js
│   │   ├── heuristicas.controller.js
│   │   ├── charter.controller.js
│   │   ├── sessoes-sbtm.controller.js
│   │   ├── achados.controller.js
│   │   └── dashboard.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── heuristicas.service.js
│   │   ├── charter.service.js
│   │   ├── sessoes-sbtm.service.js
│   │   └── dashboard.service.js
│   │
│   ├── models/
│   │   └── in-memory.store.js    # Storage in-memory
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── heuristicas.validator.js
│   │   └── charter.validator.js
│   │
│   └── utils/
│       ├── logger.js
│       ├── jwt.utils.js
│       ├── helpers.js
│       ├── error-codes.js
│       └── error-handler.js
│
├── test/
│   ├── unit/
│   │   ├── health.test.js
│   │   ├── auth.test.js
│   │   ├── heuristicas.test.js
│   │   └── ...
│   ├── integration/
│   │   └── api.integration.test.js
│   ├── fixtures/
│   │   └── mock-data.js
│   └── setup.js                  # Setup para testes
│
├── docs/
│   ├── swagger.yaml
│   └── schemas/
│       ├── usuario.schema.yaml
│       └── heuristica.schema.yaml
│
├── .env.example                  # Template de variáveis
├── .eslintrc.json                # Configuração ESLint
├── .prettierrc                    # Configuração Prettier
├── .gitignore                     # Arquivos ignorados pelo Git
├── .mocharc.json                 # Configuração Mocha
├── package.json                  # Dependências e scripts
├── package-lock.json             # Lock de dependências
├── README.md                      # Este arquivo
├── CHANGELOG.md                   # Histórico de versões
└── LICENSE                        # Licença MIT
```

### Convenções de Pasta

- **config/**: Configurações globais
- **middleware/**: Middlewares Express
- **routes/**: Definição de rotas
- **controllers/**: Lógica de requisição
- **services/**: Lógica de negócio
- **models/**: Modelos de dados
- **validators/**: Schemas de validação
- **utils/**: Funções utilitárias
- **test/**: Testes automatizados

---

## 📚 Documentação da API

A documentação interativa da API está disponível em **http://localhost:3000/docs** quando o servidor está rodando.

### Exemplos de Requests

#### Health Check

```bash
curl -X GET http://localhost:3000/health
```

#### Register (Futuro)

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "nome": "John Doe"
  }'
```

#### Login (Futuro)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

---

## 🧪 Testes

### Executar Suite de Testes

```bash
npm test
```

### Exemplo de Saída

```
Health Controller
  GET /health
    ✓ should return 200 OK with health status
    ✓ should have valid timestamp format
    ✓ should have positive uptime
    ✓ should return memory usage information
  API Response Format
    ✓ should return consistent response structure
  Content-Type Headers
    ✓ should return JSON content type

Validation Middleware
  createValidator
    ✓ should pass valid data through
    ✓ should reject invalid email
    ✓ should reject when required field is missing
    ✓ should strip unknown fields
  createQueryValidator
    ✓ should validate query parameters

12 passing (150ms)
```

### Cobertura de Testes

```bash
npm run test:coverage
```

---

## 👥 Contribuição

Seguimos o padrão **GitFlow** para contribuições. Consulte a [Wiki de Fluxo de Trabalho](../../wiki/Fluxo-de-Trabalho) para detalhes.

### Passos para Contribuir

1. **Fork** o repositório
2. Crie uma branch feature (`git checkout -b feature/AmazingFeature`)
3. Faça commit de suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Padrões de Código

- Siga as regras do ESLint: `npm run lint`
- Formate o código com Prettier: `npm run format`
- Escreva testes para novas features
- Mantenha coverage acima de 80%

---

## 📖 Documentação Adicional

Consulte a [Wiki do Projeto](../../wiki) para:

- 🏗️ [Arquitetura e Decisões Técnicas](../../wiki/Arquitetura)
- 🎨 [Guia de Estilo e Clean Code](../../wiki/Guia-de-Estilo)
- 🔄 [Fluxo de Trabalho e CI/CD](../../wiki/Fluxo-de-Trabalho)
- 📊 [Matriz de Rastreabilidade](../../wiki/Rastreabilidade)
- 🐛 [Troubleshooting](../../wiki/Troubleshooting)
- 🔌 [Integração de APIs](../../wiki/Integrações)

---

## 🤝 Autores e Contribuidores

| Nome | Role | GitHub |
|------|------|--------|
| Heurify Team | Founder | [@heurify](https://github.com/heurify) |
| Seu Nome | Contributor | [@your-username](https://github.com/your-username) |

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 🤔 Suporte

- 📖 Abra uma [Issue](../../issues)
- 💬 Veja [Discussões](../../discussions)
- 📧 Contate-nos em: contact@heurify.dev

---

## 📌 Changelog

Consulte [CHANGELOG.md](CHANGELOG.md) para histórico de versões.

---

**Último atualizado:** 2 de maio de 2026  
**Versão:** 0.1.0 (MVP)

