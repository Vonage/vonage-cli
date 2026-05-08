import globals from 'globals';
import eslint from '@eslint/js';
import stylisticJs from '@stylistic/eslint-plugin-js';
import nodePlugin from 'eslint-plugin-n';

export default [
  eslint.configs.recommended,
  stylisticJs.configs['disable-legacy'],
  nodePlugin.configs['flat/recommended'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
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
        modulePath: 'readonly',
        test: 'readonly',
      },
    },
    rules: {
      'n/no-unsupported-features/node-builtins': 'off',
    },
  },
  {
    settings: {
      node: {
        version: '>=20.0.0',
      },
    },
  },
];
