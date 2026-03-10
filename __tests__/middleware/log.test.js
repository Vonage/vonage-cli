import { jest, describe, test, afterEach, expect } from '@jest/globals';

const mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};
const createLoggerMock = jest.fn(() => mockLogger);

jest.unstable_mockModule('winston', () => ({
  default: {
    createLogger: createLoggerMock,
    format: {
      combine: () => undefined,
      colorize: () => undefined,
      padLevels: () => undefined,
      simple: () => undefined,
    },
    transports: {
      Console: jest.fn(() => ({})),
    },
  },
}));

const { setupLog } = await import('../../src/middleware/log.js');

const origConsole = {
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
};

describe('Middleware: Log', () => {
  afterEach(() => {
    console.info = origConsole.info;
    console.warn = origConsole.warn;
    console.error = origConsole.error;
    console.debug = origConsole.debug;
    mockLogger.info.mockReset();
    mockLogger.warn.mockReset();
    mockLogger.error.mockReset();
    mockLogger.debug.mockReset();
    createLoggerMock.mockReset();
    createLoggerMock.mockImplementation(() => mockLogger);
  });

  test('Will overwrite console log', () => {
    expect(console.info).not.toEqual(mockLogger.info);
    expect(console.warn).not.toEqual(mockLogger.warn);
    expect(console.error).not.toEqual(mockLogger.error);
    expect(console.debug).not.toEqual(mockLogger.debug);

    setupLog({});

    console.info('info');
    console.warn('warn');
    console.error('error');
    console.debug('debug');

    expect(mockLogger.info).toHaveBeenCalled();
    expect(mockLogger.warn).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalled();
    expect(mockLogger.debug).toHaveBeenCalled();

    expect(createLoggerMock).toHaveBeenCalledWith({
      format: undefined,
      level: 'emerg',
      transports: [{}],
    });
  });

  test('Will overwrite console log and set the level to info', () => {
    expect(console.info).not.toEqual(mockLogger.info);
    expect(console.warn).not.toEqual(mockLogger.warn);
    expect(console.error).not.toEqual(mockLogger.error);
    expect(console.debug).not.toEqual(mockLogger.debug);

    setupLog({ verbose: true });

    console.info('info');
    console.warn('warn');
    console.error('error');
    console.debug('debug');

    expect(mockLogger.info).toHaveBeenCalled();
    expect(mockLogger.warn).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalled();
    expect(mockLogger.debug).toHaveBeenCalled();

    expect(createLoggerMock).toHaveBeenCalledWith({
      format: undefined,
      level: 'info',
      transports: [{}],
    });
  });

  test('Will overwrite console log and set the level to debug', () => {
    expect(console.info).not.toEqual(mockLogger.info);
    expect(console.warn).not.toEqual(mockLogger.warn);
    expect(console.error).not.toEqual(mockLogger.error);
    expect(console.debug).not.toEqual(mockLogger.debug);

    setupLog({ verbose: true, debug: true });

    console.info('info');
    console.warn('warn');
    console.error('error');
    console.debug('debug');

    expect(mockLogger.info).toHaveBeenCalled();
    expect(mockLogger.warn).toHaveBeenCalled();
    expect(mockLogger.error).toHaveBeenCalled();
    expect(mockLogger.debug).toHaveBeenCalled();

    expect(createLoggerMock).toHaveBeenCalledWith({
      format: undefined,
      level: 'debug',
      transports: [{}],
    });
  });
});

