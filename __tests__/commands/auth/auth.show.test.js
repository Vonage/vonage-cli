import { jest, describe, test, beforeEach, afterAll, expect } from '@jest/globals';
import yaml from 'yaml';
import { mockConsole } from '../../helpers.js';
import { getTestMiddlewareArgs, testPrivateKey, testPublicKey } from '../../common.js';
import { getBasicApplication } from '../../app.js';

const exitMock = jest.fn();
const yargs = jest.fn().mockImplementation(() => ({ exit: exitMock }));

jest.unstable_mockModule('yargs', () => ({
  default: yargs,
}));

const mockGetApplicationPage = jest.fn();
const mockGetApplication = jest.fn();

jest.unstable_mockModule('@vonage/server-sdk', () => {
  const Vonage = jest.fn();
  return { Vonage };
});

const { Vonage } = await import('@vonage/server-sdk');
const { handler } = await import('../../../src/commands/auth/show.js');

const oldProcessStdoutWrite = process.stdout.write;

describe('Command: vonage auth show and vonage auth', () => {
  beforeEach(() => {
    process.stdout.write = jest.fn();
    mockConsole();
    mockGetApplicationPage.mockReset();
    mockGetApplication.mockReset();
    Vonage.mockReset();
    Vonage.mockImplementation(() => ({
      applications: {
        getApplication: mockGetApplication,
        getApplicationPage: mockGetApplicationPage,
      },
    }));
  });

  afterAll(() => {
    process.stdout.write = oldProcessStdoutWrite;
  });

  test('Should show the config settings, validate them', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mockResolvedValue({ response: { status: 200 } });
    mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      local: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
      global: {
        ...args.config.global,
        privateKey: testPrivateKey,
      },
    };

    await handler(args);

    const { config } = args;
    expect(console.info).toHaveBeenCalledWith('Displaying auth information');
    expect(console.log).toHaveBeenNthCalledWith(1, `Local credentials found at: ${config.localConfigFile}`);

    const redactedLocal = `${config.local.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.local.apiSecret}`.length - 2);
    expect(console.log).toHaveBeenNthCalledWith(
      3,
      [
        `API Key: ${config.local.apiKey}`,
        `API Secret: ${redactedLocal}`,
        `App ID: ${config.local.appId}`,
        'Private Key: Is Set',
      ].join('\n'),
    );

    expect(console.log).toHaveBeenNthCalledWith(5, `Global credentials found at: ${config.globalConfigFile}`);

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    expect(console.log).toHaveBeenNthCalledWith(
      7,
      [
        `API Key: ${config.global.apiKey}`,
        `API Secret: ${redactedGlobal}`,
        `App ID: ${config.global.appId}`,
        'Private Key: Is Set',
      ].join('\n'),
    );

    // twice once for local and once for global
    expect(mockGetApplicationPage).toHaveBeenCalledTimes(2);
    expect(mockGetApplication).toHaveBeenCalledTimes(2);
    expect(mockGetApplication).toHaveBeenNthCalledWith(1, config.local.appId);
    expect(mockGetApplication).toHaveBeenNthCalledWith(2, config.global.appId);
  });

  test('Should show only the local config settings', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mockResolvedValue({ response: { status: 200 } });
    mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      local: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
      global: {},
    };

    await handler(args);

    const { config } = args;
    expect(console.info).toHaveBeenCalledWith('Displaying auth information');
    expect(console.log).toHaveBeenNthCalledWith(1, `Local credentials found at: ${config.localConfigFile}`);

    const redactedLocal = `${config.local.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.local.apiSecret}`.length - 2);
    expect(console.log).toHaveBeenNthCalledWith(
      3,
      [
        `API Key: ${config.local.apiKey}`,
        `API Secret: ${redactedLocal}`,
        `App ID: ${config.local.appId}`,
        'Private Key: Is Set',
      ].join('\n'),
    );

    expect(mockGetApplicationPage).toHaveBeenCalledTimes(1);
    expect(mockGetApplication).toHaveBeenCalledTimes(1);
    expect(mockGetApplication).toHaveBeenCalledWith(config.local.appId);
  });

  test('Should show only the global config settings', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mockResolvedValue({ response: { status: 200 } });
    mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      local: {},
      global: {
        ...args.config.global,
        privateKey: testPrivateKey,
      },
    };

    await handler(args);

    const { config } = args;
    expect(console.info).toHaveBeenCalledWith('Displaying auth information');
    expect(console.log).toHaveBeenNthCalledWith(1, `Global credentials found at: ${config.globalConfigFile}`);

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    expect(console.log).toHaveBeenNthCalledWith(
      3,
      [
        `API Key: ${config.global.apiKey}`,
        `API Secret: ${redactedGlobal}`,
        `App ID: ${config.global.appId}`,
        'Private Key: Is Set',
      ].join('\n'),
    );

    expect(mockGetApplicationPage).toHaveBeenCalledTimes(1);
    expect(mockGetApplication).toHaveBeenCalledTimes(1);
    expect(mockGetApplication).toHaveBeenCalledWith(config.global.appId);
  });

  test('Should show only the API Key and Secret', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mockResolvedValue({ response: { status: 200 } });

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      local: {},
      global: {
        apiKey: args.config.global.apiKey,
        apiSecret: args.config.global.apiSecret,
      },
    };

    await handler(args);

    const { config } = args;
    expect(console.info).toHaveBeenCalledWith('Displaying auth information');
    expect(console.log).toHaveBeenNthCalledWith(1, `Global credentials found at: ${config.globalConfigFile}`);

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    expect(console.log).toHaveBeenNthCalledWith(
      3,
      [
        `API Key: ${config.global.apiKey}`,
        `API Secret: ${redactedGlobal}`,
      ].join('\n'),
    );

    expect(mockGetApplicationPage).toHaveBeenCalledTimes(1);
    expect(mockGetApplication).not.toHaveBeenCalled();
  });

  test('Should show only the App Id and Private Key', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs() };
    args.config = {
      ...args.config,
      local: {},
      global: {
        apiKey: args.config.global.apiKey,
        apiSecret: args.config.global.apiSecret,
        appId: args.config.global.appId,
        privateKey: testPrivateKey,
      },
    };

    await handler(args);

    const { config } = args;

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    expect(console.info).toHaveBeenCalledWith('Displaying auth information');
    expect(console.log).toHaveBeenNthCalledWith(1, `Global credentials found at: ${config.globalConfigFile}`);

    expect(console.log).toHaveBeenNthCalledWith(
      3,
      [
        `API Key: ${config.global.apiKey}`,
        `API Secret: ${redactedGlobal}`,
        `App ID: ${config.global.appId}`,
        'Private Key: Is Set',
      ].join('\n'),
    );

    expect(mockGetApplicationPage).toHaveBeenCalled();
    expect(mockGetApplication).toHaveBeenCalledTimes(1);
    expect(mockGetApplication).toHaveBeenCalledWith(config.global.appId);
  });

  test('Should show the full Private Key and API Secret', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      local: {},
      global: {
        ...args.config.global,
        privateKey: testPrivateKey,
      },
    };

    await handler({
      showAll: true,
      ...args,
    });

    const { config } = args;

    expect(console.log).toHaveBeenNthCalledWith(
      3,
      [
        `API Key: ${config.global.apiKey}`,
        `API Secret: ${config.global.apiSecret}`,
        `App ID: ${config.global.appId}`,
        `Private Key: ${testPrivateKey}`,
      ].join('\n'),
    );
  });

  test('should output JSON', async () => {
    const args = getTestMiddlewareArgs();
    handler({
      ...args,
      json: true,
    });

    const { config } = args;
    expect(console.table).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenNthCalledWith(1, JSON.stringify([config.local, config.global], null, 2));
  });

  test('should output YAML', async () => {
    const args = getTestMiddlewareArgs();
    handler({
      ...args,
      yaml: true,
    });

    const { config } = args;
    expect(console.table).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenNthCalledWith(1, yaml.stringify([config.local, config.global], null, 2));
  });
});
