# 🧪 Integração com SBTM

Session-Based Test Management (SBTM) no Heurify - Guia completo de configuração e uso.

---

## 1. O que é SBTM?

**Session-Based Test Management** é uma abordagem de teste **exploratório estruturado**:

- 🎯 **Objetivo Focado:** Cada sessão tem objetivo claro
- ⏱️ **Timebox:** Tempo pré-definido (30-120 min)
- 📋 **Charter:** Guia da sessão
- 🔍 **Exploração:** Testador experimenta livremente
- 📝 **Achados:** Registra bugs/issues encontrados
- 📊 **Rastreabilidade:** Todas ações documentadas

---

## 2. SBTM no Heurify

### Conceitos

```
Charter (Contrato)
   ├─ Objetivo da sessão
   ├─ Heurísticas a aplicar
   ├─ Escopo e limites
   └─ Duração

        ↓

Sessão SBTM
   ├─ Começa: timestamp
   ├─ Testador: quem executa
   ├─ Charter: qual contrato
   └─ Status: em-progresso

        ↓

Achados (Issues)
   ├─ Título do bug/issue
   ├─ Descrição detalhada
   ├─ Severidade (CRÍTICA, ALTA, MÉDIA, BAIXA)
   ├─ Tipo (BUG, MELHORIA, DÚVIDA)
   └─ Timestamp

        ↓

Finalização
   ├─ Data fim
   ├─ Total tempo
   ├─ Total achados
   └─ Status: finalizada
```

---

## 3. Workflow Completo: Passo a Passo

### Fase 1: Criar um Charter (Contrato)

**Antes de testar, defina o contrato:**

```bash
POST /charters
Authorization: Bearer {token}
Content-Type: application/json

{
  "titulo": "Testar CRUD de Heurísticas - Casos Positivos",
  "objetivo": "Validar que criar, ler, atualizar e deletar heurísticas funcionam com dados válidos",
  "escopo": "Endpoint /heuristicas com authenticated user",
  "duracao": 90,  // minutos
  "heuristicasIds": [
    "uuid-equivalence-partitioning",
    "uuid-boundary-value-analysis"
  ]
}

Response 201:
{
  "data": {
    "id": "charter-uuid-123",
    "titulo": "Testar CRUD de Heurísticas - Casos Positivos",
    "objetivo": "...",
    "status": "planejado",
    "criado_em": "2024-01-15T10:00:00Z",
    "criado_por": "user-uuid"
  }
}
```

**Charter Status:** `planejado` → `em-progresso` → `concluído`

---

### Fase 2: Criar Sessão SBTM

**Inicie uma sessão baseada no charter:**

```bash
POST /sessoes-sbtm
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "SBTM Session - CRUD Heurísticas (User 1)",
  "charterId": "charter-uuid-123",
  "testador": "João Silva",
  "dataInicio": "2024-01-15T10:05:00Z"
}

Response 201:
{
  "data": {
    "id": "sessao-uuid-456",
    "nome": "SBTM Session - CRUD Heurísticas (User 1)",
    "charterId": "charter-uuid-123",
    "testador": "João Silva",
    "status": "em-progresso",
    "dataInicio": "2024-01-15T10:05:00Z",
    "achados": []
  }
}
```

**Sessão Status:** `em-progresso` → `finalizada` → `analisada`

---

### Fase 3: Executar Testes (Sessão em Progresso)

Durante a sessão, testador **executa testes conforme charter** usando heurísticas:

```
Heurística: Equivalence Partitioning

Partições (técnica):
├─ Titles válidos (3-200 chars)
├─ Titles inválidos (< 3 ou > 200)
├─ Descriptions com edge cases
└─ Arrays vazio vs. preenchido

Execução:
1. POST /heuristicas
   ├─ Title: "Teste Particionamento"
   ├─ Description: "Descrição válida..."
   └─ ✓ PASS: 201 criado

2. POST /heuristicas
   ├─ Title: "ab"  (< 3)
   └─ ✗ FAIL: Expected 400, got 201 (BUG!)

3. Achado registrado ↓
```

---

### Fase 4: Registrar Achados (Issues Encontrados)

**Durante sessão, registre qualquer bug/issue/dúvida:**

#### Opção A: Dentro da sessão (realtime)

```bash
# Depois de encontrar bug durante teste
# (Futuro: adicionar achados enquanto em-progresso)

POST /sessoes-sbtm/{sessaoId}/achados
Authorization: Bearer {token}
Content-Type: application/json

{
  "titulo": "Título inválido não é rejeitado",
  "descricao": "POST /heuristicas aceita title com 2 caracteres quando mínimo é 3",
  "severidade": "ALTA",
  "tipo": "BUG",
  "detalhes": {
    "endpoint": "POST /heuristicas",
    "payload": { "title": "ab", "description": "..." },
    "esperado": "400 VALIDATION_ERROR",
    "obtido": "201 CREATED"
  }
}
```

#### Opção B: Ao finalizar sessão (batch)

Na finalização, registre lista de achados (veja Fase 5).

---

### Fase 5: Finalizar Sessão & Registrar Achados

**Ao completar timebox, finalize a sessão:**

```bash
POST /sessoes-sbtm/{sessao-uuid-456}/finalizar
Authorization: Bearer {token}
Content-Type: application/json

{
  "dataFim": "2024-01-15T11:35:00Z",  // 90 minutos depois
  "achados": [
    {
      "titulo": "Validação de título incompleta",
      "descricao": "Sistema aceita título com apenas 2 caracteres quando mínimo é 3",
      "severidade": "ALTA",
      "tipo": "BUG",
      "endpoint": "POST /heuristicas",
      "payload": { "title": "ab" }
    },
    {
      "titulo": "Mensagem de erro genérica",
      "descricao": "Erro 400 não especifica qual campo falhou na validação",
      "severidade": "MÉDIA",
      "tipo": "MELHORIA",
      "recomendacao": "Retornar array de erros por campo"
    },
    {
      "titulo": "Pagination inconsistente",
      "descricao": "GET /heuristicas retorna 'total', mas POST retorna 'count'",
      "severidade": "BAIXA",
      "tipo": "DÚVIDA",
      "detalhes": "Verificar se é intencional ou bug"
    }
  ]
}

Response 200:
{
  "data": {
    "id": "sessao-uuid-456",
    "status": "finalizada",
    "dataFim": "2024-01-15T11:35:00Z",
    "tempoTotal": 90,  // minutos
    "achadosRegistrados": 3,
    "severidades": {
      "CRITICA": 0,
      "ALTA": 1,
      "MEDIA": 1,
      "BAIXA": 1
    }
  }
}
```

---

## 4. Estrutura de Achados (Issues)

### Modelo de Achado

```javascript
{
  // Identificação
  id: "achado-uuid",
  sessaoId: "sessao-uuid",
  
  // Conteúdo
  titulo: "Descrição breve do achado",
  descricao: "Detalhes completos, passos para reproduzir",
  
  // Classificação
  severidade: "CRÍTICA" | "ALTA" | "MÉDIA" | "BAIXA",
  tipo: "BUG" | "MELHORIA" | "DÚVIDA",
  
  // Contexto
  endpoint: "POST /heuristicas",
  heuristicaAplicada: "Equivalence Partitioning",
  testador: "João Silva",
  
  // Rastreabilidade
  criado_em: "2024-01-15T10:15:00Z",
  status: "novo" | "triado" | "em-progresso" | "resolvido"
}
```

### Severidades

```
🔴 CRÍTICA
   └─ Sistema está indisponível
   └─ Funcionalidade core não funciona
   └─ Exemplo: POST /heuristicas retorna erro 500 em 100% casos

🟠 ALTA
   └─ Funcionalidade não funciona como esperado
   └─ Impacto direto no usuário
   └─ Exemplo: Validação não rejeita dados inválidos

🟡 MÉDIA
   └─ Inconsistência ou UX ruim
   └─ Afeta alguns casos
   └─ Exemplo: Mensagem de erro genérica

🟢 BAIXA
   └─ Dúvidas, melhorias, clarificações
   └─ Sem impacto funcional
   └─ Exemplo: Nomes de campos inconsistentes
```

### Tipos

```
🐛 BUG
   └─ Código está quebrado, comportamento não esperado
   └─ Exemplo: Rejeita dados válidos

✨ MELHORIA
   └─ Funcionamento está correto, mas pode melhorar
   └─ Exemplo: Adicionar paginação maior

❓ DÚVIDA
   └─ Comportamento não está claro
   └─ Exemplo: Qual campo é obrigatório?
```

---

## 5. Integração com Heurísticas

### Como Referenciar Heurísticas no Charter

```
Charter: "Testar CRUD com Equivalence Partitioning e Boundary Value"

Heurísticas Selecionadas:
├─ ID: uuid-equivalence-partitioning
│  ├─ Título: Equivalence Partitioning
│  ├─ Descrição: Dividir dados em partições equivalentes
│  ├─ Técnica: Partição
│  └─ Tags: [técnica-formal, caixa-preta]
│
├─ ID: uuid-boundary-value-analysis
│  ├─ Título: Boundary Value Analysis
│  ├─ Descrição: Testar limites de valores
│  ├─ Técnica: Valores Limites
│  └─ Tags: [técnica-formal, caixa-preta]
└─ ...
```

### Rastreamento Heurística → Achado

```
Achado registrado:
├─ Heurística Aplicada: "Equivalence Partitioning"
├─ Título: "Partição 'inválido' não é rejeitada"
├─ Descrição: "Title com 2 chars deveria estar em partição inválida"
└─ Ligação: Charter → Heurísticas → Achados
```

---

## 6. Workflow de Análise Pós-Sessão

### Após Finalizar Sessão

```
Sessão Finalizada (Status: finalizada)
        ↓
[QA Lead Review]
├─ Achados classificados corretamente?
├─ Severidade apropriada?
├─ Detalhes suficientes para reproduzir?
        ↓
Triagem (Status: triado)
├─ 🔴 CRÍTICA → Dev imediato
├─ 🟠 ALTA → Sprint atual
├─ 🟡 MÉDIA → Backlog
├─ 🟢 BAIXA → Documentação
        ↓
Developers Implementam Fix
        ↓
QA Valida Fix (Regress)
        ↓
Achado Resolvido (Status: resolvido)
```

---

## 7. Estatísticas & Relatórios

### Métricas por Sessão

```bash
GET /sessoes-sbtm/{id}/estatisticas

Response:
{
  "sessao": {
    "id": "sessao-uuid",
    "nome": "...",
    "dataInicio": "2024-01-15T10:05:00Z",
    "dataFim": "2024-01-15T11:35:00Z",
    "tempoTotal": 90,  // minutos
    "testador": "João Silva"
  },
  "achados": {
    "total": 12,
    "porSeveridade": {
      "CRITICA": 1,
      "ALTA": 3,
      "MEDIA": 5,
      "BAIXA": 3
    },
    "porTipo": {
      "BUG": 7,
      "MELHORIA": 3,
      "DUVIDA": 2
    }
  },
  "produtividade": {
    "achadosPorHora": 8,  // total / tempo em horas
    "achadosCriticos": 1,
    "riscoPorcentagem": 8  // crítica+alta / total
  }
}
```

### Relatório por Charter

```bash
GET /charters/{id}/estatisticas

Response:
{
  "charter": {
    "id": "charter-uuid",
    "titulo": "...",
    "heuristicasUsadas": 3
  },
  "sessoes": {
    "total": 5,
    "concluidas": 4,
    "emProgresso": 1,
    "tempoTotal": 450  // minutos
  },
  "achados": {
    "total": 42,
    "critica": 2,
    "alta": 8,
    "media": 20,
    "baixa": 12,
    "porHeuristica": {
      "Equivalence Partitioning": 15,
      "Boundary Value Analysis": 18,
      "State Transitions": 9
    }
  }
}
```

---

## 8. Endpoints de SBTM

### Charter Endpoints

```
POST   /charters                    # Criar novo charter
GET    /charters                    # Listar charters
GET    /charters/{id}               # Obter charter
PUT    /charters/{id}               # Atualizar charter
DELETE /charters/{id}               # Deletar charter (se sem sessões)
GET    /charters/stats/estatisticas # Estatísticas gerais
```

### Sessão SBTM Endpoints

```
POST   /sessoes-sbtm                    # Criar nova sessão
GET    /sessoes-sbtm                    # Listar sessões
GET    /sessoes-sbtm/{id}               # Obter sessão
PUT    /sessoes-sbtm/{id}               # Atualizar sessão
POST   /sessoes-sbtm/{id}/finalizar     # Finalizar e registrar achados
DELETE /sessoes-sbtm/{id}               # Deletar sessão (se em-progresso)
GET    /sessoes-sbtm/stats/estatisticas # Estatísticas gerais
```

### Achados Endpoints

```
GET /achados                  # Listar todos achados
GET /achados/{id}             # Obter achado específico
PUT /achados/{id}             # Atualizar status/classificação
GET /achados/criticos         # Listar apenas críticos
GET /achados/stats/resumo     # Estatísticas rápidas
```

---

## 9. Estados e Transições

### Estados de Charter

```
planejado
    ↓
em-progresso  ← Quando primeira sessão inicia
    ↓
concluído     ← Quando todas sessões finalizadas
    ↓
arquivado     ← Opcional, manual
```

### Estados de Sessão

```
em-progresso
    ↓ [POST /finalizar com achados]
finalizada
    ↓ [QA Lead triagem]
triada
    ↓ [Dev implementa fixes]
analisada
```

### Estados de Achado

```
novo
    ↓ [QA triage]
triado
    ↓ [Dev atribui a si]
em-progresso
    ↓ [Dev faz fix]
resolvido
    ↓ [QA valida]
fechado
```

---

## 10. Exemplo Completo: Fluxo Real

### Dia 1: Planejamento

```
1. QA Lead cria Charter
   POST /charters
   ├─ Título: "Sprint 1 - Validação de Entrada"
   ├─ Heurísticas: Equivalence, Boundary, State Transitions
   └─ Duração: 8h (480 min)

2. Sessões agendadas
   ├─ João Silva: Segunda 09:00-11:30 (150 min)
   ├─ Maria Santos: Terça 09:00-12:00 (180 min)
   └─ Carlos Gomes: Quarta 14:00-16:00 (120 min)
```

### Dia 2: Sessão João Silva

```
10. POST /sessoes-sbtm
    ├─ Nome: "SBTM - Validação (João)"
    ├─ Status: em-progresso
    └─ DataInicio: 2024-01-15T09:00:00Z

11. João executa testes durante 150 minutos
    ├─ Teste 1: POST /heuristicas com title válido
    ├─ Teste 2: POST /heuristicas com title muito curto
    ├─ Teste 3: ... (50+ testes)
    └─ Encontra 8 issues

12. POST /sessoes-sbtm/{id}/finalizar
    ├─ DataFim: 2024-01-15T11:30:00Z
    ├─ Achados: 8 issues (1 CRÍTICA, 2 ALTA, 3 MÉDIA, 2 BAIXA)
    └─ Status: finalizada
```

### Dia 3: Sessão Maria Santos

```
13. POST /sessoes-sbtm (nova sessão)
    └─ Repete padrão, encontra 12 issues
```

### Dia 4: Sessão Carlos Gomes

```
14. POST /sessoes-sbtm (nova sessão)
    └─ Repete padrão, encontra 5 issues
```

### Dia 5: Triagem & Análise

```
15. GET /charters/{id}/estatisticas
    └─ Total achados: 25
    └─ Distribuição:
        ├─ CRÍTICA: 1 (4%)
        ├─ ALTA: 5 (20%)
        ├─ MÉDIA: 12 (48%)
        └─ BAIXA: 7 (28%)

16. QA Lead tria achados
    ├─ Prioridade 1: 1 CRÍTICA + 5 ALTA = 6 issues
    ├─ Prioridade 2: 12 MÉDIA = 12 issues
    └─ Prioridade 3: 7 BAIXA = 7 issues

17. Developer Sprint Atualizado
    ├─ Sprint Atual: Adiciona 6 issues P1
    ├─ Próximo Sprint: 12 issues P2
    └─ Backlog: 7 issues P3
```

---

## 11. Boas Práticas SBTM + Heurify

### ✅ DO's

```
✓ Criar Charter claro e específico
  └─ Objetivo: "Testar CRUD..."
  └─ Escopo: "Apenas endpoints com auth"
  └─ Duração: 90 minutos (razoável)

✓ Referenciar heurísticas corretas
  └─ Charter linkedto 2-4 heurísticas
  └─ Testador sabe qual técnica usar

✓ Registrar achados detalhados
  └─ Título: "Validação inválida"
  └─ Descrição: Passos exatos para reproduzir
  └─ Severidade: Baseada em impacto

✓ Sessões de tempo fixo
  └─ 90-120 minutos ideal
  └─ Mais vs. muito longo = cansaço

✓ Múltiplas sessões por Charter
  └─ Diferentes testadores = diferentes perspectivas
  └─ Total 6-8 horas cobertura
```

### ❌ DON'Ts

```
✗ Charter vago
  └─ "Testar tudo" (muito amplo)
  └─ Sem objetivo claro

✗ Sessões muito longas
  └─ > 4 horas = fadiga do testador
  └─ Qualidade cai

✗ Ignorar severidade
  └─ Todos "ALTA" = perda de prioridade
  └─ Classificar corretamente

✗ Charter sem heurísticas
  └─ Testador não sabe por onde começar
  └─ Cobertura inconsistente

✗ Não finalizar sessões
  └─ Achados não registrados = perdidos
  └─ Sempre finalizar (mesmo sem bugs)
```

---

## 12. Links Relacionados

- [[Heurísticas de VADER]] - Técnicas de teste aplicadas
- [[Taxonomia de Heurísticas]] - Catálogo disponível
- [[Guia de Contribuição]] - Como contribuir heurísticas
- [[SPRINT_3.md|Sprint 3]] - Implementação de SBTM

---

## 13. Suporte & FAQ

### P: Como faço para ver todos os achados de um Charter?

R: Use `/charters/{id}/estatisticas` para resumo, depois itere por sessões com `/sessoes-sbtm?charterId={id}`

### P: Posso atualizar um achado depois de finalizado?

R: Sim, use `PUT /achados/{id}` para atualizar status ou descrição.

### P: E se precisar mudar Charter de uma Sessão?

R: Sessões são imutáveis post-criação. Cancele e crie nova.

### P: Qual é a melhor duração para Charter?

R: 2-4 horas total (2-4 sessões de 90 minutos). Menos = superficial, Mais = redundante.

---

**SBTM no Heurify: Testes Exploratórios Estruturados, Rastreáveis e Impactantes. 🧪**

