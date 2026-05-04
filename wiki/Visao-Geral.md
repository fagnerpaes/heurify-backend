# 🎯 Visão Geral

**Bem-vindo ao Heurify!** Uma plataforma open source para gestão centralizada de heurísticas de teste.

---

## O que é Heurify?

Heurify é uma plataforma que centraliza, organiza e compartilha **heurísticas de teste** - regras de ouro, técnicas e boas práticas para testes exploratórios e garantia de qualidade.

### Problema que Resolve

- ❌ Heurísticas espalhadas em documentos isolados
- ❌ Conhecimento tácito perdido quando pessoas saem
- ❌ Dificuldade em descobrir técnicas aplicáveis
- ❌ Falta de rastreabilidade de testes exploratórios

### Solução Oferecida

- ✅ **Catálogo Centralizado** - Todas as heurísticas em um único lugar
- ✅ **Fácil Descoberta** - Busca avançada e filtros inteligentes
- ✅ **Integração com SBTM** - Uso direto em sessões de teste
- ✅ **Curadoria Comunitária** - Validação coletiva de boas práticas
- ✅ **Rastreabilidade** - Histórico e metadados de cada heurística

---

## Para Quem é Heurify?

### 🧪 Testadores e QAs

Você pratica testes exploratórios e quer:
- Descobrir novas técnicas baseadas em contexto
- Compartilhar descobertas com o time
- Manter histórico de técnicas testadas

**Exemplo de Uso:** Buscar heurísticas para "login" → Executar sessão SBTM → Registrar achados → Vincular à heurística usada

### 👥 Equipes Ágeis

Você valoriza:
- Conhecimento compartilhado
- Boas práticas documentadas
- Consistência na qualidade

**Benefício:** Base de conhecimento evolutiva, consultada por todos

### 🏆 Líderes de Qualidade

Você precisa:
- Visibilidade de técnicas utilizadas
- Curadoria de práticas melhores
- Dashboard de cobertura heurística

**Recurso:** Relatórios de cobertura por sessão/projeto/heurística

### 🚀 Contribuidores Open Source

Você quer:
- Contribuir com conhecimento
- Ajudar a comunidade QA
- Evoluir um projeto com propósito

**Caminho:** Fork → Adicione heurísticas → Pull Request

---

## Conceitos Principais

### 🔍 Heurística

**Definição:** Uma regra de ouro, técnica ou estratégia de teste que ajuda a encontrar bugs ou avaliar qualidade.

**Exemplo:** "Tente valores 0, -1, espaços em branco, ou muito grandes em campos numéricos"

**Metadados:**
- Título e descrição
- Técnica associada (ex: Exploratory Testing, SBTM)
- Exemplos de aplicação
- Status de curadoria (draft, reviewed, approved)
- Tags (ex: login, performance, segurança)

### 📋 Charter

**Definição:** Plano de sessão que especifica o que testar e que heurísticas aplicar em uma sessão exploratória.

**Componentes:**
- Título e objetivo
- Escopo (o que testar)
- Duração esperada
- Heurísticas a considerar
- Ambiente/versão

### 🎬 Sessão SBTM

**Definição:** Execução de um charter com tempo pré-definido, seguindo heurísticas.

**Saídas:**
- Achados (findings) categorizados
- Severidades registradas
- Tipos de issue (bug, melhoria, pergunta)
- Referência às heurísticas usadas

### 🐛 Achado

**Definição:** Observação ou problema encontrado durante uma sessão.

**Propriedades:**
- Título e descrição
- Severidade (crítico, alto, médio, baixo)
- Tipo (bug, melhoria, pergunta)
- Heurística que levou à descoberta
- Status de resolução

---

## Fluxo Típico de Uso

```
1️⃣ EXPLORAR HEURÍSTICAS
   └─ Buscar por contexto (ex: "login")
   └─ Filtrar por técnica (ex: "Exploratory Testing")

2️⃣ CRIAR CHARTER
   └─ Definir objetivo
   └─ Selecionar heurísticas aplicáveis
   └─ Especificar duração

3️⃣ EXECUTAR SESSÃO SBTM
   └─ Aplicar heurísticas no teste
   └─ Registrar achados conforme encontrados

4️⃣ FINALIZAR SESSÃO
   └─ Documentar achados formalmente
   └─ Vincular à heurística usada

5️⃣ ANALISAR DADOS
   └─ Ver cobertura heurística
   └─ Identificar técnicas mais efetivas
```

---

## Stack Tecnológico

### Backend (API)

- **Node.js 18+** - Runtime
- **Express.js 4.18+** - Framework web
- **JWT** - Autenticação segura
- **Joi** - Validação de dados
- **In-Memory Store** (MVP) - Persistência leve

**Preparado para:** PostgreSQL (migração futura)

### Frontend (Aplicação)

- **React 18+** - UI framework
- **TypeScript** - Type safety
- **Integração REST** - Comunicação com backend

### Documentação

- **GitHub Wiki** - Documentação técnica
- **Markdown** - Formato padrão
- **Swagger/OpenAPI** - API autodocumentada

---

## Roadmap de Evolução

### ✅ Fase 1: MVP (Maio 2026)

- Autenticação JWT
- CRUD de heurísticas
- Busca e filtros
- Sistema de Charter
- Sessões SBTM com achados

**Status:** ✅ **COMPLETO**

### 🔄 Fase 2: Curadoria (Junho 2026)

- Workflow de aprovação
- Curadores designados
- Versionamento de heurísticas
- Comentários comunitários

### 📊 Fase 3: Analytics (Julho 2026)

- Dashboard de cobertura
- Relatórios de heurísticas mais efetivas
- Integração com ferramentas de bug tracking

### 🤖 Fase 4: IA (Futuro)

- Sugestões de heurísticas por contexto
- Detecção de sobreposição
- Análise preditiva

**Detalhes:** Ver [[Roadmap]]

---

## Começar Agora

### Para Usuários
1. Leia [[Onboarding]]
2. Explore o catálogo de heurísticas
3. Crie seu primeiro charter
4. Execute uma sessão SBTM

### Para Desenvolvedores
1. Leia [[Arquitetura]]
2. Configure o ambiente ([Onboarding - Dev Setup](./Onboarding.md#dev-setup))
3. Explore o código em `src/`
4. Rode os testes: `npm test`

### Para Contribuidores
1. Leia [[Guia de Contribuição]]
2. Escolha uma heurística para compartilhar
3. Abra um Pull Request
4. Aguarde revisão da comunidade

---

## Princípios do Projeto

🤝 **Colaborativo** - Construído pela comunidade QA  
📚 **Educativo** - Documentação clara e exemplos práticos  
🔓 **Aberto** - Open source, código e conhecimento livres  
🎯 **Focado** - Resolvemos um problema bem definido  
⚡ **Rápido** - Implementação ágil de features  

---

## Governança

- **Licença:** MIT
- **Mantainer:** Comunidade open source
- **Contribuições:** Via GitHub Pull Requests
- **Código de Conduta:** [[Governança]]

---

## Links Rápidos

- **Repositório:** [github.com/heurify/heurify-backend](https://github.com/heurify/heurify-backend)
- **Issues:** [Rastreie tarefas](https://github.com/heurify/heurify-backend/issues)
- **Documentação API:** Ver Swagger em `/docs/api` após iniciar servidor
- **Comunidade:** Discussões em GitHub

---

## Dúvidas?

- **Técnicas:** Veja [[Heurísticas de VADER]]
- **Como Usar:** Veja [[Onboarding]]
- **Como Contribuir:** Veja [[Guia de Contribuição]]
- **Detalhes Arquitetura:** Veja [[Arquitetura]]

**Bem-vindo ao Heurify! 🚀**

