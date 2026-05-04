# 🏛️ Governança

Estrutura, código de conduta e diretrizes da comunidade Heurify.

---

## 1. Estrutura de Governança

```
┌─────────────────────────────┐
│  Comunidade Heurify         │
│  (Todos os usuários)        │
└────────────┬────────────────┘
             │
      ┌──────┴──────┐
      │             │
┌─────▼─────┐  ┌───▼──────┐
│ Contadores│  │ Curadores│
│(Revisores)│  │(Aprovam) │
└─────┬─────┘  └───┬──────┘
      │            │
      └──────┬─────┘
             │
      ┌──────▼──────┐
      │ Mantainer   │
      │ (Admin)     │
      └─────────────┘
```

### Papéis

| Papel | Permissões | Responsabilidades |
|-------|-----------|-------------------|
| **Usuário** | Usar plataforma, comentar | Respeito, qualidade |
| **Contribuidor** | Abrir PRs, propor features | Testes, documentação |
| **Contador** | Revisar PRs, comenários | Feedback qualidade |
| **Curador** | Aprovar heurísticas | Validar relevância |
| **Mantainer** | Merge, deploy, admin | Visão estratégica |

---

## 2. Código de Conduta

### Nossa Visão

Heurify é uma comunidade inclusiva, respeitosa e colaborativa dedicada ao avanço da qualidade de software através do conhecimento compartilhado.

### 📋 Princípios

#### 🤝 Respeito e Inclusão

- Tratamos todos com dignidade
- Nenhuma discriminação por: raça, gênero, orientação, religião, habilidade
- Valorizamos perspectivas diversas
- Criamos espaço seguro para aprendizado

#### 💬 Comunicação Construtiva

- Oferecemos feedback educacional, não crítico pessoal
- Escutamos com genuína curiosidade
- Discordamos com respeito
- Evitamos linguagem ofensiva ou provocadora

#### 🔧 Colaboração Honesta

- Somos honestos sobre limitações
- Reconhecemos contribuições
- Trabalhamos juntos para resolver conflitos
- Não toleramos comportamento tóxico

#### 📚 Educação Contínua

- Assumimos que ninguém é perfeito
- Encorajamos crescimento e aprendizado
- Explicamos decisões de forma educacional
- Valorizamos perguntas ingênuas

### ❌ Comportamentos Não Tolerados

- Assédio de qualquer tipo
- Linguagem discriminatória ou ofensiva
- Intimidação ou bullying
- Spam ou conteúdo malicioso
- Violação de privacidade
- Comportamento sexual inapropriado

### 🔴 Consequências de Violação

**Nível 1:** Aviso privado e educação  
**Nível 2:** Ban temporário (7-30 dias)  
**Nível 3:** Ban permanente

### 📧 Reportar Violação

**Email:** [conduct@heurify.org](mailto:conduct@heurify.org)  
**Confidencial:** Apenas mantainers receberão relatório  
**Resposta:** Dentro de 48-72 horas

---

## 3. Diretrizes para Contribuições

### Standards de Qualidade

| Aspecto | Standard | Como Validar |
|---------|----------|-------------|
| **Código** | ESLint + Prettier passando | `npm run lint` |
| **Testes** | Coverage ≥ 80% | `npm run test:coverage` |
| **Documentação** | README atualizado | Revisor valida |
| **Commit** | Mensagens claras | Revisor valida |
| **Performance** | Response < 100ms | Load test |
| **Segurança** | Sem secrets em código | Secret scanner |

### Processo de Revisão

```
PR Aberta
   ↓
[Validação Automática - CI/CD]
├─ ESLint ✓
├─ Tests ✓
├─ Coverage ≥ 80% ✓
└─ Build ✓
   ↓
[Revisão Manual]
├─ Código (1+ Contador)
├─ Testes (QA)
├─ Documentação (Tech Writer)
└─ Aprovação final (Maintainer)
   ↓
Merge + Deploy
```

### SLA para Revisão

- **Small PR (<100 linhas):** 24-48 horas
- **Medium PR (100-500):** 2-3 dias
- **Large PR (>500):** 3-5 dias

---

## 4. Decisões & Votação

### Decisões Grandes (RFC)

Mudanças arquiteturais ou breaking changes requerem **Request for Comments (RFC)**:

1. Abra issue com `rfc` label
2. Descreva: Problema, Proposta, Alternativas, Impacto
3. Comunidade discute por 1 semana
4. Votação: 50%+ upvotes para prosseguir

### Exemplos RFC

- Migrar de In-Memory para PostgreSQL
- Mudar autenticação para OAuth2
- Fazer breaking change na API

---

## 5. Licença & Propriedade Intelectual

### 📄 Licença

**MIT License** - Código aberto, livre para usar/modificar

### Propriedade

- Contribuições ficam no repositório
- Você mantém copyright de seu código
- Ao contribuir, aceita licença MIT
- Heurify não monetiza sem avisar comunidade

### Como Citar

```
Developed with contributions from [comunidade].
Core contributors: [lista]
License: MIT
```

---

## 6. Roadmap Decisions

### Quem Decide Roadmap?

1. **Maintainer** - Visão estratégica
2. **Comunidade** - Votação em issues
3. **Users** - Feedback em discussions
4. **Data** - Métricas de uso

### Exemplo: Decidir Feature Próxima

```
1. Maintainer sugere: "Dashboard Analytics"
2. Comunidade vota (1 semana)
3. Top voted item entra no roadmap
4. Desenvolvedor(a) se voluntaria
5. Issue criada com detalhes
6. Development inicia
```

---

## 7. Release Governance

### Versioning Policy

```
MAJOR.MINOR.PATCH
│      │      └─ Bug fixes (1.0.1)
│      └─ Features (1.1.0)
└─ Breaking changes (2.0.0)
```

### Release Checklist

- [ ] Changelog atualizado
- [ ] Docs atualizadas
- [ ] Testes 100% passando
- [ ] Security review completo
- [ ] Performance testing OK
- [ ] Tag criada no GitHub
- [ ] Release notes publicadas
- [ ] Community announcement

---

## 8. Conflict Resolution

### Escalation Path

```
Discussão Normal
   ↓ (sem acordo após 5+ messages)
Revisores Envolvidos
   ↓ (persistente)
Maintainer + Comunidade Vota
   ↓ (raro)
Decisão Final do Maintainer
```

### Mediação

- Maintainers facilitam mediação
- Focar em fatos, não pessoas
- Objetivo: consenso ou compromisso
- Respeitar decisão final

---

## 9. Comunicação Oficial

### Canais

| Canal | Propósito | Frequência |
|-------|----------|-----------|
| **GitHub Issues** | Features, bugs | Sempre |
| **GitHub Discussions** | Ideias, Q&A | Sempre |
| **Wiki** | Documentação | Quando atualizar |
| **Email Newsletter** | Updates principais | Mensal |
| **Twitter** | Anúncios | Quando lançar |

### Resposta Garantida

- **Issues:** Dentro de 48 horas
- **Discussions:** Dentro de 72 horas
- **Email:** Dentro de 5 dias úteis

---

## 10. Transparência

### O que é Transparente

- ✅ Roadmap público
- ✅ Issues abertas
- ✅ Decisões documentadas
- ✅ Financials (se houver)

### O que Não é Público

- ❌ Dados pessoais de usuários
- ❌ Discussões privadas de security
- ❌ Información comercial sensível

---

## 11. Política de Segurança

### Vulnerability Disclosure

**Se encontrar bug de segurança:**

1. **NÃO** abra issue pública
2. Email privado: [security@heurify.org](mailto:security@heurify.org)
3. Espere resposta (48-72h)
4. Coordenar fix e disclosure

### SLA Segurança

- **Critical:** Fix em 24-48h
- **High:** Fix em 1 semana
- **Medium:** Fix em 2 semanas
- **Low:** Fix em próximo release

---

## 12. Mudanças em Governança

### Como Propor Mudança

1. Abra issue com `governance` label
2. Descreva: Problema, Proposta, Impacto
3. Comunidade discute (1 semana)
4. Votação simples (50%+ upvotes)
5. Implementar se aprovado

---

## 🙏 Reconhecimentos

Comunidade Heurify é alimentada por:

- **Contribuidores:** Code, docs, heurísticas
- **Revisores:** Qualidade, feedback
- **Curadores:** Aprovação de conhecimento
- **Usuários:** Feedback, bugs reports
- **Sponsors:** (Quando houver)

### Honrar Contribuições

- Creditamos todos em README
- Badge de contribuidor
- Reconhecimento em release notes
- Acesso a channel privado

---

## Links Relacionados

- [[Guia de Contribuição]] - Como contribuir com código
- [[Taxonomia de Heurísticas]] - Catálogo de heurísticas
- [[Heurísticas de VADER]] - Metodologia de testes
- [[Visão Geral]] - O que é Heurify
- [[Roadmap]] - Visão estratégica

---

## 📞 Contato Governança

- **Dúvidas:** [governance@heurify.org](mailto:governance@heurify.org)
- **Violação:** [conduct@heurify.org](mailto:conduct@heurify.org)
- **Segurança:** [security@heurify.org](mailto:security@heurify.org)

**Nosso compromisso:** Comunidade justa, inclusiva e transparente. 🤝

