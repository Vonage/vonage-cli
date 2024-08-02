import type { Config } from '@jest/types';

const projectDefault = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/testHelpers/helpers.ts'],
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '@vonage/cli-core': '<rootDir>/packages/cli-core/lib/index.ts',
    '@vonage/cli-ux': '<rootDir>/packages/cli-ux/lib/index.ts',
    '@vonage/cli-config': '<rootDir>/packages/cli-config/lib/index.ts',
    '@vonage/cli-fs': '<rootDir>/packages/cli-fs/lib/index.ts',
    '@vonage/cli-(.+)': '<rootDir>/packages/cli-$1/lib',
  },
  coveragePathIgnorePatterns: [
    'dist',
    'node_modules',
    '<rootDir>/testHelpers',
  ],
};

const config: Config.InitialOptions = {
  extensionsToTreatAsEsm: ['.ts'],
  coverageDirectory: '<rootDir>/coverage/',
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/testHelpers',
    '<rootDir>/packages/cli/bin',
  ],
  projects: [
    {
      ...projectDefault,
      displayName: 'CORE',
      testMatch: ['<rootDir>/packages/cli-core/__tests__/**/*.test.ts'],
      coveragePathIgnorePatterns: [
        ...projectDefault.coveragePathIgnorePatterns,
        '<rootDir>/packages/cli-core/__tests__',
      ],
    },
    {
      ...projectDefault,
      displayName: 'CONFIG',
      testMatch: ['<rootDir>/packages/cli-config/__tests__/**/*.test.ts'],
      coveragePathIgnorePatterns: [
        ...projectDefault.coveragePathIgnorePatterns,
        '<rootDir>/packages/cli-config/__tests__',
      ],
    },
    {
      ...projectDefault,
      displayName: 'JWT',
      testMatch: ['<rootDir>/packages/cli-jwt/__tests__/**/*.test.ts'],
      coveragePathIgnorePatterns: [
        ...projectDefault.coveragePathIgnorePatterns,
        '<rootDir>/packages/cli-jwt/__tests__',
      ],
    },
  ],
};

export default config;
