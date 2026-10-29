// scripts/test-runner.ts — Deterministic tests for schemas and domain contracts
import { StoreSchema, ProductSchema, CustomerIntentSchema } from '../src/schemas/domain';
import { storesMock, productsMock } from '../src/services/catalog-service';
import { classifyMessageIntent } from '../src/services/ai-copilot-service';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
}

async function run() {
  console.log('--- Executando Testes Unitários de Domínio e Guardrails ---');

  // 1. Validar Lojas
  assert(storesMock.length === 5, 'Devem existir exatamente 5 unidades físicas cadastradas.');
  for (const store of storesMock) {
    const parsed = StoreSchema.safeParse(store);
    assert(parsed.success, `Store ${store.id} viola o schema Zod: ${JSON.stringify(parsed)}`);
  }
  console.log('✓ 5 lojas validadas pelo schema Zod.');

  // 2. Validar Produtos
  assert(productsMock.length >= 8, 'O catálogo deve possuir ao menos 8 produtos de alta qualidade.');
  for (const product of productsMock) {
    const parsed = ProductSchema.safeParse(product);
    assert(parsed.success, `Produto ${product.id} viola o schema Zod: ${JSON.stringify(parsed)}`);
  }
  console.log(`✓ ${productsMock.length} produtos do catálogo validados pelo schema Zod.`);

  // 3. Validar Classificador de Intenção de IA
  const testCases = [
    { text: 'Qual o valor do Whey Isolado e vocês entregam aqui perto?', expectedCategory: 'COMMERCIAL_OPPORTUNITY' },
    { text: 'A Creatina Creapure precisa de fase de saturação?', expectedCategory: 'TECHNICAL_QUESTION' },
    { text: 'Qual o horário de funcionamento da loja Jardins?', expectedCategory: 'STORE_HOURS_LOGISTICS' },
    { text: 'Quero falar com um atendente agora', expectedCategory: 'HUMAN_HANDOFF' },
  ];

  for (const tc of testCases) {
    const result = classifyMessageIntent(tc.text);
    const parsed = CustomerIntentSchema.safeParse(result);
    assert(parsed.success, `Resultado da IA viola schema CustomerIntentSchema: ${JSON.stringify(parsed)}`);
    assert(result.category === tc.expectedCategory, `Classificação falhou para "${tc.text}". Esperado: ${tc.expectedCategory}, Obtido: ${result.category}`);
  }
  console.log(`✓ Classificador de intenções testado com ${testCases.length} casos de teste.`);

  console.log('✓ TODOS OS TESTES PASSARAM COM SUCESSO!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
