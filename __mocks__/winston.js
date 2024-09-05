const winston = jest.createMockFromModule('winston'); 

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

winston.createLogger = jest.fn(() => mockLogger);

winston.format = {
  combine: jest.fn(),
  colorize: jest.fn(),
  padLevels: jest.fn(),
  simple: jest.fn(),
  timestamp: jest.fn(),
};

winston.transports = {
  Console: jest.fn(),
};

winston.__mockLogger = mockLogger;

module.exports = winston;
