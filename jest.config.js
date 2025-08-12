const config = {
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/testHelpers/*',
    '<rootDir>/__tests__',
    '<rootDir>/src/commands/apps/capabilities.js',
    '<rootDir>/src/commands/apps/numbers.js',
  ],
  testMatch: ['<rootDir>/__tests__/**/*.test.js'],
  setupFiles: ['<rootDir>/.jest/setEnvVars.js'],
};

module.exports = config;
