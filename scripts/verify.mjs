#!/usr/bin/env node
// verify.mjs — portão de qualidade. Sem dependências além do Node.
// Uso:
//   node scripts/verify.mjs             → compara com .quality/baseline.json (exit 1 se piorar)
//   node scripts/verify.mjs --baseline  → grava o baseline atual
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const cwd = process.cwd();
const BASELINE_DIR = join(cwd, '.quality');
const BASELINE_FILE = join(BASELINE_DIR, 'baseline.json');
const recordMode = process.argv.includes('--baseline');
const isWin = process.platform === 'win32';

function run(cmd, args) {
  return spawnSync(cmd, args, { cwd, encoding: 'utf8', shell: isWin, maxBuffer: 256 * 1024 * 1024 });
}

// 1. ESLint em JSON
const lint = run('npx', ['--no-install', 'eslint', '.', '--format', 'json']);
let results;
try {
  results = JSON.parse(lint.stdout || '[]');
} catch {
  console.error('Falha ao executar ESLint:\n' + (lint.stderr || lint.stdout));
  process.exit(1);
}

const counts = {};
let errorTotal = 0;
for (const file of results) {
  for (const m of file.messages) {
    const rule = m.ruleId || 'fatal/parse';
    counts[rule] ??= { errors: 0, warnings: 0 };
    if (m.severity === 2 || m.fatal) { counts[rule].errors++; errorTotal++; } else counts[rule].warnings++;
  }
}

// 2. Tabela
const rows = Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));
const baseline = existsSync(BASELINE_FILE) ? JSON.parse(readFileSync(BASELINE_FILE, 'utf8')).counts : {};
console.log('\nRegra'.padEnd(42) + 'Erros'.padStart(7) + 'Avisos'.padStart(8) + 'Baseline'.padStart(10));
console.log('-'.repeat(66));
for (const [rule, c] of rows) {
  const b = baseline[rule] ? baseline[rule].errors + baseline[rule].warnings : 0;
  console.log(rule.padEnd(41) + String(c.errors).padStart(7) + String(c.warnings).padStart(8) + String(b).padStart(10));
}
if (rows.length === 0) console.log('(nenhum problema encontrado)');

// 3. Baseline
if (recordMode) {
  mkdirSync(BASELINE_DIR, { recursive: true });
  writeFileSync(BASELINE_FILE, JSON.stringify({ createdAt: new Date().toISOString(), counts }, null, 2));
  console.log(`\nBaseline gravado em ${BASELINE_FILE}`);
}

let failed = false;
if (!recordMode) {
  for (const [rule, c] of rows) {
    const b = baseline[rule] ? baseline[rule].errors + baseline[rule].warnings : 0;
    if (c.errors + c.warnings > b) { console.error(`✗ Regressão em ${rule}: ${c.errors + c.warnings} > ${b}`); failed = true; }
  }
  if (errorTotal > 0) { console.error(`✗ ${errorTotal} erro(s) de lint.`); failed = true; }
}

// 4. TypeScript
if (existsSync(join(cwd, 'tsconfig.json'))) {
  const tsc = run('npx', ['--no-install', 'tsc', '--noEmit']);
  if (tsc.status !== 0) {
    console.error('\n✗ tsc --noEmit falhou:\n' + (tsc.stdout || '') + (tsc.stderr || ''));
    failed = true;
  } else console.log('\n✓ tsc --noEmit OK');
}

if (failed) { console.error('\nVERIFY: FALHOU'); process.exit(1); }
console.log('\nVERIFY: OK');
