# 🚀 Onboarding

Guia passo-a-passo para começar com Heurify, seja como usuário ou desenvolvedor.

---

## Para Usuários (QAs/Testadores)

### 1️⃣ Acessar a Plataforma

```
1. Acesse: https://heurify.app
2. Clique em "Registrar"
3. Preencha: Email, Nome, Senha (min 6 chars)
4. Confirme seu email
5. Faça login
```

### 2️⃣ Explorar o Catálogo

Na página **Catálogo**:

```
┌─────────────────────────────────┐
│ 🔍 Buscar                       │
│ ┌───────────────────────────┐  │
│ │ "login"                  │  │ Busca rápida
│ └───────────────────────────┘  │
│                                 │
│ 📊 Filtros                      │
│ ☐ Segurança     ☐ Performance   │
│ ☐ Usabilidade   ☐ Funcionalidade│
│ ☐ Dados                         │
│                                 │
│ 🏷️  Técnicas                    │
│ ☐ Exploratory Testing           │
│ ☐ Boundary Value Analysis       │
│ ☐ Session-Based Testing         │
│                                 │
│ 📑 Resultados                   │
│ ├─ Heurística 1 (Aprovada) ✅  │
│ ├─ Heurística 2 (Aprovada) ✅  │
│ └─ Heurística 3 (Draft) 📝     │
└─────────────────────────────────┘
```

### 3️⃣ Criar Seu Primeiro Charter

1. Clique em **+ Novo Charter**
2. Preencha:
   - **Título:** "Testes de Login - v1.0"
   - **Objetivo:** "Validar fluxo de autenticação"
   - **Escopo:** "Testes de login, registro, logout"
   - **Duração:** 60 minutos
3. Selecione heurísticas aplicáveis
4. Clique em **Criar**

```
Charter Criado ✅
ID: charter-abc123
Status: Planejado
Heurísticas: 5 selecionadas
```

### 4️⃣ Executar Uma Sessão SBTM

1. Clique no **Charter** criado
2. Clique em **+ Nova Sessão**
3. Preencha:
   - **Testador:** Seu nome
   - **Data/Hora:** Quando vai testar
4. Clique em **Iniciar**

Durante a sessão:
- Aplique as heurísticas do charter
- Teste a aplicação
- Registre qualquer achado/bug

### 5️⃣ Registrar Achados

Durante teste, clique em **+ Registrar Achado**:

```
┌─────────────────────────────┐
│ Título do Achado            │
│ ┌───────────────────────┐   │
│ │ "Login aceita null"   │   │
│ └───────────────────────┘   │
│                              │
│ Descrição                   │
│ ┌───────────────────────┐   │
│ │ Ao enviar email null,│   │
│ │ servidor retorna 200 │   │
│ │ em vez de erro       │   │
│ └───────────────────────┘   │
│                              │
│ Severidade: [Crítico ▼]     │
│ Tipo: [Bug ▼]               │
│ Heurística: [Boundary V ▼]  │
│                              │
│ [Registrar] [Cancelar]      │
└─────────────────────────────┘
```

### 6️⃣ Finalizar Sessão

1. Após testar por ~60 minutos, clique **Finalizar Sessão**
2. Sistema mostra:
   - Achados registrados
   - Heurísticas aplicadas
   - Duração real
3. Clique **Confirmar**

**Resultado:**
```
Sessão Finalizada ✅
Achados: 3
Heurísticas Aplicadas: 5
Duração: 62 minutos
```

---

## Para Desenvolvedores

### Setup Local

#### Pré-requisitos

```bash
# Verificar Node.js (≥18)
node --version

# Verificar npm (≥9)
npm --version

# Git
git --version
```

#### Instalação

```bash
# 1. Clonar repositório
git clone https://github.com/heurify/heurify-backend.git
cd heurify-backend

# 2. Instalar dependências
npm install

# 3. Setup variáveis de ambiente
cp .env.example .env

# 4. Editar .env (opcional para desenvolvimento local)
code .env
# Deixe valores padrão para dev local
```

#### Rodar o Servidor

```bash
# Desenvolvimento (com nodemon auto-reload)
npm run dev

# Produção
npm start

# Esperado:
# ✅ Server rodando em http://localhost:3000
# ✅ Documentação em http://localhost:3000/api-docs
```

#### Rodar Testes

```bash
# Suite completa
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:coverage

# Apenas um arquivo
npm test -- test/unit/auth.test.js

# Esperado:
# ✅ 59+ testes passando
# ✅ Coverage ≥80%
```

### Estrutura de Arquivos para Dev

```
heurify-backend/
├── src/
│   ├── app.js              👈 Express app factory
│   ├── server.js           👈 Starts server
│   ├── routes/             👈 HTTP routes
│   ├── controllers/        👈 Request handlers
│   ├── services/           👈 Business logic
│   ├── middleware/         👈 Express middleware
│   ├── models/             👈 Data persistence
│   ├── validators/         👈 Joi schemas
│   ├── config/             👈 Config files
│   └── utils/              👈 Helper functions
│
├── test/
│   ├── setup.js            👈 Test config
│   └── unit/               👈 Unit tests
│
├── docs/
│   └── QA_TEST_STRATEGY.md 👈 Test strategy
│
├── wiki/                   👈 Documentation
├── README.md               👈 Main guide
└── package.json            👈 Dependencies
```

### Primeiro Código: Adicionar Heurística

Vamos adicionar uma heurística ao catálogo!

#### 1. Entender o modelo

```javascript
// Uma heurística tem:
{
  id: "uuid",
  title: "Seu título",
  description: "Descrição completa",
  technique: "Exploratory Testing",
  tags: ["security", "testing"],
  status: "draft"
}
```

#### 2. Criar arquivo de teste

```bash
# test/unit/heuristicas.test.js

it('[V1] Deve criar heurística com dados válidos', async () => {
  const payload = {
    title: 'Teste Boundary Values',
    description: 'Validar valores limites em campos numéricos',
    technique: 'Boundary Value Analysis'
  };

  const res = await request(app)
    .post('/heuristicas')
    .set('Authorization', `Bearer ${authToken}`)
    .send(payload);

  expect(res.status).to.equal(201);
  expect(res.body.data.id).to.exist;
  expect(res.body.data.title).to.equal(payload.title);
});
```

#### 3. Rodar teste

```bash
npm test -- test/unit/heuristicas.test.js
```

✅ Se passar, você entendeu o fluxo!

### Estrutura de PR Primeira Feature

```
1. Fork repositório
2. git checkout -b feat/sua-feature
3. Faça as mudanças
4. npm test (validar testes passam)
5. Commit: git commit -m "feat: descrição"
6. Push: git push origin feat/sua-feature
7. Abra PR no GitHub
```

### Links Úteis para Devs

- **[[Arquitetura]]** - Design técnico
- **[[Guia de Contribuição]]** - PR workflow
- **Backend README:** `/README.md` (clique em "Desenvolvimento")
- **API Docs:** Acesse `http://localhost:3000/api-docs` após rodar

---

## Próximos Passos

### Usuários
1. ✅ Crie um charter
2. ✅ Execute uma sessão SBTM
3. ✅ Registre seus primeiros achados
4. 📖 Explore [[Taxonomia de Heurísticas]]
5. 📖 Aprenda [[Heurísticas de VADER]]
6. 📖 Leia [[Integração com SBTM]]

### Desenvolvedores
1. ✅ Configure ambiente local
2. ✅ Rode testes com sucesso
3. ✅ Leia [[Arquitetura]]
4. ✅ Leia [[Heurísticas de VADER]]
5. 📖 Contribua com heurística ou bug fix

---

## Links Relacionados

- [[Heurísticas de VADER]] - Metodologia de testes
- [[Integração com SBTM]] - Session-Based Test Management
- [[Taxonomia de Heurísticas]] - Catálogo de heurísticas
- [[Guia de Contribuição]] - Como contribuir

### "npm test" falha com error

```bash
# Solução 1: Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
npm test

# Solução 2: Verificar Node.js ≥18
node --version
```

### "Cannot find module" em imports

```bash
# Solução: Verificar caminhos relativos
# ✅ Correto: import { store } from '../../src/models/in-memory.store.js'
# ❌ Errado: import { store } from '../models/in-memory.store'
```

### Server falha em portar 3000

```bash
# Solução: Mudar porta em .env
PORT=3001
npm run dev
```

---

## Comunidade & Suporte

- **Issues:** [GitHub Issues](https://github.com/heurify/heurify-backend/issues)
- **Discussões:** [GitHub Discussions](https://github.com/heurify/heurify-backend/discussions)
- **Email:** support@heurify.org

**Bem-vindo! 🎉**

