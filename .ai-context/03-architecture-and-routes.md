# 03 — Arquitetura de Software e Rotas da Aplicação

## 1. Stack e Tecnologias
- Framework: Next.js 16 (App Router) + React 19 + TypeScript
- Estilização: Tailwind CSS v4 com variáveis do `tokens.json`
- Validação e Contratos: Zod 4 (`src/schemas/domain.ts`)
- Qualidade: ESLint 9 com plugin local `quality` travado em `error` (max 350 linhas por arquivo)
- Testes: Playwright + axe-core (`tests/a11y.spec.ts`) + Test Runner (`scripts/test-runner.ts`)

## 2. Mapa de Rotas do Portal (Modelo C)
- `/` — Portal Central da Rede (Apresentação da marca, seletor das 5 lojas, vitrine em destaque, benefícios da rede e atalho para o Simulador de Atendimento).
- `/lojas` — Diretório completo das 5 unidades físicas com endereço, horários, equipe e botão de WhatsApp direto da unidade.
- `/lojas/[slug]` — Vitrine individual da loja física selecionada com filtro de produtos e contato contextualizado.
- `/produtos` — Catálogo geral com filtros por categoria de suplemento.
- `/produtos/[slug]` — Página de detalhes do produto com tabela nutricional, selos de qualidade e botão "Pedir no WhatsApp da Unidade".
- `/atendimento` — Simulador Interativo do Copiloto IA no WhatsApp: inbox com troca de mensagens, classificação de intenções em tempo real, sugestão de respostas em 1 clique, resumo da conversa e transbordo humano.

## 3. Isolamento da Camada de Dados
- Todos os acessos a dados e chamadas externas obrigatoriamente residem em `src/services/`.
- Componentes e páginas importam funções dos services, nunca realizam chamadas diretas não tipadas.
