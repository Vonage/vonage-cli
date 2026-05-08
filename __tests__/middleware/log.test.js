const mockLogger = {
  info: mock.fn(),
  warn: mock.fn(),
  error: mock.fn(),
  debug: mock.fn(),
};
const createLoggerMock = mock.fn(() => mockLogger);

const origConsole = {
  info: console.info,
  warn: console.warn,
  error: console.error,
  debug: console.debug,
};

const getWinstonMock = () => ({
  default: {
    createLogger: createLoggerMock,
    format: {
      combine: () => undefined,
      colorize: () => undefined,
      padLevels: () => undefined,
      simple: () => undefined,
    },
    transports: {
      Console: mock.fn(() => ({})),
    },
  },
});

describe('Middleware: Log', () => {
  afterEach(() => {
    console.info = origConsole.info;
    console.warn = origConsole.warn;
    console.error = origConsole.error;
    console.debug = origConsole.debug;
    mockLogger.info.mock.resetCalls();
    mockLogger.warn.mock.resetCalls();
    mockLogger.error.mock.resetCalls();
    mockLogger.debug.mock.resetCalls();
    createLoggerMock.mock.resetCalls();
    createLoggerMock.mock.mockImplementation(() => mockLogger);
  });

  test('Will overwrite console log', async () => {
    assert.notStrictEqual(console.info, mockLogger.info);
    assert.notStrictEqual(console.warn, mockLogger.warn);
    assert.notStrictEqual(console.error, mockLogger.error);
    assert.notStrictEqual(console.debug, mockLogger.debug);

    const { setupLog } = await loadModule(
      import.meta.url,
      '../../src/middleware/log.js',
      { 'winston': getWinstonMock() },
    );

    setupLog({});

    console.info('info');
    console.warn('warn');
    console.error('error');
    console.debug('debug');

    assert.ok(mockLogger.info.mock.callCount() > 0);
    assert.ok(mockLogger.warn.mock.callCount() > 0);
    assert.ok(mockLogger.error.mock.callCount() > 0);
    assert.ok(mockLogger.debug.mock.callCount() > 0);

    assertCalledWith(createLoggerMock, {
      format: undefined,
      level: 'emerg',
      transports: [{}],
    });
  });

  test('Will overwrite console log and set the level to info', async () => {
    assert.notStrictEqual(console.info, mockLogger.info);
    assert.notStrictEqual(console.warn, mockLogger.warn);
    assert.notStrictEqual(console.error, mockLogger.error);
    assert.notStrictEqual(console.debug, mockLogger.debug);

    const { setupLog } = await loadModule(
      import.meta.url,
      '../../src/middleware/log.js',
      { 'winston': getWinstonMock() },
    );

    setupLog({ verbose: true });

    console.info('info');
    console.warn('warn');
    console.error('error');
    console.debug('debug');

    assert.ok(mockLogger.info.mock.callCount() > 0);
    assert.ok(mockLogger.warn.mock.callCount() > 0);
    assert.ok(mockLogger.error.mock.callCount() > 0);
    assert.ok(mockLogger.debug.mock.callCount() > 0);

    assertCalledWith(createLoggerMock, {
      format: undefined,
      level: 'info',
      transports: [{}],
    });
  });

  test('Will overwrite console log and set the level to debug', async () => {
    assert.notStrictEqual(console.info, mockLogger.info);
    assert.notStrictEqual(console.warn, mockLogger.warn);
    assert.notStrictEqual(console.error, mockLogger.error);
    assert.notStrictEqual(console.debug, mockLogger.debug);

    const { setupLog } = await loadModule(
      import.meta.url,
      '../../src/middleware/log.js',
      { 'winston': getWinstonMock() },
    );

    setupLog({ verbose: true, debug: true });

    console.info('info');
    console.warn('warn');
    console.error('error');
    console.debug('debug');

    assert.ok(mockLogger.info.mock.callCount() > 0);
    assert.ok(mockLogger.warn.mock.callCount() > 0);
    assert.ok(mockLogger.error.mock.callCount() > 0);
    assert.ok(mockLogger.debug.mock.callCount() > 0);

    assertCalledWith(createLoggerMock, {
      format: undefined,
      level: 'debug',
      transports: [{}],
    });
  });
});
