import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  coverageDirectory: '<rootDir>/coverage/',
  projects: [
    {
      setupFilesAfterEnv: ['<rootDir>/test/customAssertions.ts'],
      preset: 'ts-jest',
      displayName: 'CORE',
      testMatch: ['<rootDir>/packages/core/__tests__/**/*.test.ts'],
    },
  ],
  moduleNameMapper: {
    '@vonage/(.+)': '<rootDir>/packages/$1/lib',
  },
};

export default config;
