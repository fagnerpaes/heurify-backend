# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/) e este projeto segue [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [0.1.0] - 2026-05-02 (MVP Release)

### Adicionado

#### Sprint 0 - Infraestrutura Base

- ✅ Endpoint GET `/health` para monitoramento de disponibilidade
- ✅ Validação robusta de payloads com Joi
- ✅ Documentação Swagger/OpenAPI auto-gerada em `/docs`
- ✅ Middleware de logging estruturado com Winston
- ✅ Tratamento centralizado de erros com error codes específicos
- ✅ Middleware de autenticação JWT
- ✅ Configurações de ambiente com dotenv
- ✅ ESLint + Prettier para code quality
- ✅ Testes unitários com Mocha/Chai
- ✅ In-Memory Store para MVP
- ✅ Estrutura modular MVC (Routes/Controllers/Services/Models)

#### Sprint 1 - Autenticação (Planejado)

- 🔲 Endpoints POST `/auth/login` e `/auth/register`
- 🔲 Geração e validação de JWT tokens
- 🔲 Middleware de autorização por role (admin, editor, viewer)
- 🔲 Base para RBAC futuro

#### Sprint 2 - CRUD Heurísticas (Planejado)

- 🔲 Endpoints CRUD `/heuristicas` (POST, GET, PUT, DELETE)
- 🔲 Busca e filtros em GET `/heuristicas?search=&filter=`
- 🔲 Metadados de status editorial (draft, reviewed, approved)
- 🔲 Suporte a tags e técnicas

#### Sprint 3 - Charter & SBTM (Planejado)

- 🔲 Endpoint POST `/charter/{heuristicaId}` para geração automática
- 🔲 CRUD de sessões SBTM em `/sessoes-sbtm`
- 🔲 Registro de achados em `/sessoes-sbtm/{id}/achados`

#### Sprint 4 - Dashboard (Planejado)

- 🔲 Endpoint GET `/dashboard` com estatísticas agregadas
- 🔲 Métricas de heurísticas criadas
- 🔲 Contagem de sessões recentes

### Mudanças

- Estrutura inicial do projeto Node.js/Express
- Configuração de build, testes e linting
- Documentação README.md profissional

### Dependências Adicionadas

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2",
    "joi": "^17.11.0",
    "uuid": "^9.0.1",
    "swagger-ui-express": "^5.0.0",
    "swagger-jsdoc": "^6.2.8",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "mocha": "^10.2.0",
    "chai": "^4.3.10",
    "sinon": "^17.0.1",
    "supertest": "^6.3.3",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0",
    "nodemon": "^3.0.2"
  }
}
```

### Arquivos Criados

```
✅ src/
   ├── app.js
   ├── server.js
   ├── config/ (env, constants, swagger, error-codes)
   ├── middleware/ (logger, validation, auth, error-handler)
   ├── routes/ (health)
   ├── controllers/ (health)
   ├── services/ (placeholder)
   ├── models/ (in-memory.store)
   ├── utils/ (logger, jwt.utils, helpers, error-handler)
   └── validators/ (placeholder)

✅ test/
   ├── unit/ (health.test.js, validation.test.js)
   ├── setup.js
   └── fixtures/ (placeholder)

✅ docs/
   ├── swagger.yaml (gerado por swagger-jsdoc)
   └── wiki/ (Arquitetura, Guia-de-Estilo, Fluxo-de-Trabalho, etc)

✅ .env.example
✅ .eslintrc.json
✅ .prettierrc
✅ .gitignore
✅ .mocharc.json
✅ package.json
✅ README.md
✅ CHANGELOG.md (este arquivo)
```

---

## [0.2.0] - 2026-05-15 (Sprint 1+2 - Auth & CRUD)

### Planejado

#### Sprint 1

- [ ] Issue #4: JWT Authentication (login/register)
- [ ] Issue #8: RBAC Base Structure

#### Sprint 2

- [ ] Issue #5: CRUD Heurísticas
- [ ] Issue #6: Busca e Filtros
- [ ] Issue #7: Metadados de Curadoria

### Objetivos

- [ ] Autenticação funcional com JWT
- [ ] CRUD completo de heurísticas
- [ ] Suporte a busca e filtros
- [ ] Test coverage > 85%
- [ ] Documentação Swagger atualizada

---

## [0.3.0] - 2026-06-01 (Sprint 3 - Charter & SBTM)

### Planejado

- [ ] Issue #9: Geração de Charter
- [ ] Issue #10: Sessões SBTM
- [ ] Issue #11: Registro de Achados

### Objetivos

- [ ] Fluxo completo de SBTM funcional
- [ ] Geração automática de charters
- [ ] Persistência de sessões e achados

---

## [0.4.0] - 2026-06-15 (Sprint 4 - Dashboard)

### Planejado

- [ ] Issue #12: Dashboard Endpoints

### Objetivos

- [ ] Endpoints de analytics
- [ ] Estatísticas agregadas em tempo real

---

## [1.0.0] - 2026-07-01 (Curadoria & RBAC)

### Planejado

- [ ] Migração para PostgreSQL
- [ ] Implementação de RBAC completo
- [ ] Sistema de curadoria com aprovação
- [ ] Refresh tokens
- [ ] Rate limiting

### Objetivos

- [ ] MVP completo em produção
- [ ] Base para escalabilidade
- [ ] Testes de load
- [ ] Documentação completa

---

## [Unreleased]

### Em Desenvolvimento

- Nada no momento

### Planejado Futuro

- Integração com serviço de email
- Suporte a exportação de dados (CSV, PDF)
- API de integração com ferramentas de teste
- Mobile app
- Analytics dashboard avançado
- Versionamento de heurísticas
- Sistema de comentários e discussão
- Notificações em tempo real

---

## Convenções de Versionamento

Este projeto segue **Semantic Versioning**:

- **MAJOR**: Breaking changes na API
- **MINOR**: Nova funcionalidade compatível
- **PATCH**: Correção de bugs

Exemplos:
- `v0.1.0` → `v0.2.0`: Nova feature (MINOR)
- `v0.2.0` → `v0.2.1`: Bugfix (PATCH)
- `v0.2.1` → `v1.0.0`: Breaking change (MAJOR)

---

## Como Contribuir

1. Consulte [CONTRIBUTING.md](CONTRIBUTING.md)
2. Siga as convenções em [Wiki: Fluxo de Trabalho](../../wiki/Fluxo-de-Trabalho)
3. Atualize este CHANGELOG com suas mudanças

---

## Dúvidas?

- 📖 Consulte [Wiki do Projeto](../../wiki)
- 🐛 Abra uma [Issue](../../issues)
- 💬 Participe de [Discussões](../../discussions)

