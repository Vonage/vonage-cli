import { mockConsole } from '../helpers.js';

describe('mock command', () => {
  let handler;
  let fetch;
  let spawn;
  let createDirectory;
  let writeFile;
  let childEventEmitter;
  let existsSync;

  const config = {
    config: {
      globalConfigPath: '/tmp/.vonage',
    },
  };

  const __moduleMocks = {
    'node-fetch': (() => ({
      default: mock.fn(),
    }))(),
    'node:fs': (() => ({
      existsSync: mock.fn(),
      readFileSync: mock.fn(),
    }))(),
    '../../src/utils/fs.js': (() => ({
      createDirectory: mock.fn(),
      writeFile: mock.fn(),
    }))(),
    '../../src/middleware/config.js': (() => ({
      getSharedConfig: mock.fn(() => ({
        globalConfigPath: '/tmp/.vonage',
      })),
      APISpecs: {
        'sms': 'https://developer.vonage.com/api/v1/developer/api/file/sms?format=json&vendorId=vonage',
      },
    }))(),
    'child_process': (() => ({
      spawn: mock.fn(),
    }))(),
    '../../src/ux/spinner.js': (() => ({
      spinner: mock.fn(() => ({
        stop: mock.fn(),
        fail: mock.fn(),
      })),
    }))(),
    '../../src/ux/cursor.js': (() => ({
      hideCursor: mock.fn(),
      resetCursor: mock.fn(),
    }))(),
    '../../src/ux/input.js': (() => ({
      inputFromTTY: mock.fn(),
    }))(),
  };

  const mockSpec = {
    openapi: '3.0.0',
    info: { title: 'SMS API', version: '1.0.0' },
    paths: {},
  };

  beforeEach(async () => {
    mockConsole();
    createDirectory = __moduleMocks['../../src/utils/fs.js'].createDirectory;
    writeFile = __moduleMocks['../../src/utils/fs.js'].writeFile;
    childEventEmitter = mock.fn();
    existsSync = (__moduleMocks['node:fs']).existsSync;
    fetch = (__moduleMocks['node-fetch']).default;
    spawn = (__moduleMocks['child_process']).spawn;
    handler = (await loadModule(import.meta.url, '../../src/commands/mock.js', __moduleMocks)).handler;

    childEventEmitter.mock.mockImplementationOnce((_, callback) => {
      callback('Prisim is listening on port 42');
    });

    fetch.mock.mockImplementation(() => Promise.resolve({
      ok: true,
      json: mock.fn(() => Promise.resolve(mockSpec)),
    }));

    createDirectory.mock.mockImplementation(() => true);
    writeFile.mock.mockImplementation(() => Promise.resolve());
    spawn.mock.mockImplementation(() => ({
      stderr: {
        on: mock.fn(),
      },
      stdout: {
        on: childEventEmitter,
      },
      on: mock.fn(),
      kill: mock.fn(),
      killed: false,
      unref: mock.fn(),
      ref: mock.fn(),
    }));
  });

  afterEach(() => {
    fetch.mock.resetCalls();
    writeFile.mock.resetCalls();
    childEventEmitter.mock.resetCalls();
  });

  test('should download SMS API spec successfully', async () => {
    fetch.mock.mockImplementation(() => Promise.resolve({
      ok: true,
      json: mock.fn(() => Promise.resolve(mockSpec)),
    }));

    createDirectory.mock.mockImplementation(() => true);
    writeFile.mock.mockImplementation(() => Promise.resolve());

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: true,
      ...config,
    };

    await handler(argv);

    assertCalledWith(
      fetch,
      'https://developer.vonage.com/api/v1/developer/api/file/sms?format=json&vendorId=vonage',
    );
    assertCalledWith(createDirectory, '/tmp/.vonage/mock');
    assertCalledWith(
      writeFile,
      '/tmp/.vonage/mock/sms-spec.json',
      JSON.stringify(mockSpec, null, 2),
    );
    assert.ok(console.log.mock.calls.some(c => c.arguments[0].includes('Downloaded SMS API specification')));
  });

  test('should handle download failure gracefully', async () => {
    fetch.mock.mockImplementation(() => Promise.resolve({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    }));

    createDirectory.mock.mockImplementation(() => true);

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: true,
      ...config,
    };

    await assert.rejects(handler(argv), /Failed to download API specification/);

    assertCalledWith(
      console.error,
      'Failed to download API specification:',
      'Failed to download spec: 404 Not Found',
    );
  });

  test('should handle download failure', async () => {
    fetch.mock.mockImplementation(() => Promise.reject(new Error('Network error')));

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: true,
      ...config,
    };

    await assert.rejects(handler(argv), /Failed to download API specification/);

    assertCalledWith(
      console.error,
      'Failed to download API specification:',
      'Network error',
    );
  });

  test('should handle directory creation failure', async () => {
    createDirectory.mock.mockImplementation(() => {
      throw new Error('Permission denied');
    });

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: true,
      ...config,
    };

    await assert.rejects(handler(argv), /Failed to create mock directory/);

    assertCalledWith(
      console.error,
      'Failed to create mock directory:',
      'Permission denied',
    );
  });

  test('should use cached spec when file exists and --latest is not used', async () => {
    existsSync.mock.mockImplementation(() => true);

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: true,
      latest: false,
      ...config,
    };

    await handler(argv);

    assert.strictEqual(fetch.mock.callCount(), 0);
    assert.strictEqual(writeFile.mock.callCount(), 0);
    assert.ok(console.log.mock.calls.some(c => c.arguments[0].includes('Using cached SMS API specification')));

    assertNthCalledWith(
      console.log,
      2,
      'Spec already exists. Use --latest to re-download the latest version.',
    );
  });

  test('should re-download spec when --latest flag is used', async () => {
    existsSync.mock.mockImplementation(() => true);

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: true,
      latest: true,
      ...config,
    };

    await handler(argv);

    assertCalledWith(
      fetch,
      'https://developer.vonage.com/api/v1/developer/api/file/sms?format=json&vendorId=vonage',
    );
    assertCalledWith(
      writeFile,
      '/tmp/.vonage/mock/sms-spec.json',
      JSON.stringify(mockSpec, null, 2),
    );
    assert.ok(console.log.mock.calls.some(c => c.arguments[0].includes('Re-downloaded SMS API specification')));
  });

  test('should download spec when file does not exist', async () => {
    existsSync.mock.mockImplementation(() => false);

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: true,
      latest: false,
      ...config,
    };

    await handler(argv);

    assertCalledWith(
      fetch,
      'https://developer.vonage.com/api/v1/developer/api/file/sms?format=json&vendorId=vonage',
    );
    assertCalledWith(
      writeFile,
      '/tmp/.vonage/mock/sms-spec.json',
      JSON.stringify(mockSpec, null, 2),
    );
    assert.ok(console.log.mock.calls.some(c => c.arguments[0].includes('Downloaded SMS API specification')));
  });

  test('should start Prism server with bundled CLI', async () => {
    childEventEmitter.mock.mockImplementationOnce((_, callback) => {
      callback('Prisim is listening on port 42');
    });

    // Mock inputFromTTY to simulate immediate quit
    const { inputFromTTY } = __moduleMocks['../../src/ux/input.js'];
    console.log(inputFromTTY);

    inputFromTTY.mock.mockImplementation(() => Promise.reject('Shutdown'));

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: false,
      ...config,
    };

    await handler(argv);

    // Check that spawn was called with the correct bundled prism path
    assert.ok(spawn.mock.callCount() > 0);
    const spawnCall = spawn.mock.calls[0].arguments;
    assert.ok(spawnCall[0].includes('node_modules/.bin/prism'));
    assert.strictEqual(spawnCall[1][0], 'mock');
    assert.ok(spawnCall[1][1].includes('sms-spec.json'));
    assert.strictEqual(spawnCall[1][2], '--port');
    assert.strictEqual(spawnCall[1][3], '4010');
    assert.strictEqual(spawnCall[1][4], '--host');
    assert.strictEqual(spawnCall[1][5], 'localhost');
    assert.ok(spawnCall[2] !== null && typeof spawnCall[2] === 'object');

    assert.ok(console.log.mock.calls.some(c => c.arguments[0].includes('Using bundled Prism CLI')));
  });
});
