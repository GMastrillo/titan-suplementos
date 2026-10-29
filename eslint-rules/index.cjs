'use strict';
// Plugin ESLint local "quality". Registrar em eslint.config.mjs como plugins: { quality }.
const rules = require('./core-rules.cjs');

const plugin = {
  meta: { name: 'eslint-plugin-quality', version: '1.0.0' },
  rules,
  configs: {},
};

// Config recomendada (flat) pronta para uso: ...quality.configs.recommended
plugin.configs.recommended = {
  plugins: { quality: plugin },
  rules: {
    'quality/max-lines': ['error', { max: 350 }],
    'quality/no-direct-console': 'error',
    'quality/no-direct-data-access': 'error',
  },
};

module.exports = plugin;
