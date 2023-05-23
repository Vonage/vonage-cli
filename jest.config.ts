import type { Config } from '@jest/types';

const projectDefault = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/testHelpers/helpers.ts'],
  preset: 'ts-jest/presets/js-with-ts',
  moduleNameMapper: {
    // We have to be explict for each path so it does not interfere with the SDK
    '@vonage/cli-core': '<rootDir>/packages/cli-core/lib',
    '@vonage/cli-(.+)': '<rootDir>/packages/cli-$1/lib',
  },
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
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', {}],
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
};

export default config;
