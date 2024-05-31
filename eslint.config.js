import globals from 'globals';
import vonage from '@vonage/eslint-config';

export default [
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['packages/*/lib/**/*.{ts,tsx}'],
  },
  {
    ignores: ['packages/*/dist/**/*.js', 'coverage/**'],
  },
  ...vonage.configs.typescript,
  ...vonage.configs.jest,
  ...vonage.configs.node,
  {
    rules: {
      // Leave this off. This rule cannot handle monorepos
      'n/no-missing-import': ['off'],
    },
  },
];
