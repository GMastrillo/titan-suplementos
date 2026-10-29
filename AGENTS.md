<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Rede Titan Suplementos

> Regras universais para QUALQUER agente de IA (Gemini, Claude, GPT, Cursor, Copilot...).
> Este arquivo é a fonte da verdade da governança do repositório.

## 0. Antes de qualquer tarefa
1. Leia `MEMORY.md` (tese, subagents, 5 Leis Inegociáveis).
2. Leia apenas a fatia relevante de `.ai-context/` para a tarefa em questão.
3. Se a tarefa envolver escopo de produto ou requisitos, consulte `PRODUCT.md`.

## 1. Stack Tecnológica
- Linguagem: TypeScript 5 · Framework: Next.js 16 (App Router) · Gerenciador: pnpm
- Camada de Dados: `src/services/` (acesso isolado e tipado)
- Estilização: Tailwind CSS v4 com `tokens.json`

## 2. Regras de Código (Travas Determinísticas em Error)
| Regra | Validador |
|---|---|
| Nenhum arquivo acima de **350 linhas** — divida por responsabilidade | `quality/max-lines` |
| Proibido `console.*` — use o logger `src/lib/logger.ts` | `quality/no-direct-console` |
| Acesso a dados/fetch **somente** na camada de services (`src/services/`) | `quality/no-direct-data-access` |
| Termos proibidos do glossário não podem aparecer | `scripts/check-glossary.ts` |
| Comportamento de IA sem regressão (pass rate ≥ 85%) | `scripts/eval-runner.ts` |

## 3. Definição de "Pronto" (Definition of Done)
Uma tarefa só é considerada concluída quando o comando de checagem unificada retornar exit code 0:
```bash
pnpm check
```
Nunca declare sucesso sem evidência da execução dos gates.

## 4. Coordenação Multiagente
- **1 escritor por arquivo**: apenas um agente edita um arquivo por vez. Pastas e domínios controlados estão definidos em `MEMORY.md` e `.agents/`.
- Fora da sua pasta controlada: somente leitura.
- Toda resposta de subagent deve anexar o bloco `_telemetry`.

## 5. Proibições Absolutas
- PROIBIDO desativar regras com `eslint-disable` sem comentário `-- motivo: ...`.
- PROIBIDO introduzir cores ou tamanhos arbitrários fora do `tokens.json`.
- PROIBIDO inventar tabelas, APIs ou prescrever dosagens médicas nos fluxos de IA.
