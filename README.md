# Rede Titan Suplementos — MVP de Digitalização Comercial (5 Lojas + IA)

> **Solução de digitalização comercial para rede física de suplementação e longevidade.**
> Conectando 5 lojas físicas a vitrines digitais integradas e atendimento comercial assistido por Inteligência Artificial no WhatsApp.

---

## 🚀 Sobre o Projeto

Este MVP demonstra como modernizar o atendimento e a presença comercial de uma rede de 5 lojas físicas sem substituir o ERP legado ou controle de estoque existente:

1. **Atendimento Inteligente com IA (WhatsApp Copilot):**
   - Classificação em tempo real de intenções (Oportunidade Comercial, Dúvida Técnica Nutricional, Horários/Logística e Transbordo Humano).
   - Sugestão de respostas profissionais e consultivas em 1 clique para o operador humano (estágio *Crawl* - human in the loop).
   - Síntese automática do histórico da conversa.
   - Encaminhamento transparente para atendentes de cada unidade física.
2. **E-commerce & Vitrine Unificada (Modelo C):**
   - Portal central da rede com apresentação unificada da marca.
   - Vitrines personalizadas para as 5 unidades físicas:
     - **Jardins (Flagship SP)** — São Paulo, SP
     - **Moema** — São Paulo, SP
     - **Barra da Tijuca** — Rio de Janeiro, RJ
     - **Savassi** — Belo Horizonte, MG
     - **Batel** — Curitiba, PR
   - Catálogo de suplementos com filtros por categoria (Proteínas, Creatinas, Pré-Treino, Vitaminas, Snacks).
   - Botão inteligente de WhatsApp com mensagem pré-formatada contextualizada com o produto e a unidade escolhida.

---

## 🛠️ Stack Tecnológica

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **Estilização:** Tailwind CSS v4 com Design Tokens (`tokens.json`)
- **Gerenciador de Pacotes:** pnpm
- **Contratos & Validação:** Zod 4 (`src/schemas/domain.ts`)
- **Qualidade & Lint:** ESLint 9 (Flat Config) + plugin local `quality` (`max-lines: 350`, `no-direct-console`, `no-direct-data-access`)
- **Testes & Auditoria:** Vitest / Test-Runner + Playwright + `@axe-core/playwright` (WCAG AA) + `eval-runner.ts` (IA Benchmark)

---

## 📋 Governança e Documentos Canônicos (Genesis AI Toolkit)

O projeto segue rigorosamente as 4 etapas do **Genesis AI Toolkit (Dia 0)**:
- [`PRODUCT.md`](./PRODUCT.md) — Visão de produto, thresholds de utilidade e avaliação dos 3 eixos.
- [`AGENTS.md`](./AGENTS.md) — Regras de governança universais para agentes e LLMs.
- [`CLAUDE.md`](./CLAUDE.md) — Apontador canônico.
- [`MEMORY.md`](./MEMORY.md) — Tese de negócio, topologia de 4 subagentes e 5 Leis Inegociáveis (≤ 100 linhas).
- [`docs/architecture.md`](./docs/architecture.md) — Arquitetura de software e fluxos de dados.
- [`docs/design-system.md`](./docs/design-system.md) — Arquetipo Athletic Prestige e design tokens.
- [`docs/quality-gates.md`](./docs/quality-gates.md) — Portões determinísticos travados em `error`.
- [`docs/evals.md`](./docs/evals.md) — Suite de avaliação da IA (`evals/*.json`).
- [`docs/setup.md`](./docs/setup.md) — Manual de configuração e ambiente.

---

## ⚡ Como Executar

### 1. Clonar e Instalar Dependências
```bash
pnpm install
```

### 2. Rodar em Modo Desenvolvimento
```bash
pnpm dev
```
Acesse [http://localhost:3000](http://localhost:3000) no navegador.

### 3. Rodar Quality Gates & Testes
```bash
# Validação unificada (lint + typecheck + glossário + testes)
pnpm check

# Avaliação do assistente de IA
pnpm eval

# Verificação de regressão vs baseline
pnpm verify

# Build de produção
pnpm build
```

---

## ⚖️ Licença e Informações Regulatórias

Suplementos alimentares dispensados de registro conforme RDC Anvisa 240/2018. Não substituem prescrição médica.
Projeto desenvolvido para fins de demonstração e validação comercial.
