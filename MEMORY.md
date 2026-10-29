# MEMORY.md — Rede Titan Suplementos

> Limite estrito: 100 linhas. Memória viva e enxuta. Detalhes em `.ai-context/`.
> Última atualização: 2026-10-27

## Tese
A Rede Titan Suplementos existe para unificar a presença digital comercial de 5 lojas físicas de suplementação e nutrição esportiva. Ganhamos quando o cliente descobre o produto ideal na vitrine digital e é direcionado com contexto para o WhatsApp da unidade de preferência, onde um copiloto de IA auxilia o atendente a responder com rapidez e precisão técnica sem comprometer a segurança nutricional.

## Subagents (Topologia Ponytail)
| Nome | Modelo | Temp | Fatia `.ai-context` | Pastas controladas | Contrato `_telemetry` |
|---|---|---|---|---|---|
| orchestrator | Flash / Pro | 0.1 | `.ai-context/01-core-identity-and-voice.md` | `MEMORY.md`, `docs/` | `{agent, task, files_touched[], verify_exit}` |
| frontend-ui | Flash / Pro | 0.4 | `.ai-context/02-design-system-tokens.md` | `src/app/`, `src/components/` | `{agent, task, files_touched[], verify_exit}` |
| backend-services | Flash | 0.1 | `.ai-context/03-architecture-and-routes.md` | `src/services/`, `src/schemas/` | `{agent, task, files_touched[], verify_exit}` |
| ai-evaluator | Flash | 0.0 | `PRODUCT.md` (Thresholds) | `evals/`, `scripts/eval-runner.ts` | `{agent, task, pass_rate, cases_evaluated}` |

## 5 Leis Inegociáveis
1. **Arquivos ≤ 350 linhas** → Validador ESLint `quality/max-lines` via `pnpm verify`.
2. **Sem `console.*` no código** → Validador `quality/no-direct-console` (usar `src/lib/logger.ts`).
3. **Dados só pela camada de services** → Validador `quality/no-direct-data-access` (`src/services/`).
4. **Vocabulário do glossário** → Trava determinística via `pnpm glossary` (`scripts/check-glossary.ts`).
5. **IA sem regressão** → Evals de intenção com pass rate ≥ 85% via `pnpm eval`.

## Decisões Arquiteturais (ADRs)
- 2026-10-27 — Adoção do Modelo C (Portal Central + Vitrines de 5 Unidades) — Permite identidade de rede e autonomia local de cada loja.
- 2026-10-27 — Copiloto Humano no Loop (Crawl) — IA sugere respostas e classifica intenções no simulador antes de qualquer envio automático.
- 2026-10-27 — Stack Next.js 16 + Tailwind CSS v4 com `tokens.json` fechado para controle estrito de design.

## Dependências Registradas
- `zod`: Validação estrita de contratos de domínio e dados de IA.
- `clsx` & `tailwind-merge`: Combinação determinística de classes de estilo.
- `lucide-react`: Ícones de alta fidelidade para catálogo e chat.
- `@playwright/test` & `@axe-core/playwright`: Testes automatizados de conformidade e acessibilidade.
