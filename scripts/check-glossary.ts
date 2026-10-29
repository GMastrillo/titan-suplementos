// check-glossary.ts — bloqueia termos proibidos do glossário.
// Uso: npx tsx scripts/check-glossary.ts [caminho/glossary.json]
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

interface ForbiddenTerm {
  term: string;
  replacement: string;
  reason: string;
}

interface Glossary {
  forbidden: ForbiddenTerm[];
  approved: string[];
  globs?: string[];
}

const DEFAULT_GLOBS = ['src/**/*.{ts,tsx,md,json}', 'docs/**/*.md'];
const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.quality']);

function globToRegExp(glob: string): RegExp {
  let re = '';
  let inGroup = false;
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        if (glob[i + 2] === '/') {
          re += '(?:.*/)?';
          i += 2;
        } else {
          re += '.*';
          i += 1;
        }
      } else {
        re += '[^/]*';
      }
    } else if (c === '?') {
      re += '[^/]';
    } else if (c === '{') {
      re += '(?:';
      inGroup = true;
    } else if (c === '}' && inGroup) {
      re += ')';
      inGroup = false;
    } else if (c === ',' && inGroup) {
      re += '|';
    } else if ('.+^$()|[]\\'.includes(c)) {
      re += '\\' + c;
    } else {
      re += c;
    }
  }
  return new RegExp('^' + re + '$');
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (IGNORED_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full, out);
    } else {
      out.push(full);
    }
  }
  return out;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function termRegExp(term: string): RegExp {
  return new RegExp(`(?<![\\p{L}\\p{N}_])${escapeRegExp(term)}(?![\\p{L}\\p{N}_])`, 'iu');
}

function main(): void {
  const cwd = process.cwd();
  const glossaryPath = process.argv[2] ?? join(cwd, 'glossary.json');
  if (!existsSync(glossaryPath)) {
    console.error(`Glossário não encontrado: ${glossaryPath}`);
    process.exit(1);
  }
  const glossary = JSON.parse(readFileSync(glossaryPath, 'utf8')) as Glossary;
  const globs = (glossary.globs ?? DEFAULT_GLOBS).map(globToRegExp);
  const rules = glossary.forbidden.map((f) => ({ ...f, re: termRegExp(f.term) }));
  const glossaryRel = relative(cwd, glossaryPath).split(sep).join('/');

  const files = walk(cwd)
    .map((f) => relative(cwd, f).split(sep).join('/'))
    .filter((f) => f !== glossaryRel && globs.some((g) => g.test(f)));

  let hits = 0;
  for (const file of files) {
    const lines = readFileSync(join(cwd, file), 'utf8').split(/\r?\n/);
    lines.forEach((line, idx) => {
      for (const r of rules) {
        if (r.re.test(line)) {
          hits++;
          console.log(`${file}:${idx + 1}  "${r.term}" → use "${r.replacement}" (${r.reason})`);
        }
      }
    });
  }

  if (hits > 0) {
    console.error(`\n✗ ${hits} termo(s) proibido(s) em ${files.length} arquivo(s) verificados.`);
    process.exit(1);
  }
  console.log(`✓ Glossário OK (${files.length} arquivo(s) verificados).`);
}

main();
