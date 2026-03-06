import globals from 'globals';
import eslint from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import jest from 'eslint-plugin-jest';
import nodePlugin from 'eslint-plugin-n';

export default [
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
      },
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/semi': ['error', 'always'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/js/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/js/array-bracket-newline': ['error', { 'multiline': true }],
      '@stylistic/js/dot-location': ['error', 'property'],
    },
  },
  {
    files: ['packages/*/src/**/*.{js}'],
  },
  {
    settings: {
      node: {
        version: '>=20.0.0',
      },
    },
    rules: {
      // Leave this off. This rule cannot handle monorepos
      'n/no-missing-import': ['off'],
      'n/no-unsupported-features/es-builtins': [
        'error', {
          'ignores': [],
        },
      ],
    },
  },

];
