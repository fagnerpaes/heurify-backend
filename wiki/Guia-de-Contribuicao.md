# 🤝 Guia de Contribuição

Obrigado por querer contribuir com o Heurify! Este guia explica como contribuir com código, documentação ou heurísticas.

---

## 1. Tipos de Contribuição

### 🐛 Bug Fix

Encontrou um erro? Abra uma issue descrevendo:
- Versão do projeto
- Passos para reproduzir
- Comportamento esperado vs. atual

### 📚 Documentação

Melhorar docs é tão importante quanto código! Pode ser:
- Erros na wiki
- Exemplos confusos
- Documentação faltante
- Typos

### ✨ Feature Nova

Quer adicionar funcionalidade? Discuta em uma **issue** primeiro:
- Descreva a feature
- Caso de uso
- Impacto no projeto

### 🔬 Heurística Nova

**Contribuição principal!** Ver [[#como-qas-e-testadores-podem-contribuir-adicionando-uma-heuristica]].

---

## 2. Fluxo de Trabalho GitFlow

### 1️⃣ Fork do Repositório

```bash
# No GitHub: clique em "Fork"
git clone https://github.com/seu-usuario/heurify-backend.git
cd heurify-backend
```

### 2️⃣ Criar Branch

```bash
# Para bug fix
git checkout -b fix/descricao-do-bug

# Para feature
git checkout -b feat/descricao-da-feature

# Para documentação
git checkout -b docs/descricao-da-doc

# Para heurística
git checkout -b heuristic/titulo-da-heuristica
```

### 3️⃣ Commit com Mensagem Clara

```bash
# Padrão: <tipo>: <descrição> (<escopo>)

git commit -m "feat: adicionar endpoint GET /health

- Endpoint monitora disponibilidade
- Retorna 200 com status
- Sem autenticação requerida"

# Tipos: feat, fix, docs, test, refactor, chore
```

### 4️⃣ Push e Pull Request

```bash
git push origin feat/sua-feature
```

Abra PR no GitHub com:
- **Título:** Descritivo
- **Descrição:** O que foi mudado e por quê
- **Linked Issues:** #123, #124
- **Checklist:** Testes rodaram, docs atualizadas

### 5️⃣ Revisão & Merge

- Responda aos comentários
- Faça ajustes solicitados
- Após aprovação: merge!

---

## 3. Padrões de Código

### TypeScript (quando aplicável)

```typescript
// ✅ Use tipos explícitos
function createHeuristica(data: CreateHeuristicaDTO): Promise<Heuristica> {
  return heuristicasService.criar(data);
}

// ❌ Evite any
function createHeuristica(data: any) {
  // ...
}
```

### Node.js/JavaScript

```javascript
// ✅ Use async/await
async function listarHeuristicas(filtros) {
  const heuristicas = await store.listar(filtros);
  return formatSuccess(heuristicas);
}

// ❌ Evite callbacks aninhados
store.listar(filtros, function(err, data) {
  // callback hell
});
```

### Naming Conventions

```javascript
// ✅ Nomes claros
const usuariosAtivos = usuarios.filter(u => u.ativo);
const validarEmail = (email) => { /* ... */ };

// ❌ Nomes genéricos
const users = usuarios.filter(u => u.a);
const v = (e) => { /* ... */ };
```

---

## 4. Testes

### Obrigação

Todo código novo **DEVE** ter testes:

```bash
# Rodar testes
npm test

# Testes com coverage
npm run test:coverage

# Apenas seu teste
npm test -- test/unit/seu-arquivo.test.js
```

### Padrão AAA (Arrange-Act-Assert)

```javascript
it('[V1] Deve criar heurística com dados válidos', async () => {
  // Arrange
  const payload = { title: 'Test', description: '...' };

  // Act
  const res = await request(app)
    .post('/heuristicas')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);

  // Assert
  expect(res.status).to.equal(201);
  expect(res.body.data.id).to.exist;
});
```

### Meta de Cobertura

- **Mínimo:** 80% cobertura geral
- **Controladores:** 90%
- **Services:** 85%

---

## 5. Como QAs e Testadores Podem Contribuir Adicionando uma Heurística

### 🎯 Objetivo

Compartilhar uma **técnica de teste** que você descobriu ser efetiva. Pode ser algo que você:
- Usa regularmente em seu trabalho
- Encontrou que reduz bugs
- Acha que a comunidade deveria conhecer

### 📋 Passo 1: Preparar a Heurística

Crie um arquivo `minha-heuristica.md` com:

```markdown
# Heurística: [Seu Título]

## Descrição
Explicação clara do que a heurística é e por que importa.

Exemplo: "Quando testando campos que aceitam números, é comum 
esquecer de validar valores negativos, muito grandes ou zero. 
Esta heurística ajuda a não perder esses casos."

## Técnica
Qual abordagem usa (escolha uma):
- Exploratory Testing
- Boundary Value Analysis
- Error Guessing
- Equivalence Partitioning
- State Transition
- Session-Based Testing
- User Story Testing

## Contexto de Aplicação
Onde essa heurística funciona melhor:
- [ ] Web
- [ ] Mobile
- [ ] API
- [ ] E-commerce
- [ ] SaaS
- [ ] Real-time

## Exemplos Práticos

**Exemplo 1:** Descrição clara
- Cenário: O que você está testando
- Ação: O que você faz
- Resultado Esperado: O que deveria acontecer
- Bugs Comuns: O que você encontrou

**Exemplo 2:** Outro cenário
- ...

## Nível de Dificuldade
- [ ] Iniciante
- [ ] Intermediário
- [ ] Avançado

## Ferramentas Recomendadas (opcional)
- BurpSuite
- Selenium
- Postman
- etc.

## Referências (opcional)
- Link 1: https://...
- Link 2: https://...

## Contribuidor
Seu nome/GitHub
```

### 📊 Exemplo Completo

```markdown
# Heurística: Teste Valores Boundary em Campos Numéricos

## Descrição
Quando um campo aceita números, é comum esquecer de testar valores 
nos limites: zero, negativo, muito grande. Esta heurística garante 
que você capture esses bugs comuns.

## Técnica
Boundary Value Analysis

## Contexto de Aplicação
- [x] Web
- [x] Mobile
- [x] API
- [ ] E-commerce
- [ ] SaaS
- [ ] Real-time

## Exemplos Práticos

**Exemplo 1: Campo de Quantidade em Carrinho**
- Cenário: Formulário que pede quantidade de itens
- Ação: Tente valores: -1, 0, 1, 99999999
- Resultado Esperado: Sistema rejeita -1, aceita 0-99999, rejeita > 99999
- Bugs Comuns: Aceita quantidades negativas, causes underflow

**Exemplo 2: Campo de Idade**
- Cenário: Formulário de cadastro de usuário
- Ação: Tente valores: -1, 0, 1, 150, 999
- Resultado Esperado: Rejeita menores de 18, maiores de 120
- Bugs Comuns: Backend valida, mas JS frontend não, permitindo submit

## Nível de Dificuldade
- [x] Iniciante
- [ ] Intermediário
- [ ] Avançado

## Ferramentas Recomendadas
- Browser DevTools (F12 → Console)
- Postman (para APIs)

## Referências
- [ISTQB: Boundary Value Analysis](https://www.istqb.org/)
- [James Whittaker's Heuristics](https://testingreflections.com/)

## Contribuidor
João Silva (@joaosilva-qa)
```

### 🚀 Passo 2: Criar Pull Request

```bash
# 1. Criar arquivo
git checkout -b heuristic/teste-boundary-values
cp minha-heuristica.md wiki/heuristicas/teste-boundary-values.md

# 2. Adicionar ao índice
# Edite wiki/heuristicas/INDEX.md e adicione link

# 3. Commit
git add wiki/heuristicas/teste-boundary-values.md
git commit -m "heuristic: adicionar 'Teste Boundary Values em Números'

- Heurística: Teste Valores Boundary
- Técnica: Boundary Value Analysis
- Contexto: Web, Mobile, API
- Exemplos: Quantidade, Idade, etc"

# 4. Push e PR
git push origin heuristic/teste-boundary-values
```

### ✅ Passo 3: Checklist para PR de Heurística

```markdown
## Checklist - Heurística Nova

- [ ] Título é claro e acionável
- [ ] Descrição explica por que importa
- [ ] Técnica é baseada em metodologia conhecida
- [ ] 2+ exemplos práticos e específicos
- [ ] Contexto(s) de aplicação marcados
- [ ] Nível de dificuldade indicado
- [ ] Sem duplicação com heurística existente
- [ ] Sem conteúdo ofensivo ou discriminatório
- [ ] Referências incluídas (se aplicável)
- [ ] Contribuidor identificado

### Descrição do PR

Esta heurística ajuda a testar [problema específico].

Baseada em [técnica], é aplicável a [contextos].

Inclui exemplos de [tipos de bugs encontrados].
```

### 💬 Passo 4: Responder Revisores

Revisores podem pedir:
- Mais exemplos
- Clareza na descrição
- Validação de nome
- Ajuste de contexto

**Seja responsivo!** Respostas rápidas aceleram aprovação.

### 🎉 Passo 5: Heurística Aprovada!

Após merge, sua heurística estará em [[Taxonomia de Heurísticas]] e disponível no catálogo.

---

## 6. Mergulhar no Código?

### Começar Pequeno

Ideias para primeiro PR:
- ✅ Typo na documentação
- ✅ Comentário melhor em função
- ✅ Novo teste unitário
- ✅ Validação melhorada

### Não Comece Com

- ❌ Refatorar arquitetura inteira
- ❌ Adicionar dependency nova sem discussão
- ❌ Mudar padrões estabelecidos

---

## 7. Checklist Geral de PR

```markdown
## Tipo de Contribuição
- [ ] Bug fix
- [ ] Feature nova
- [ ] Documentação
- [ ] Heurística
- [ ] Teste

## Checklist Técnico
- [ ] Código segue padrões do projeto
- [ ] Testes adicionados/atualizados
- [ ] Cobertura >= 80%
- [ ] Não há console.log() ou debugger
- [ ] ESLint passa sem warnings
- [ ] Commits com mensagens claras

## Checklist de Documentação
- [ ] README atualizado
- [ ] Wiki atualizada (se aplicável)
- [ ] JSDoc em funções novas
- [ ] CHANGELOG atualizado

## Checklist de Testing
- [ ] Testes locais passam: `npm test`
- [ ] Coverage mantido: `npm run test:coverage`
- [ ] Sem testes flaky
- [ ] Testado em ambiente similar ao produção

## Checklist Final
- [ ] Sem conflitos com main
- [ ] Linked a issues relacionadas
- [ ] Pronto para revisão!
```

---

## 8. Ferramentas e Setup

### Ambiente Local

```bash
# Clonar fork
git clone https://github.com/seu-usuario/heurify-backend.git
cd heurify-backend

# Instalar dependências
npm install

# Setup variáveis
cp .env.example .env

# Rodar testes
npm test

# Iniciar desenvolvimento
npm run dev
```

### Validação Antes de Push

```bash
# Linting
npm run lint

# Testes
npm test

# Coverage
npm run test:coverage

# Build (se existir)
npm run build
```

---

## 9. Código de Conduta

Contribuir com Heurify significa aceitar:

- 🤝 **Respeito:** Comunidade acolhedora
- 💬 **Feedback Construtivo:** Críticas educacionais
- ⚖️ **Inclusão:** Nenhuma discriminação
- 🔗 **Colaboração:** Queremos crescer juntos

**Violações:** Report em [contact@heurify.org](mailto:contact@heurify.org)

---

## 10. Dúvidas?

- **Sobre contribuição:** Abra uma [Discussion](https://github.com/heurify/heurify-backend/discussions)
- **Sobre heurísticas:** Veja [[Taxonomia de Heurísticas]] e [[Heurísticas de VADER]]
- **Sobre SBTM:** Veja [[Integração com SBTM]]
- **Sobre código:** Veja [[Arquitetura]]

**Obrigado por fazer parte do Heurify! 🚀**

