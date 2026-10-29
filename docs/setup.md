# Guia de Configuração e Instalação (Setup)

## 1. Pré-requisitos
- Node.js ≥ 20 (recomendado Node 20+)
- pnpm ≥ 10 (`npm i -g pnpm`)
- Git

## 2. Instalação de Dependências
Na raiz do projeto (`Suplementos/`):
```bash
pnpm install
```

## 3. Comandos Disponíveis
- `pnpm dev`: Inicia o servidor de desenvolvimento em `http://localhost:3000`.
- `pnpm build`: Gera o build otimizado de produção do Next.js.
- `pnpm start`: Inicia o servidor em modo produção após o build.
- `pnpm lint`: Executa a análise estática com o plugin de qualidade (`quality/max-lines`, etc.).
- `pnpm typecheck`: Validação completa de tipos TypeScript (`tsc --noEmit`).
- `pnpm glossary`: Varre o projeto garantindo ausência de termos proibidos.
- `pnpm eval`: Executa a bateria de testes de IA sobre as intenções de atendimento.
- `pnpm test`: Executa os testes determinísticos de contratos e schemas Zod.
- `pnpm check`: Executa a esteira completa de qualidade (lint + typecheck + glossary + test).

## 4. Estrutura do Repositório
```
/
├── .agents/            # Definição e escopo da topologia de subagentes
├── .ai-context/        # Fatiamento de contexto para LLMs (Cache e RAG)
├── docs/               # Documentação canônica do projeto
├── eslint-rules/       # Regras determinísticas locais do ESLint
├── evals/              # Casos de teste de IA estruturados
├── gold-standards/     # Exemplos padrão-ouro de componentes
├── public/             # Arquivos estáticos
├── scripts/            # Scripts de automação (check-glossary, eval-runner, verify, test-runner)
├── src/
│   ├── app/            # Páginas e rotas (App Router Next.js 16)
│   ├── components/     # Componentes visuais modulares
│   ├── lib/            # Logger central e utilitários
│   ├── schemas/        # Schemas Zod de domínio e IA
│   └── services/       # Camada isolada de acesso a dados e serviços
├── tokens.json         # Tokens de design imutáveis
└── glossary.json       # Termos proibidos e vocabulário aprovado
```
