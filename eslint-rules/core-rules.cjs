'use strict';
// Regras centrais do plugin local "quality" (ESLint 9, flat config).
const { matchesAny } = require('./utils.cjs');

const DEFAULT_DATA_MODULES = ['@prisma/client', '@supabase/supabase-js', 'drizzle-orm', 'pg', 'mongoose'];
const DEFAULT_ALLOWED_PATHS = ['src/services/**', 'src/server/**'];

/** quality/max-lines — limita o tamanho do arquivo (padrão 350). */
const maxLines = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Limita o número de linhas por arquivo' },
    schema: [{
      type: 'object',
      properties: {
        max: { type: 'integer', minimum: 1 },
        skipBlankLines: { type: 'boolean' },
        skipComments: { type: 'boolean' },
      },
      additionalProperties: false,
    }],
    messages: {
      tooMany: 'Arquivo tem {{actual}} linhas (máximo {{max}}). Divida por responsabilidade.',
    },
  },
  create(context) {
    const opts = context.options[0] || {};
    const max = opts.max ?? 350;
    const sourceCode = context.sourceCode ?? context.getSourceCode();
    return {
      'Program:exit'(node) {
        let lines = sourceCode.lines.map((text, idx) => ({ text, n: idx + 1 }));
        if (opts.skipBlankLines) lines = lines.filter((l) => l.text.trim() !== '');
        if (opts.skipComments) {
          const commentLines = new Set();
          for (const c of sourceCode.getAllComments()) {
            for (let n = c.loc.start.line; n <= c.loc.end.line; n++) commentLines.add(n);
          }
          // Só remove linhas que contêm APENAS comentário
          lines = lines.filter((l) => {
            if (!commentLines.has(l.n)) return true;
            const t = l.text.trim();
            return !(t.startsWith('//') || t.startsWith('/*') || t.startsWith('*') || t.endsWith('*/'));
          });
        }
        if (lines.length > max) {
          context.report({ node, loc: { line: 1, column: 0 }, messageId: 'tooMany', data: { actual: lines.length, max } });
        }
      },
    };
  },
};

/** quality/no-direct-console — proíbe console.* (use o logger do projeto). */
const noDirectConsole = {
  meta: {
    type: 'problem',
    docs: { description: 'Proíbe chamadas diretas a console.*' },
    schema: [{
      type: 'object',
      properties: { allowedPaths: { type: 'array', items: { type: 'string' } } },
      additionalProperties: false,
    }],
    messages: { noConsole: 'Não use console.{{method}}; use o logger do projeto.' },
  },
  create(context) {
    const opts = context.options[0] || {};
    const filename = context.filename ?? context.getFilename();
    if (matchesAny(filename, opts.allowedPaths, context.cwd)) return {};
    return {
      MemberExpression(node) {
        if (node.object.type === 'Identifier' && node.object.name === 'console') {
          const method = node.property.type === 'Identifier' ? node.property.name : '[computed]';
          context.report({ node, messageId: 'noConsole', data: { method } });
        }
      },
    };
  },
};

/** quality/no-direct-data-access — dados (ORM/SDK/fetch) só na camada de services. */
const noDirectDataAccess = {
  meta: {
    type: 'problem',
    docs: { description: 'Restringe acesso a dados à camada de services' },
    schema: [{
      type: 'object',
      properties: {
        modules: { type: 'array', items: { type: 'string' } },
        allowedPaths: { type: 'array', items: { type: 'string' } },
        checkFetch: { type: 'boolean' },
      },
      additionalProperties: false,
    }],
    messages: {
      forbiddenImport: 'Import de "{{name}}" fora da camada de services ({{allowed}}).',
      forbiddenFetch: 'fetch() fora da camada de services ({{allowed}}). Crie/uses um service.',
    },
  },
  create(context) {
    const opts = context.options[0] || {};
    const modules = opts.modules ?? DEFAULT_DATA_MODULES;
    const allowedPaths = opts.allowedPaths ?? DEFAULT_ALLOWED_PATHS;
    const checkFetch = opts.checkFetch ?? true;
    const filename = context.filename ?? context.getFilename();
    if (matchesAny(filename, allowedPaths, context.cwd)) return {};
    const allowed = allowedPaths.join(', ');
    const isForbidden = (src) => typeof src === 'string' && modules.some((m) => src === m || src.startsWith(m + '/'));
    const check = (node, src) => {
      if (isForbidden(src)) context.report({ node, messageId: 'forbiddenImport', data: { name: src, allowed } });
    };
    return {
      ImportDeclaration(node) { check(node, node.source.value); },
      ImportExpression(node) { if (node.source.type === 'Literal') check(node, node.source.value); },
      CallExpression(node) {
        const callee = node.callee;
        if (callee.type === 'Identifier' && callee.name === 'require' && node.arguments[0]?.type === 'Literal') {
          check(node, node.arguments[0].value);
        }
        if (!checkFetch) return;
        const isFetch = (callee.type === 'Identifier' && callee.name === 'fetch')
          || (callee.type === 'MemberExpression' && callee.property.type === 'Identifier' && callee.property.name === 'fetch'
            && callee.object.type === 'Identifier' && ['window', 'globalThis', 'self'].includes(callee.object.name));
        if (isFetch) context.report({ node, messageId: 'forbiddenFetch', data: { allowed } });
      },
    };
  },
};

module.exports = {
  'max-lines': maxLines,
  'no-direct-console': noDirectConsole,
  'no-direct-data-access': noDirectDataAccess,
};
