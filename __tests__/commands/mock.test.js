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
      default: jest.fn(),
    }))(),
    'node:fs': (() => ({
      existsSync: jest.fn(),
      readFileSync: jest.fn(),
    }))(),
    '../../src/utils/fs.js': (() => ({
      createDirectory: jest.fn(),
      writeFile: jest.fn(),
    }))(),
    '../../src/middleware/config.js': (() => ({
      getSharedConfig: jest.fn(() => ({
        globalConfigPath: '/tmp/.vonage',
      })),
      APISpecs: {
        'sms': 'https://developer.vonage.com/api/v1/developer/api/file/sms?format=json&vendorId=vonage',
      },
    }))(),
    'child_process': (() => ({
      spawn: jest.fn(),
    }))(),
    '../../src/ux/spinner.js': (() => ({
      spinner: jest.fn(() => ({
        stop: jest.fn(),
        fail: jest.fn(),
      })),
    }))(),
    '../../src/ux/cursor.js': (() => ({
      hideCursor: jest.fn(),
      resetCursor: jest.fn(),
    }))(),
    '../../src/ux/input.js': (() => ({
      inputFromTTY: jest.fn(),
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
    childEventEmitter = jest.fn();
    existsSync = (__moduleMocks['node:fs']).existsSync;
    fetch = (__moduleMocks['node-fetch']).default;
    spawn = (__moduleMocks['child_process']).spawn;
    handler = (await loadModule(import.meta.url, '../../src/commands/mock.js', __moduleMocks)).handler;

    childEventEmitter.mockImplementationOnce((_, callback) => {
      callback('Prisim is listening on port 42');
    });

    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockSpec),
    });

    createDirectory.mockReturnValue(true);
    writeFile.mockResolvedValue();
    spawn.mockReturnValue({
      stderr: {
        on: jest.fn(),
      },
      stdout: {
        on: childEventEmitter,
      },
      on: jest.fn(),
      kill: jest.fn(),
      killed: false,
      unref: jest.fn(),
      ref: jest.fn(),
    });
  });

  afterEach(() => {
    fetch.mockClear();
    writeFile.mockClear();
    childEventEmitter.mockClear();
    jest.restoreAllMocks();
  });

  test('should download SMS API spec successfully', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockSpec),
    });

    createDirectory.mockReturnValue(true);
    writeFile.mockResolvedValue();

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: true,
      ...config,
    };

    await handler(argv);

    expect(fetch).toHaveBeenCalledWith(
      'https://developer.vonage.com/api/v1/developer/api/file/sms?format=json&vendorId=vonage',
    );
    expect(createDirectory).toHaveBeenCalledWith('/tmp/.vonage/mock');
    expect(writeFile).toHaveBeenCalledWith(
      '/tmp/.vonage/mock/sms-spec.json',
      JSON.stringify(mockSpec, null, 2),
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Downloaded SMS API specification'),
    );
  });

  test('should handle download failure gracefully', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    createDirectory.mockReturnValue(true);

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: true,
      ...config,
    };

    await expect(handler(argv)).rejects.toThrow('Failed to download API specification');

    expect(console.error).toHaveBeenCalledWith(
      'Failed to download API specification:',
      'Failed to download spec: 404 Not Found',
    );
  });

  test('should handle download failure', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: true,
      ...config,
    };

    await expect(handler(argv)).rejects.toThrow('Failed to download API specification');

    expect(console.error).toHaveBeenCalledWith(
      'Failed to download API specification:',
      'Network error',
    );
  });

  test('should handle directory creation failure', async () => {
    createDirectory.mockImplementation(() => {
      throw new Error('Permission denied');
    });

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: true,
      ...config,
    };

    await expect(handler(argv)).rejects.toThrow('Failed to create mock directory');

    expect(console.error).toHaveBeenCalledWith(
      'Failed to create mock directory:',
      'Permission denied',
    );
  });

  test('should use cached spec when file exists and --latest is not used', async () => {
    existsSync.mockReturnValue(true); // File exists

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: true,
      latest: false,
      ...config,
    };

    await handler(argv);

    expect(fetch).not.toHaveBeenCalled();
    expect(writeFile).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Using cached SMS API specification'),
    );

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      'Spec already exists. Use --latest to re-download the latest version.',
    );
  });

  test('should re-download spec when --latest flag is used', async () => {
    existsSync.mockReturnValue(true); // File exists

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: true,
      latest: true,
      ...config,
    };

    await handler(argv);

    expect(fetch).toHaveBeenCalledWith(
      'https://developer.vonage.com/api/v1/developer/api/file/sms?format=json&vendorId=vonage',
    );
    expect(writeFile).toHaveBeenCalledWith(
      '/tmp/.vonage/mock/sms-spec.json',
      JSON.stringify(mockSpec, null, 2),
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Re-downloaded SMS API specification'),
    );
  });

  test('should download spec when file does not exist', async () => {
    existsSync.mockReturnValue(false); // File does not exist

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: true,
      latest: false,
      ...config,
    };

    await handler(argv);

    expect(fetch).toHaveBeenCalledWith(
      'https://developer.vonage.com/api/v1/developer/api/file/sms?format=json&vendorId=vonage',
    );
    expect(writeFile).toHaveBeenCalledWith(
      '/tmp/.vonage/mock/sms-spec.json',
      JSON.stringify(mockSpec, null, 2),
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Downloaded SMS API specification'),
    );
  });

  test('should start Prism server with bundled CLI', async () => {
    childEventEmitter.mockImplementationOnce((_, callback) => {
      callback('Prisim is listening on port 42');
    });

    // Mock inputFromTTY to simulate immediate quit
    const { inputFromTTY } = __moduleMocks['../../src/ux/input.js'];
    console.log(inputFromTTY);

    inputFromTTY.mockRejectedValue('Shutdown');

    const argv = {
      api: 'sms',
      port: 4010,
      host: 'localhost',
      downloadOnly: false,
      ...config,
    };

    await handler(argv);

    // Check that spawn was called with the correct bundled prism path
    expect(spawn).toHaveBeenCalledWith(
      expect.stringContaining('node_modules/.bin/prism'),
      ['mock', expect.stringContaining('sms-spec.json'), '--port', '4010', '--host', 'localhost'],
      expect.any(Object),
    );

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Using bundled Prism CLI'),
    );
  });
});
