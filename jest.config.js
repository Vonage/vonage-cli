const config = {
  coverageDirectory: '<rootDir>/coverage/',
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/testHelpers/*',
    '<rootDir>/__tests__',
  ],
  testMatch: ['<rootDir>/__tests__/**/*.test.js'],
};

module.exports = config;
