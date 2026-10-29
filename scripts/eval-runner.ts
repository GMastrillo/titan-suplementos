// eval-runner.ts — runner base de avaliações de IA.
// Uso: npx tsx scripts/eval-runner.ts [--threshold=0.8] [--samples=1]
// Casos: evals/*.json (objeto ou array de EvalCase). Relatório: evals/report.json
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { classifyMessageIntent } from '../src/services/ai-copilot-service';

export interface EvalCase {
  id: string;
  input: string;
  expected?: unknown;          // exato: valor | { regex: "..." } | { keys: ["a","b"] }
  rubric?: string;             // judge: critérios de avaliação
  type: 'exact' | 'judge';
}

/** Sistema sob teste: recebe o input e devolve a saída do modelo/feature. */
export type Generate = (input: string) => Promise<string>;
/** Juiz LLM: deve chamar o modelo com temperature 0.0 e devolver o texto bruto. */
export type Judge = (prompt: string, opts: { temperature: number }) => Promise<string>;

export const defaultGenerate: Generate = async (input: string) => {
  const intent = classifyMessageIntent(input);
  return intent.category;
};

export const defaultJudge: Judge = async () => {
  throw new Error(
    'Juiz não configurado. Implemente `judge(prompt, { temperature: 0 })` usando seu provedor ' +
    '(ex.: OpenAI/Gemini via OPENAI_API_KEY/GEMINI_API_KEY) e retorne o texto do modelo.',
  );
};

interface SampleResult { output: string; pass: boolean; score?: number; justification?: string; error?: string }
interface CaseResult { id: string; type: EvalCase['type']; samples: SampleResult[]; passAtK: number }

function arg(name: string, fallback: number): number {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`));
  return a ? Number(a.split('=')[1]) : fallback;
}

function loadCases(dir: string): EvalCase[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f !== 'report.json')
    .flatMap((f) => {
      const data = JSON.parse(readFileSync(join(dir, f), 'utf8')) as EvalCase | EvalCase[];
      return Array.isArray(data) ? data : [data];
    });
}

/** Modo exato: igualdade funcional, regex ou checagem de chaves JSON (estilo Zod simplificado). */
export function checkExact(output: string, expected: unknown): boolean {
  if (expected && typeof expected === 'object' && 'regex' in expected) {
    return new RegExp(String((expected as { regex: string }).regex)).test(output);
  }
  if (expected && typeof expected === 'object' && 'keys' in expected) {
    try {
      const obj = JSON.parse(output) as Record<string, unknown>;
      return (expected as { keys: string[] }).keys.every((k) => k in obj);
    } catch { return false; }
  }
  if (typeof expected === 'string') return output.trim() === expected.trim();
  try { return JSON.stringify(JSON.parse(output)) === JSON.stringify(expected); } catch { return false; }
}

function buildJudgePrompt(c: EvalCase, output: string): string {
  return [
    'Você é um avaliador rigoroso. Avalie a RESPOSTA segundo a RUBRICA.',
    'Primeiro escreva a justificativa; só depois dê a nota.',
    'Responda EXATAMENTE em JSON: {"justification": "...", "score": <0..1>}',
    `ENTRADA:\n${c.input}`,
    `RUBRICA:\n${c.rubric ?? 'Correção, completude e aderência ao pedido.'}`,
    c.expected !== undefined ? `REFERÊNCIA:\n${JSON.stringify(c.expected)}` : '',
    `RESPOSTA:\n${output}`,
  ].filter(Boolean).join('\n\n');
}

/** pass@k estimador não-viesado: 1 - C(n-c, k) / C(n, k). */
export function passAtK(n: number, c: number, k: number): number {
  if (n - c < k) return 1;
  let prod = 1;
  for (let i = n - c + 1; i <= n; i++) prod *= 1 - k / i;
  return 1 - prod;
}

export async function runEvals(opts: {
  generate?: Generate; judge?: Judge; samples?: number; threshold?: number; judgePassScore?: number; dir?: string;
} = {}): Promise<{ passRate: number; results: CaseResult[] }> {
  const { generate = defaultGenerate, judge = defaultJudge, samples = 1, threshold = 0.8, judgePassScore = 0.7 } = opts;
  const dir = opts.dir ?? join(process.cwd(), 'evals');
  const cases = loadCases(dir);
  const results: CaseResult[] = [];

  for (const c of cases) {
    const sampleResults: SampleResult[] = [];
    for (let s = 0; s < samples; s++) {
      try {
        const output = await generate(c.input);
        if (c.type === 'exact') {
          sampleResults.push({ output, pass: checkExact(output, c.expected) });
        } else {
          const raw = await judge(buildJudgePrompt(c, output), { temperature: 0.0 });
          const parsed = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)) as { justification: string; score: number };
          sampleResults.push({ output, pass: parsed.score >= judgePassScore, score: parsed.score, justification: parsed.justification });
        }
      } catch (e) {
        sampleResults.push({ output: '', pass: false, error: (e as Error).message });
      }
    }
    const correct = sampleResults.filter((r) => r.pass).length;
    results.push({ id: c.id, type: c.type, samples: sampleResults, passAtK: passAtK(samples, correct, samples) });
  }

  const passRate = results.length ? results.reduce((a, r) => a + r.passAtK, 0) / results.length : 0;
  writeFileSync(join(dir, 'report.json'), JSON.stringify({
    createdAt: new Date().toISOString(), samples, threshold, passRate, total: results.length, results,
  }, null, 2));

  for (const r of results) console.log(`${r.passAtK >= 1 ? '✓' : r.passAtK > 0 ? '~' : '✗'} ${r.id} (pass@${samples}=${r.passAtK.toFixed(2)})`);
  console.log(`\nPass rate: ${(passRate * 100).toFixed(1)}% (threshold ${(threshold * 100).toFixed(0)}%)`);
  return { passRate, results };
}

// Execução direta via CLI
if (process.argv[1] && /eval-runner\.(ts|js|mjs)$/.test(process.argv[1])) {
  const threshold = arg('threshold', 0.85);
  runEvals({ samples: arg('samples', 1), threshold })
    .then(({ passRate, results }) => {
      if (results.length === 0) { console.error('Nenhum caso em evals/*.json'); process.exit(1); }
      if (passRate < threshold) { console.error('✗ Abaixo do threshold.'); process.exit(1); }
    })
    .catch((e) => { console.error(e); process.exit(1); });
}
