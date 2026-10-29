'use strict';
// Utilitários sem dependências para o plugin local "quality".
const path = require('node:path');

/** Converte um glob simples (**, *, ?, {a,b}) em RegExp. */
function globToRegExp(glob) {
  let re = '';
  let i = 0;
  let inGroup = false;
  while (i < glob.length) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        // "**/" casa zero ou mais diretórios
        if (glob[i + 2] === '/') { re += '(?:.*/)?'; i += 3; continue; }
        re += '.*'; i += 2; continue;
      }
      re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else if (c === '{') { re += '(?:'; inGroup = true; }
    else if (c === '}' && inGroup) { re += ')'; inGroup = false; }
    else if (c === ',' && inGroup) re += '|';
    else if ('.+^$()|[]\\'.includes(c)) re += '\\' + c;
    else re += c;
    i++;
  }
  return new RegExp('^' + re + '$');
}

/** Caminho relativo ao cwd com barras normais. */
function toPosixRelative(filename, cwd = process.cwd()) {
  return path.relative(cwd, filename).split(path.sep).join('/');
}

/** True se o arquivo casar com algum dos globs. */
function matchesAny(filename, globs, cwd) {
  if (!globs || globs.length === 0) return false;
  const rel = toPosixRelative(filename, cwd);
  return globs.some((g) => globToRegExp(g).test(rel));
}

module.exports = { globToRegExp, toPosixRelative, matchesAny };
