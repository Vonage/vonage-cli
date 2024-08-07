const globals = require('globals');
const eslint = require('@eslint/js');
const stylisticJs = require('@stylistic/eslint-plugin-js');
const jest = require('eslint-plugin-jest');
const nodePlugin = require('eslint-plugin-n');

module.exports = [
  eslint.configs.recommended,
  stylisticJs.configs['disable-legacy'],
  nodePlugin.configs['flat/recommended'],
  jest.configs['flat/recommended'],
  jest.configs['flat/style'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      }
    },
    plugins: {
     '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/semi': ['error', 'always'],

    }
  },
  {
    files: ['packages/*/src/**/*.{js}'],
  },
  {
    settings: {
      node: {
        version: '>=18.0.0',
      }
    },
    rules: {
      // Leave this off. This rule cannot handle monorepos
      'n/no-missing-import': ['off'],
      'n/no-unsupported-features/es-builtins': [
        'error', {
          'ignores': []
        }]
    },
  },

];
