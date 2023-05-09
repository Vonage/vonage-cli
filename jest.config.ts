import type { Config } from '@jest/types';

const projectDefault = {
  setupFilesAfterEnv: [
    '<rootDir>/testHelpers/stdoutAssertions.ts',
    '<rootDir>/testHelpers/stdinAssertions.ts',
  ],
  preset: 'ts-jest',
};

const config: Config.InitialOptions = {
  coverageDirectory: '<rootDir>/coverage/',
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/testHelpers/*',
    '<rootDir>/packages/cli/bin',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
  projects: [
    {
      ...projectDefault,
      displayName: 'CORE',
      testMatch: ['<rootDir>/packages/cli-core/__tests__/**/*.test.ts'],
      coveragePathIgnorePatterns: [
        'dist',
        'node_modules',
        '<rootDir>/packages/cli-core/__tests__',
      ],
    },
    {
      ...projectDefault,
      displayName: 'JWT',
      testMatch: ['<rootDir>/packages/cli-jwt/__tests__/**/*.test.ts'],
      coveragePathIgnorePatterns: [
        'dist',
        'node_modules',
        '<rootDir>/packages/cli-jwt/__tests__',
      ],
    },
  ],
  moduleNameMapper: {
    '@vonage/(.+)': '<rootDir>/packages/$1/lib',
  },
};

export default config;
