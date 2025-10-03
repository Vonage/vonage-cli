const { handler } = require('../../src/commands/mock');

// Mock dependencies
jest.mock('node-fetch');
jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));
jest.mock('../../src/utils/fs', () => ({
  createDirectory: jest.fn(),
  writeFile: jest.fn(),
}));
jest.mock('../../src/middleware/config', () => ({
  getSharedConfig: jest.fn(() => ({
    globalConfigPath: '/tmp/.vonage',
  })),
  APISpecs: {
    'sms': 'https://developer.vonage.com/api/v1/developer/api/file/sms?format=json&vendorId=vonage',
  },
}));
jest.mock('child_process');
jest.mock('../../src/ux/spinner', () => ({
  spinner: jest.fn(() => ({
    stop: jest.fn(),
    fail: jest.fn(),
  })),
}));
jest.mock('../../src/ux/cursor', () => ({
  hideCursor: jest.fn(),
  resetCursor: jest.fn(),
}));
jest.mock('../../src/ux/input', () => ({
  inputFromTTY: jest.fn(),
}));

const fetch = require('node-fetch');
const { existsSync } = require('fs');
const { createDirectory, writeFile } = require('../../src/utils/fs');
const { spawn } = require('child_process');

describe('mock command', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.info = jest.fn();
    console.log = jest.fn();
    console.error = jest.fn();
    existsSync.mockReturnValue(false); // Default to file not existing
  });

  describe('download functionality', () => {
    it('should download SMS API spec successfully', async () => {
      const mockSpec = { 
        openapi: '3.0.0',
        info: { title: 'SMS API', version: '1.0.0' },
        paths: {},
      };

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

    it('should handle download failure gracefully', async () => {
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
      };

      await expect(handler(argv)).rejects.toThrow('Failed to download API specification');

      expect(console.error).toHaveBeenCalledWith(
        'Failed to download API specification:',
        'Failed to download spec: 404 Not Found',
      );
    });

    it('should handle download failure', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      const argv = {
        api: 'sms',
        port: 4010,
        host: 'localhost',
        downloadOnly: true,
      };

      await expect(handler(argv)).rejects.toThrow('Failed to download API specification');

      expect(console.error).toHaveBeenCalledWith(
        'Failed to download API specification:',
        'Network error',
      );
    });
  });

  describe('directory creation', () => {
    it('should handle directory creation failure', async () => {
      createDirectory.mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const argv = {
        api: 'sms',
        port: 4010,
        host: 'localhost',
        downloadOnly: true,
      };

      await expect(handler(argv)).rejects.toThrow('Failed to create mock directory');

      expect(console.error).toHaveBeenCalledWith(
        'Failed to create mock directory:',
        'Permission denied',
      );
    });
  });

  describe('caching functionality', () => {
    const mockSpec = { 
      openapi: '3.0.0',
      info: { title: 'SMS API', version: '1.0.0' },
      paths: {},
    };

    beforeEach(() => {
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSpec),
      });
      createDirectory.mockReturnValue(true);
      writeFile.mockResolvedValue();
    });

    it('should use cached spec when file exists and --latest is not used', async () => {
      existsSync.mockReturnValue(true); // File exists

      const argv = {
        api: 'sms',
        port: 4010,
        host: 'localhost',
        downloadOnly: true,
        latest: false,
      };

      await handler(argv);

      expect(fetch).not.toHaveBeenCalled();
      expect(writeFile).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Using cached SMS API specification'),
      );
      expect(console.log).toHaveBeenCalledWith(
        'Spec already exists. Use --latest to re-download the latest version.',
      );
    });

    it('should re-download spec when --latest flag is used', async () => {
      existsSync.mockReturnValue(true); // File exists

      const argv = {
        api: 'sms',
        port: 4010,
        host: 'localhost',
        downloadOnly: true,
        latest: true,
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

    it('should download spec when file does not exist', async () => {
      existsSync.mockReturnValue(false); // File does not exist

      const argv = {
        api: 'sms',
        port: 4010,
        host: 'localhost',
        downloadOnly: true,
        latest: false,
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
  });

  describe('Prism server startup', () => {
    beforeEach(() => {
      // Mock successful download
      const mockSpec = { openapi: '3.0.0', info: { title: 'SMS API' } };
      fetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockSpec),
      });
      createDirectory.mockReturnValue(true);
      writeFile.mockResolvedValue();
      
      // Mock spawn to return a process-like object
      spawn.mockReturnValue({
        on: jest.fn(),
        kill: jest.fn(),
        killed: false,
      });
    });

    it('should start Prism server with bundled CLI', async () => {
      const mockProcess = {
        on: jest.fn(),
        kill: jest.fn(),
        killed: false,
      };
      spawn.mockReturnValue(mockProcess);

      // Mock inputFromTTY to simulate immediate quit
      const { inputFromTTY } = require('../../src/ux/input');
      inputFromTTY.mockRejectedValue('Shutdown');

      const argv = {
        api: 'sms',
        port: 4010,
        host: 'localhost',
        downloadOnly: false,
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
});