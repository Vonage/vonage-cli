const config = {
  coverageDirectory: '<rootDir>/coverage/',
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/testHelpers/*',
    '<rootDir>/__tests__',
  ],
  testMatch: ['<rootDir>/__tests__/**/*.test.js'],
};

module.exports = config;
