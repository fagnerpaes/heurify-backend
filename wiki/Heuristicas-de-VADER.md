# 🎯 Heurísticas de VADER

Metodologia VADER - A heurística fundamental do Heurify para testes sistemáticos.

---

## 1. O que é VADER?

VADER é uma **heurística meta** que ajuda a estruturar **outras heurísticas** de teste. Sigla em inglês:

```
V = Valid      → Cenários positivos, dados esperados
A = Anomalous  → Dados inesperados, edge cases
D = Data       → Validação de tipos, limites, obrigatoriedade
E = Error      → Violações de regras de negócio
R = Request    → Métodos HTTP, headers, autenticação
```

### Por que VADER?

- ✅ **Sistemático:** Não deixa passar cenários
- ✅ **Completo:** Cobre 5 dimensões diferentes
- ✅ **Prático:** Fácil de aplicar
- ✅ **Comprovado:** Usado por equipes de QA líderes

---

## 2. As 5 Dimensões

### ✅ VALID - Cenários Positivos

**Descrição:** Testa o "caminho feliz" com dados esperados.

**Objetivo:** Validar que funcionalidade funciona como designed.

**Exemplos:**

```
API POST /login
├─ Email: valid@example.com
├─ Password: securepass123
└─ Expected: 200 + token

Web Form
├─ Name: "João Silva"
├─ Email: "joao@example.com"
├─ Submit
└─ Expected: Form enviado, confirmação
```

**Perguntas:**
- Funcionalidade básica funciona?
- Dados válidos são aceitos?
- Response é correto?

---

### 🔀 ANOMALOUS - Dados Inesperados

**Descrição:** Testa com dados estranhos, incomuns ou edge cases.

**Objetivo:** Validar robustez, sem quebrar com surpresas.

**Exemplos:**

```
API campo email:
├─ user+tag@example.com (email com +)
├─ 名前@example.jp (caracteres não-ASCII)
└─ "quotes"@example.com (email com aspas)

Campo de array:
├─ Número vazio []
├─ Números mistos [1, "2", 3]
└─ Muito grande [1,2,3,...1000000]
```

**Perguntas:**
- Sistema aguenta dados estranhos?
- Como comporta com Unicode?
- E com estruturas misturadas?

---

### 📊 DATA - Validação de Limites e Tipos

**Descrição:** Testa limites de campos, tipos incorretos, obrigatoriedade.

**Objetivo:** Validar validação de entrada.

**Exemplos:**

```
String com min/max:
├─ Vazio: "" (< min)
├─ Mínimo: "ab" (2 chars, se min é 3)
├─ Máximo: "x"*201 (> 200 max)
└─ Normal: "João" (válido)

Número:
├─ Negativo: -1 (se não permitido)
├─ Zero: 0 (limite inferior)
├─ Muito grande: 999999999
└─ Decimal: 3.14 (se esperado integer)

Obrigatório:
├─ Omitido: { }
├─ Null: { field: null }
├─ Undefined: { field: undefined }
```

**Perguntas:**
- Valida tipos?
- Respeita limites?
- Rejeita campos obrigatórios faltando?

---

### ⚠️ ERROR - Regras de Negócio & Violations

**Descrição:** Testa violações de regras, conflitos, estado inválido.

**Objetivo:** Validar que sistema recusa operações inválidas.

**Exemplos:**

```
Autenticação:
├─ Senha errada: login falha
├─ Usuário não existe: login falha
├─ Token expirado: acesso negado

Regras de negócio:
├─ Deletar usuário com pedidos ativos: erro
├─ Transferir mais dinheiro que saldo: erro
├─ Agendar sem horas disponíveis: erro

Conflito de estado:
├─ Atualizar campo imutável (ID, criado em)
├─ Transição de estado não permitida
├─ Operação em recurso já deletado
```

**Perguntas:**
- Sistema rejeita operações inválidas?
- Mensagens de erro fazem sentido?
- Regras de negócio são enforçadas?

---

### 📞 REQUEST - HTTP, Headers, Autenticação

**Descrição:** Testa aspéctos do protocolo HTTP, métodos, headers, auth.

**Objetivo:** Validar que API é correcta em nível HTTP.

**Exemplos:**

```
Métodos HTTP:
├─ GET em endpoint POST: 405 Method Not Allowed
├─ DELETE em recurso read-only: 405
├─ PATCH não suportado: 405

Headers:
├─ Content-Type ausente: 415
├─ Authorization ausente: 401
├─ Authorization inválido: 401
├─ Authorization expirado: 401

Autenticação:
├─ Sem token: 401
├─ Token inválido: 401
├─ Token expirado: 401
├─ Token com role insuficiente: 403

Query params:
├─ Param inválido: ignorar ou 400
├─ Limit muito grande: limitar ou 400
├─ Skip negativo: rejeitar ou aceitar
```

**Perguntas:**
- Status codes estão corretos?
- Headers esperados presentes?
- Autenticação funciona?

---

## 3. Aplicando VADER a um Endpoint

### Exemplo: POST /heuristicas

#### ✅ VALID - Casos Positivos

```
it('[V1] Deve criar heurística com todos campos válidos → 201', () => {
  const payload = {
    title: 'Teste Boundary Values',
    description: 'Validar valores limites em campos numéricos',
    technique: 'Boundary Value Analysis',
    tags: ['numeric', 'boundary']
  };

  const res = request(app)
    .post('/heuristicas')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);

  expect(res.status).to.equal(201);
  expect(res.body.data.id).to.exist;
  expect(res.body.data.title).to.equal(payload.title);
});
```

#### 🔀 ANOMALOUS - Dados Inesperados

```
it('[A1] Deve aceitar titulo com acentos → 201', () => {
  const payload = {
    title: 'Tëst ñ @! #123',
    description: 'Descrição com caracteres especiais válidos',
    technique: 'Testing'
  };

  const res = request(app)
    .post('/heuristicas')
    .set('Authorization', `Bearer ${token}`)
    .send(payload);

  expect(res.status).to.equal(201);
  expect(res.body.data.title).to.include('ñ');
});
```

#### 📊 DATA - Limites e Tipos

```
it('[D1] Deve rejeitar title < 3 caracteres → 400', () => {
  const res = request(app)
    .post('/heuristicas')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'ab',  // 2 chars < 3 min
      description: 'Valid description with 10+ chars',
      technique: 'Testing'
    });

  expect(res.status).to.equal(400);
  expect(res.body.error.code).to.equal('VALIDATION_ERROR');
});

it('[D2] Deve rejeitar title > 200 caracteres → 400', () => {
  const res = request(app)
    .post('/heuristicas')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'x'.repeat(201),  // 201 chars > 200 max
      description: 'Valid description',
      technique: 'Testing'
    });

  expect(res.status).to.equal(400);
});
```

#### ⚠️ ERROR - Regras de Negócio

```
it('[E1] Deve rejeitar payload vazio → 400', () => {
  const res = request(app)
    .post('/heuristicas')
    .set('Authorization', `Bearer ${token}`)
    .send({});

  expect(res.status).to.equal(400);
  expect(res.body.error.code).to.equal('VALIDATION_ERROR');
});

it('[E2] Deve rejeitar campos extras → ignorar ou 400', () => {
  const res = request(app)
    .post('/heuristicas')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Valid',
      description: 'Valid description',
      technique: 'Testing',
      invalidField: 'should-be-ignored'
    });

  // Implementação decide: ignorar (201) ou rejeitar (400)
  expect([201, 400]).to.include(res.status);
});
```

#### 📞 REQUEST - HTTP/Auth

```
it('[R1] Deve rejeitar sem autenticação → 401', () => {
  const res = request(app)
    .post('/heuristicas')
    // Sem .set('Authorization', ...)
    .send({ title: 'Test', ... });

  expect(res.status).to.equal(401);
  expect(res.body.error.code).to.equal('UNAUTHORIZED');
});

it('[R2] Deve rejeitar método GET em POST → 405', () => {
  const res = request(app)
    .get('/heuristicas')  // GET não é para criar
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Test', ... });

  // GET /heuristicas é para listar, não criar
  // Mas se fosse POST que não existe:
  expect(res.status).to.equal(405);
});
```

---

## 4. Matriz VADER para Planejamento

### Template

| ID | Heurística | Categoria | Casos | Prioridade |
|----|-----------|-----------|-------|-----------|
| V1 | Dados válidos | Valid | 2 | P0 |
| A1 | Unicode/Acentos | Anomalous | 1 | P1 |
| A2 | Valores muito grandes | Anomalous | 1 | P1 |
| D1 | Min/max limites | Data | 2 | P0 |
| D2 | Tipo incorreto | Data | 1 | P0 |
| D3 | Obrigatório | Data | 1 | P0 |
| E1 | Negócio inválido | Error | 2 | P0 |
| R1 | Autenticação | Request | 1 | P0 |
| R2 | Método HTTP | Request | 1 | P1 |

**Total:** 12 casos de teste de VADER

---

## 5. Benefícios de Usar VADER

### ✅ Cobertura Completa

```
Sem VADER:
- Testa login funciona (V)
- Esquece edge cases
- Esquece autenticação falhando
- Coverage: 50%

Com VADER:
- V: Funciona (login OK)
- A: Dados estranhos (email+tag)
- D: Limites (password muito curta)
- E: Regras (senha errada)
- R: HTTP (sem token)
- Coverage: 95%+
```

### ✅ Menos Surpresas em Produção

```
Sem VADER: Bugs em produção:
- "Sistema aceita valores negativos"
- "Token expirado não é rejeitado"
- "Aceita email inválido"

Com VADER: Bugs encontrados em teste
```

### ✅ Testes Mais Organizados

```
Sem VADER:
- test1() ... valid case
- test2() ... another thing
- test3() ??? (qual categoria?)

Com VADER:
- [V1] Valid...
- [A1] Anomalous...
- [D1] Data...
- [E1] Error...
- [R1] Request...
← Claro o que cada um testa
```

---

## 6. VADER em Sprint QA

### Antes de Merge

```
PR Novo Endpoint
   ↓
Rodar testes
   ↓
[VADER Coverage Check]
├─ Testou V (Valid)? ✓
├─ Testou A (Anomalous)? ✓
├─ Testou D (Data)? ✓
├─ Testou E (Error)? ✓
├─ Testou R (Request)? ✓
   ↓
Aprovado para merge
```

### Antes de Deploy

```
Release Candidate
   ↓
[VADER Validation]
├─ Todos endpoints com 100% VADER?
├─ Coverage ≥ 80%?
├─ Nenhum flaky test?
   ↓
Deploy
```

---

## 7. Matriz de Criticidade VADER

| Dimensão | Criticidade | Impacto |
|----------|-----------|---------|
| **Valid** | 🔴 Crítico | Funcionalidade não funciona |
| **Anomalous** | 🟠 Alto | Dados estranhos quebram |
| **Data** | 🔴 Crítico | Validação falha |
| **Error** | 🔴 Crítico | Regras ignoradas |
| **Request** | 🟠 Alto | HTTP quebrado |

**Meta:** VADER 100% para P0, 80%+ para P1

---

## 8. Ferramentas para VADER

### Nativas
- Mocha/Jest (estrutura)
- Chai/Expect (assertions)
- Supertest (HTTP client)

### Recomendadas
- faker.js (dados anomalous)
- json-schema-faker (generate payloads)
- Artillery (performance testing)

---

## 9. VADER em Documentação

Documentar usando VADER:

```
# Heurística: Teste SBTM Timeout

## Descrição
Valida que sistema trata corretamente sesões que excedem tempo máximo.

## VADER

### ✅ Valid
- [ ] Sessão dentro do tempo límite funciona

### 🔀 Anomalous  
- [ ] Sessão com tempo muito grande (99999 min)

### 📊 Data
- [ ] Sessão com duração 0 minutos
- [ ] Sessão com duração negativa

### ⚠️ Error
- [ ] Sessão que expira no meio do teste
- [ ] Finalizar sessão expirada retorna erro

### 📞 Request
- [ ] Sem autenticação na finalização
```

---

## 10. Links Relacionados

- [[Taxonomia de Heurísticas]] - Categorias de heurísticas
- [[TEST_PATTERNS_AND_BEST_PRACTICES.md|Padrões de Teste]] - Como estruturar
- [[QA_TEST_STRATEGY.md|Estratégia QA]] - Completa com exemplos

**VADER: A heurística que torna testes sistemáticos. 🎯**

