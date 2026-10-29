# Quality Gates Determinísticos — Dia 0

## 1. Princípio Fundamental
> "Se uma regra pode ser checada por linter, tipo, teste ou script de build, ela NÃO fica só no prompt. O LLM esquece; o build não."

Todas as regras de qualidade operam no nível `'error'`. Nenhum commit ou entrega é aceito com warnings pendentes.

## 2. Portões Ativos
1. **Regra `quality/max-lines`**:
   - Teto estrito de 350 linhas por arquivo.
   - Força a modularidade e a divisão clara de componentes e serviços.
2. **Regra `quality/no-direct-console`**:
   - Proíbe chamadas diretas a `console.log/warn/error` fora de scripts e do logger central.
   - Utilização obrigatória de `src/lib/logger.ts`.
3. **Regra `quality/no-direct-data-access`**:
   - Proíbe acesso direto a ORMs, bancos ou chamadas `fetch` dentro de componentes de UI.
   - Isolamento obrigatório na camada `src/services/`.
4. **Verificador de Glossário (`scripts/check-glossary.ts`)**:
   - Varredura em código e markdown contra termos proibidos (`reédio`, `medicamento`, `deletar`, `logar`).
5. **Verificação de Regressão de IA (`scripts/eval-runner.ts`)**:
   - Execução do dataset de casos de teste (`evals/*.json`) exigindo pass rate mínimo de 85%.

## 3. Comandos de Validação
```bash
# Validação individual
pnpm lint
pnpm typecheck
pnpm glossary
pnpm eval
pnpm test

# Validação composta obrigatória
pnpm check
```
