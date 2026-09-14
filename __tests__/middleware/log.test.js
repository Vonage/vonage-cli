import { test, mock } from 'node:test';
import assert from 'node:assert/strict';

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
  table: console.table,
};

const getWinstonMock = () => ({
  createLogger: createLoggerMock,
  format: {
    combine: () => undefined,
    colorize: () => undefined,
    padLevels: () => undefined,
    simple: () => undefined,
  },
  transports: {
    Console: function() { return {}; },
  },
});

test('Middleware: Log', async (ctx) => {
  ctx.mock.module('winston', { defaultExport: getWinstonMock() });
  const { setupLog } = await import('../../src/middleware/log.js');

  ctx.beforeEach(() => {
    mockLogger.info.mock.resetCalls();
    mockLogger.warn.mock.resetCalls();
    mockLogger.error.mock.resetCalls();
    mockLogger.debug.mock.resetCalls();
    createLoggerMock.mock.resetCalls();
    createLoggerMock.mock.mockImplementation(() => mockLogger);
  });

  ctx.afterEach(() => {
    console.info = origConsole.info;
    console.warn = origConsole.warn;
    console.error = origConsole.error;
    console.debug = origConsole.debug;
  });

  const assertLoggerSetup = (level) => {
    assert.deepStrictEqual(createLoggerMock.mock.calls[0].arguments[0], {
      format: undefined,
      level,
      transports: [{}],
    });
  };

  await ctx.test('Will overwrite console log', () => {
    assert.notStrictEqual(console.info, mockLogger.info);
    assert.notStrictEqual(console.warn, mockLogger.warn);
    assert.notStrictEqual(console.error, mockLogger.error);
    assert.notStrictEqual(console.debug, mockLogger.debug);
    assert.strictEqual(console.table, origConsole.table);

    setupLog({});
    console.info('info');
    console.warn('warn');
    console.error('error');
    console.debug('debug');

    assert.ok(mockLogger.info.mock.calls.length > 0);
    assert.ok(mockLogger.warn.mock.calls.length > 0);
    assert.ok(mockLogger.error.mock.calls.length > 0);
    assert.ok(mockLogger.debug.mock.calls.length > 0);
    assert.strictEqual(console.table, origConsole.table);
    assertLoggerSetup('emerg');
  });

  await ctx.test('Will overwrite console log and set the level to info', () => {
    assert.notStrictEqual(console.info, mockLogger.info);
    assert.notStrictEqual(console.warn, mockLogger.warn);
    assert.notStrictEqual(console.error, mockLogger.error);
    assert.notStrictEqual(console.debug, mockLogger.debug);
    assert.strictEqual(console.table, origConsole.table);

    setupLog({ verbose: true });
    console.info('info');
    console.warn('warn');
    console.error('error');
    console.debug('debug');

    assert.ok(mockLogger.info.mock.calls.length > 0);
    assert.ok(mockLogger.warn.mock.calls.length > 0);
    assert.ok(mockLogger.error.mock.calls.length > 0);
    assert.ok(mockLogger.debug.mock.calls.length > 0);
    assert.strictEqual(console.table, origConsole.table);
    assertLoggerSetup('info');
  });

  await ctx.test('Will overwrite console log and set the level to debug', () => {
    assert.notStrictEqual(console.info, mockLogger.info);
    assert.notStrictEqual(console.warn, mockLogger.warn);
    assert.notStrictEqual(console.error, mockLogger.error);
    assert.notStrictEqual(console.debug, mockLogger.debug);
    assert.strictEqual(console.table, origConsole.table);

    setupLog({ verbose: true, debug: true });
    console.info('info');
    console.warn('warn');
    console.error('error');
    console.debug('debug');

    assert.ok(mockLogger.info.mock.calls.length > 0);
    assert.ok(mockLogger.warn.mock.calls.length > 0);
    assert.ok(mockLogger.error.mock.calls.length > 0);
    assert.ok(mockLogger.debug.mock.calls.length > 0);
    assert.strictEqual(console.table, origConsole.table);
    assertLoggerSetup('debug');
  });
});
