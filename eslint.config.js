import globals from 'globals';
import eslint from '@eslint/js';
import nodePlugin from 'eslint-plugin-n';
import stylisticJs from '@stylistic/eslint-plugin';
// eslint-disable-next-line n/no-extraneous-import
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['__tests__/**/*.js'],
    languageOptions: {
      globals: {
        afterAll: 'readonly',
        afterEach: 'readonly',
        assert: 'readonly',
        assertCalledWith: 'readonly',
        assertNotCalledWith: 'readonly',
        assertNthCalledWith: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        describe: 'readonly',
        loadModule: 'readonly',
        mock: 'readonly',
        mockQueue: 'readonly',
        modulePath: 'readonly',
        test: 'readonly',
      },
    },
    rules: {
      'n/no-unsupported-features/node-builtins': 'off',
    },
  },
  eslint.configs.recommended,
  stylisticJs.configs['disable-legacy'],
  nodePlugin.configs['flat/recommended'],
  {
    plugins: { n: nodePlugin },
    extends: ['n/recommended-module'],
  },
  {
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/semi': ['error', 'always'],
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      '@stylistic/js/array-element-newline': ['error',

        { 'consistent': true, 'multiline': true }
      ],
    }
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      }
    },
    settings: {
      n: {
        version: '>=22.0.0',
        tryExtensions: ['.js'],
      },
    },
    files: ['src/**/*.{js}', '__tests__/**/*.{js}'],
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
]);
