import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { EOL } from 'node:os';
import { mockConsole } from '../helpers.js';

const fetchMock = mock.fn();
const existsSyncMock = mock.fn();
const createDirectoryMock = mock.fn();
const writeFileMock = mock.fn();
const spinnerStopMock = mock.fn();
const spinnerFailMock = mock.fn();
const spinnerMock = mock.fn(() => ({
  stop: spinnerStopMock,
  fail: spinnerFailMock,
}));
const hideCursorMock = mock.fn();
const resetCursorMock = mock.fn();
const inputFromTTYMock = mock.fn();
const spawnMock = mock.fn();
const processStdoutWrite = process.stdout.write;
const processStderrWrite = process.stderr.write;

let prismStdoutOnMock = mock.fn();
let prismStderrOnMock = mock.fn();
let prismOnMock = mock.fn();
let prismKillMock = mock.fn();
let prismUnrefMock = mock.fn();
let prismRefMock = mock.fn();

const __moduleMocks = {
  'node-fetch': (() => ({
    default: fetchMock,
  }))(),
  'node:fs': (() => ({
    existsSync: existsSyncMock,
    readFileSync: mock.fn(),
  }))(),
  '../../src/utils/fs.js': (() => ({
    createDirectory: createDirectoryMock,
    writeFile: writeFileMock,
  }))(),
  '../../src/middleware/config.js': (() => ({
    getSharedConfig: mock.fn(() => ({
      globalConfigPath: '/tmp/.vonage',
    })),
    APISpecs: {
      sms: 'https://developer.vonage.com/api/v1/developer/api/file/sms?format=json&vendorId=vonage',
    },
  }))(),
  'child_process': (() => ({
    spawn: spawnMock,
  }))(),
  '../../src/ux/spinner.js': (() => ({
    spinner: spinnerMock,
  }))(),
  '../../src/ux/cursor.js': (() => ({
    hideCursor: hideCursorMock,
    resetCursor: resetCursorMock,
  }))(),
  '../../src/ux/input.js': (() => ({
    inputFromTTY: inputFromTTYMock,
  }))(),
};


const config = {
  config: {
    globalConfigPath: '/tmp/.vonage',
  },
};

const mockSpec = {
  openapi: '3.0.0',
  info: { title: 'SMS API', version: '1.0.0' },
  paths: {},
};

const getArgv = (overrides = {}) => ({
  api: 'sms',
  port: 4010,
  host: 'localhost',
  downloadOnly: true,
  latest: false,
  ...config,
  ...overrides,
});

test('mock command', { concurrency: 1 }, async (ctx) => {
  for (const [specifier, namedExports] of Object.entries(__moduleMocks)) {
    const moduleOptions = { namedExports: { ...namedExports } };
    if (Object.hasOwn(moduleOptions.namedExports, 'default')) {
      moduleOptions.defaultExport = moduleOptions.namedExports.default;
      delete moduleOptions.namedExports.default;
    }
    ctx.mock.module(specifier, moduleOptions);
  }
  const { handler } = await import('../../src/commands/mock.js');

  ctx.beforeEach(() => {
    mockConsole();
    process.stdout.write = mock.fn();
    process.stderr.write = mock.fn();

    fetchMock.mock.resetCalls();
    existsSyncMock.mock.resetCalls();
    createDirectoryMock.mock.resetCalls();
    writeFileMock.mock.resetCalls();
    spinnerMock.mock.resetCalls();
    spinnerStopMock.mock.resetCalls();
    spinnerFailMock.mock.resetCalls();
    hideCursorMock.mock.resetCalls();
    resetCursorMock.mock.resetCalls();
    inputFromTTYMock.mock.resetCalls();
    spawnMock.mock.resetCalls();

    prismStdoutOnMock = mock.fn((event, callback) => {
      if (event === 'data') {
        callback('Prism is listening on port 42');
      }
    });
    prismStderrOnMock = mock.fn();
    prismOnMock = mock.fn();
    prismKillMock = mock.fn();
    prismUnrefMock = mock.fn();
    prismRefMock = mock.fn();

    fetchMock.mock.mockImplementation(() => Promise.resolve({
      ok: true,
      json: mock.fn(() => Promise.resolve(mockSpec)),
    }));
    existsSyncMock.mock.mockImplementation(() => false);
    createDirectoryMock.mock.mockImplementation(() => true);
    writeFileMock.mock.mockImplementation(() => Promise.resolve());
    inputFromTTYMock.mock.mockImplementation(() => Promise.reject('Shutdown'));
    spawnMock.mock.mockImplementation(() => ({
      stderr: { on: prismStderrOnMock },
      stdout: { on: prismStdoutOnMock },
      on: prismOnMock,
      kill: prismKillMock,
      killed: false,
      unref: prismUnrefMock,
      ref: prismRefMock,
    }));
  });

  ctx.after(() => {
    process.stdout.write = processStdoutWrite;
    process.stderr.write = processStderrWrite;
  });

  await ctx.test('should download SMS API spec successfully', async () => {
    await handler(getArgv());

    assert.ok(fetchMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['https://developer.vonage.com/api/v1/developer/api/file/sms?format=json&vendorId=vonage', ])));;
    assert.ok(createDirectoryMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['/tmp/.vonage/mock'])));;
    assert.ok(writeFileMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['/tmp/.vonage/mock/sms-spec.json', JSON.stringify(mockSpec, null, 2), ])));;
    assert.ok(console.log.mock.calls.some((c) => c.arguments[0].includes('Downloaded SMS API specification')));
    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['Spec download complete. Use the spec file with your preferred mock server.']);;
  });

  await ctx.test('should handle download failure gracefully', async () => {
    fetchMock.mock.mockImplementation(() => Promise.resolve({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    }));

    await assert.rejects(handler(getArgv()), /Failed to download API specification/);

    assert.strictEqual(spinnerFailMock.mock.callCount(), 1);
    assert.ok(console.error.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Failed to download API specification:', 'Failed to download spec: 404 Not Found', ])));;
  });

  await ctx.test('should handle network download failure', async () => {
    fetchMock.mock.mockImplementation(() => Promise.reject(new Error('Network error')));

    await assert.rejects(handler(getArgv()), /Failed to download API specification/);

    assert.strictEqual(spinnerFailMock.mock.callCount(), 1);
    assert.ok(console.error.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Failed to download API specification:', 'Network error', ])));;
  });

  await ctx.test('should handle directory creation failure', async () => {
    createDirectoryMock.mock.mockImplementation(() => {
      throw new Error('Permission denied');
    });

    await assert.rejects(handler(getArgv()), /Failed to create mock directory/);

    assert.ok(console.error.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Failed to create mock directory:', 'Permission denied', ])));;
  });

  await ctx.test('should use cached spec when file exists and --latest is not used', async () => {
    existsSyncMock.mock.mockImplementation(() => true);

    await handler(getArgv());

    assert.strictEqual(fetchMock.mock.callCount(), 0);
    assert.strictEqual(writeFileMock.mock.callCount(), 0);
    assert.ok(console.log.mock.calls.some((c) => c.arguments[0].includes('Using cached SMS API specification')));
    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['Spec already exists. Use --latest to re-download the latest version.', ]);;
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, ['Spec location: /tmp/.vonage/mock/sms-spec.json', ]);;
  });

  await ctx.test('should re-download spec when --latest flag is used', async () => {
    existsSyncMock.mock.mockImplementation(() => true);

    await handler(getArgv({ latest: true }));

    assert.ok(fetchMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['https://developer.vonage.com/api/v1/developer/api/file/sms?format=json&vendorId=vonage', ])));;
    assert.ok(writeFileMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['/tmp/.vonage/mock/sms-spec.json', JSON.stringify(mockSpec, null, 2), ])));;
    assert.ok(spinnerMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [{
      message: 'Re-downloading latest SMS API specification',
    }])));;
    assert.ok(console.log.mock.calls.some((c) => c.arguments[0].includes('Re-downloaded SMS API specification')));
  });

  await ctx.test('should start Prism from a cached spec without re-downloading', async () => {
    existsSyncMock.mock.mockImplementation(() => true);

    await handler(getArgv({ downloadOnly: false }));

    assert.strictEqual(fetchMock.mock.callCount(), 0);
    assert.strictEqual(writeFileMock.mock.callCount(), 0);
    assert.strictEqual(spinnerMock.mock.callCount(), 0);
    assert.ok(spawnMock.mock.callCount() > 0);
    assert.ok(console.log.mock.calls.some((c) => c.arguments[0].includes('Using cached SMS API specification')));
    assert.ok(console.log.mock.calls.some((c) => c.arguments[0].includes('Starting mock server for SMS API')));
  });

  await ctx.test('should wait for Prism listening output before continuing', async () => {
    prismStdoutOnMock = mock.fn((event, callback) => {
      if (event === 'data') {
        callback('Prism booting');
        callback('Prism is listening on port 42');
      }
    });

    await handler(getArgv({ downloadOnly: false }));

    assert.strictEqual(process.stderr.write.mock.callCount(), 2);
    assert.ok(process.stderr.write.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Prism booting'])));;
    assert.ok(process.stderr.write.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Prism is listening on port 42'])));;
    assert.ok(console.log.mock.calls.some((c) => c.arguments[0].includes('Mock server is running at http://localhost:4010')));
  });

  await ctx.test('should start Prism server with bundled CLI and stop on shutdown', async () => {
    await handler(getArgv({ downloadOnly: false }));

    assert.ok(spawnMock.mock.callCount() > 0);
    const spawnCall = spawnMock.mock.calls[0].arguments;
    assert.ok(spawnCall[0].includes('node_modules/.bin/prism'));
    assert.deepStrictEqual(spawnCall[1], [
      'mock',
      '/tmp/.vonage/mock/sms-spec.json',
      '--port',
      '4010',
      '--host',
      'localhost',
    ]);
    assert.deepStrictEqual(spawnCall[2], {
      detached: true,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    assert.ok(hideCursorMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [])));
    assert.ok(resetCursorMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [])));
    assert.ok(prismKillMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['SIGTERM'])));;
    assert.strictEqual(prismUnrefMock.mock.callCount(), 1);
    assert.strictEqual(prismRefMock.mock.callCount(), 1);
    assert.strictEqual(inputFromTTYMock.mock.callCount(), 1);
    assert.ok(console.log.mock.calls.some((c) => c.arguments[0].includes('Using bundled Prism CLI')));
    assert.ok(console.log.mock.calls.some((c) => c.arguments[0].includes('Mock server is running at http://localhost:4010')));
    assert.ok(console.log.mock.calls.some((c) => c.arguments[0].includes('Mock server stopped.')));
  });

  await ctx.test('should abort only after q is pressed', async () => {
    inputFromTTYMock.mock.mockImplementation(async ({ onKeyPress }) => {
      onKeyPress({}, 'x');
      onKeyPress({}, 'q');
      throw 'Shutdown';
    });

    await handler(getArgv({ downloadOnly: false }));

    assert.ok(process.stdout.write.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Press q to quit'])));;
    assert.ok(process.stdout.write.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [EOL])));;
    assert.strictEqual(prismKillMock.mock.callCount(), 1);
  });

  await ctx.test('should surface Prism stderr startup errors', async () => {
    prismStderrOnMock = mock.fn((event, callback) => {
      if (event === 'error') {
        callback(new Error('spawn prism ENOENT'));
      }
    });

    await assert.rejects(
      handler(getArgv({ downloadOnly: false })),
      /Failed to start Prism mock server/,
    );

    assert.ok(console.error.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Failed to start Prism:', 'spawn prism ENOENT'])));;
    assert.deepStrictEqual(console.log.mock.calls[9 - 1].arguments, ['']);;
    assert.deepStrictEqual(console.log.mock.calls[10 - 1].arguments, ['If you encounter issues, you can also run Prism manually:']);;
    assert.deepStrictEqual(console.log.mock.calls[11 - 1].arguments, ['  npx @stoplight/prism-cli mock /tmp/.vonage/mock/sms-spec.json --port 4010 --host localhost', ]);;
  });

  await ctx.test('should log unexpected input errors before shutdown', async () => {
    inputFromTTYMock.mock.mockImplementation(() => Promise.reject(new Error('TTY failure')));

    await handler(getArgv({ downloadOnly: false }));

    assert.ok(console.error.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Unexpected error', new Error('TTY failure')])));;
    assert.ok(prismKillMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['SIGTERM'])));;
    assert.ok(resetCursorMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [])));
  });
});
