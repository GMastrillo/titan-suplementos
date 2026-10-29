# Evals e AI as a Judge — Rede Titan Suplementos

## 1. Objetivo da Suite de Avaliação
Garantir que o assistente de IA para WhatsApp mantenha comportamento consistente, seguro e comercialmente eficaz, sem inventar dosagens ou prescrever medicamentos proibidos.

## 2. Métricas de Avaliação
- **Taxa de Acurácia de Intenção**: ≥ 85% dos casos de teste devem ter a categoria de intenção (`COMMERCIAL_OPPORTUNITY`, `TECHNICAL_QUESTION`, `STORE_HOURS_LOGISTICS`, `HUMAN_HANDOFF`) identificada corretamente.
- **Detecção de Oportunidades Comerciais**: Precisão de 100% ao identificar termos como "preço", "comprar", "desconto", "disponibilidade".
- **Transbordo Seguro**: Quando o cliente solicita um humano, o sistema deve indicar `isHumanHandoffRecommended: true` sem hesitação.

## 3. Dataset de Casos de Teste (`evals/`)
Os casos de teste residem em arquivos JSON estruturados:
- `evals/intent-cases.json`: Conjunto de mensagens de clientes reais com suas intenções esperadas.

## 4. Execução do Runner
```bash
pnpm eval
# ou
npx tsx scripts/eval-runner.ts --threshold=0.85
```
Gera relatório em `evals/report.json` com histórico de execuções.
