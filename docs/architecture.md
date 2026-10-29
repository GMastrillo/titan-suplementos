# Arquitetura do Sistema — Rede Titan Suplementos

## 1. Visão Geral da Solução
A plataforma resolve o desafio de digitalizar comercialmente uma rede física de 5 lojas sem substituir o ERP local ou estoque físico existente.

```
+--------------------------------------------------------------------------+
|                        REDE TITAN SUPLEMENTOS                           |
|                    Portal Central da Marca (Modelo C)                    |
+--------------------------------------------------------------------------+
                                    |
          +-------------------------+-------------------------+
          |                                                   |
+----------------------+                             +----------------------+
|  5 VITRINES DE LOJA  |                             | ATENDIMENTO COM IA   |
| - Jardins (SP)       |                             | - Classificador      |
| - Moema (SP)         |                             | - Respostas IA       |
| - Barra da Tijuca(RJ)|                             | - Resumos de Chat    |
| - Savassi (BH)       |                             | - Transbordo Humano  |
| - Batel (Curitiba)   |                             +----------------------+
+----------------------+                                        |
          |                                                     |
          +-------------> [ BOTÃO DE WHATSAPP ] <---------------+
                       Mensagem contextualizada com
                       Loja + Produto + Dúvida
```

## 2. Camadas do Sistema
- **UI & Apresentação (`src/app/`, `src/components/`)**:
  - Páginas Next.js no padrão App Router (SSR + Client Components interativos isolados).
  - Componentes estritamente estilizados via Tailwind CSS v4 e `tokens.json`.
- **Serviços de Domínio (`src/services/`)**:
  - `catalog-service.ts`: Repositório de dados das 5 unidades, catálogo categorizado e buscas.
  - `ai-copilot-service.ts`: Motor de inteligência artificial de atendimento com fallback offline determinístico.
- **Contratos e Tipagem (`src/schemas/`)**:
  - Schemas Zod para Stores, Products, Intents, ChatMessages e SuggestedResponses.
- **Governança & Portões (`scripts/`, `eslint-rules/`)**:
  - `verify.mjs`, `check-glossary.ts`, `eval-runner.ts`, `test-runner.ts`.

## 3. Fluxo de Interação Catálogo → WhatsApp → IA
1. O cliente escolhe uma das 5 unidades físicas na vitrine ou visualiza um produto específico no portal.
2. Ao clicar em "Consultar Disponibilidade" ou "Pedir pelo WhatsApp", é gerada uma URL codificada com a loja correta e a referência do produto.
3. No painel de atendimento (simulador demonstrativo), o atendente recebe a mensagem, a IA classifica a intenção em milissegundos e sugere 3 opções de resposta pronta.
4. O atendente pode aprovar, editar ou transbordar para outro especialista da loja.
