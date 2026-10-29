# PRODUCT.md — Rede Titan Suplementos (Digitalização Comercial 5 Lojas)

## 1. Avaliação do caso de uso
| Eixo | Escolha | Justificativa |
|---|---|---|
| Crítica vs Complementar | Complementar | O catálogo e a vitrine continuam navegáveis se a IA de atendimento falhar, e o cliente pode mandar mensagem direta via WhatsApp sem interrupção de vendas. |
| Reativa vs Proativa | Reativa | A IA atua respondendo a dúvidas do cliente (FAQ, dosagem, estoque demonstrativo) ou sugerindo respostas quando acionada pelo operador humano. |
| Dinâmica vs Estática | Dinâmica | As respostas e classificações utilizam contexto específico da unidade selecionada, produto visualizado e histórico recente do diálogo. |

## 2. Estágio Crawl-Walk-Run (Human-in-the-Loop)
- [x] **Crawl** — Atendente humano valida ou edita 100% das sugestões de mensagem geradas pela IA antes do envio final.
- [ ] **Walk** — IA responde automaticamente dúvidas frequentes básicas (endereço, horário da loja) e classifica intenções; atendente revisa oportunidades comerciais.
- [ ] **Run** — IA atua diretamente no WhatsApp para triagem primária, transbordando para o atendente da unidade em caso de compra ou complexidade.

Estágio atual no MVP: **Crawl** · Critério para avançar para Walk: **Taxa de aceitação de sugestões de resposta ≥ 90% em pelo menos 100 atendimentos piloto com zero incidentes de dosagem/saúde**.

## 3. Usefulness Thresholds
| Métrica | Mínimo útil | Meta | Como medir |
|---|---|---|---|
| Qualidade (Classificação e Sugestões) | 85% de acurácia | 95% de acurácia | `pnpm eval` / `scripts/eval-runner.ts` com eval set |
| TTFT (Time To First Token / Resposta) | < 1200ms | < 450ms | Telemetria de latência p95 na geração |
| Taxa de Conversão para Atendimento Humano | 100% precisa | 100% sem perda de contexto | Verificação de payload com unidade + produto |
| Custo por Interação | < R$ 0,08 | < R$ 0,02 | Tokens de entrada/saída no modelo |

## 4. Product → Data → Model
1. **Produto**:
   - Plataforma web responsiva (Modelo C) integrando o portal central da rede com 5 vitrines exclusivas por unidade física.
   - Catálogo de suplementos com filtros por categoria (Proteínas, Aminoácidos, Vitaminas, Pré-treino, Saúde/Longevidade).
   - Botão de WhatsApp Inteligente que gera mensagem pré-formatada contextualizada com o produto e loja escolhidos.
   - Simulador / Inbox de Atendimento com Copiloto IA: sugere respostas em 1 clique, classifica intenção (Dúvida Técnica, Oportunidade Comercial, Logística/Horário, Reclamação), resume o chat e permite transbordo humano transparente.
2. **Dados**:
   - Catálogo de demonstração com 12+ produtos icônicos (Whey Isolado, Creatina Creapure, Ômega 3 TG, Pré-Treino Extreme, etc.).
   - Dados cadastrais das 5 unidades (endereço, telefone, horário, equipe responsável, WhatsApp de plantão).
   - Base de conhecimento (FAQ técnico nutricional, uso recomendado e política de entrega/retirada local).
   - Conjunto de avaliação de IA (`evals/*.json`) com cenários de clientes reais.
3. **Modelo**:
   - Modelos de alta velocidade com baixa latência (Gemini 2.5/Flash / Vercel AI SDK ou pipeline estruturado local com fallback mock determinístico para demo offline garantida).

## 5. Métricas de sucesso
- Negócio: Aumento da geração de leads qualificados no WhatsApp para as 5 unidades e redução de 50% no tempo de resposta inicial da equipe.
- Usuário (Atendente): Taxa de aceitação de respostas sugeridas ≥ 85% e satisfação na clareza do contexto recebido.
- Técnica: 0 violações WCAG AA, pontuação Lighthouse ≥ 90, tempo de carregamento < 1.5s, `pnpm check` 100% verde com gates em `error`.

## 6. Riscos e Mitigações
| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| IA sugerir prescrição médica ilegal | Baixa | Crítico | Guardrail rígido: aviso explícito de que suplementos não substituem orientação médica/nutricional; recusa de diagnóstico clínico. |
| Preço ou disponibilidade desatualizada | Média | Moderado | Indicação visual clara de catálogo demonstrativo no MVP; botão direciona para confirmação de estoque em tempo real com a unidade. |
| Queda de conectividade de API de IA | Média | Baixo | Fallback determinístico inteligente com templates aprovados de resposta rápida. |

## 7. Fora de Escopo do MVP
- Substituição de sistemas ERP/PDV legados.
- Checkout direto com transação de cartão/Pix no portal (vendas são direcionadas para fechamento no balcão ou WhatsApp).
- Sincronização automática em tempo real com sistemas fiscais das 5 lojas.
- Automação invasiva sem supervisão humana direta.
