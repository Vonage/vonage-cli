import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  coverageDirectory: '<rootDir>/coverage/',
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/packages/**/__tests__',
    '<rootDir>/packages/cli/bin',
  ],
  projects: [
    {
      setupFilesAfterEnv: [
        '<rootDir>/testHelpers/stdoutAssertions.ts',
        '<rootDir>/testHelpers/stdinAssertions.ts',
      ],
      preset: 'ts-jest',
      displayName: 'CORE',
      testMatch: ['<rootDir>/packages/cli-core/__tests__/**/*.test.ts'],
    },
  ],
  moduleNameMapper: {
    '@vonage/(.+)': '<rootDir>/packages/$1/lib',
  },
};

export default config;
