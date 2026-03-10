import { jest, describe, test, beforeEach, expect } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { mockConsole } from '../../helpers';
import { getTestMiddlewareArgs, testPrivateKey, testPublicKey } from '../../common';
import { getBasicApplication } from '../../app';

const exitMock = jest.fn();
const yargs = jest.fn().mockImplementation(() => ({ exit: exitMock }));

jest.unstable_mockModule('yargs', () => ({
  default: yargs,
}));

const oldProcessStdoutWrite = process.stdout.write;

describe('Command: vonage auth check', () => {
  let mockGetApplicationPage = jest.fn();
  let mockGetApplication = jest.fn();

  let VonageClass = jest.fn().mockImplementation(() => {
    return {
      applications: {
        getApplication: mockGetApplication,
        getApplicationPage: mockGetApplicationPage,
      },
    };
  });
  let handler;

  jest.unstable_mockModule('@vonage/server-sdk', () => ({
    Vonage: VonageClass,
  }));


  beforeEach(async () => {
    process.stdout.write = jest.fn();
    mockConsole();
    mockGetApplicationPage = jest.fn();
    mockGetApplication = jest.fn();

    handler = (await import('../../../src/commands/auth/check.js')).handler;
  });

  afterAll(() => {
    process.stdout.write = oldProcessStdoutWrite;
    jest.resetAllMocks();
  });

  test('Should validate the global config settings', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mockResolvedValue({ response: { status: 200 } });
    mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {},
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

  test('Should validate the local config settings', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mockResolvedValue({ response: { status: 200 } });
    mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {},
      local: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
      global: {
        ...args.config.global,
        privateKey: testPrivateKey,
      },
    };

    await handler({
      local: true,
      ...args,
    });

    const { config } = args;
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

  test('Should validate the cli arguments config settings', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mockResolvedValue({ response: { status: 200 } });
    mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await handler(args);

    const { config } = args;
    expect(console.log).toHaveBeenNthCalledWith(1, 'CLI arguments');

    const redactedCli = `${config.cli.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.cli.apiSecret}`.length - 2);
    expect(console.log).toHaveBeenNthCalledWith(
      3,
      [
        `API Key: ${config.cli.apiKey}`,
        `API Secret: ${redactedCli}`,
        `App ID: ${config.cli.appId}`,
        'Private Key: Is Set',
      ].join('\n'),
    );

    expect(mockGetApplicationPage).toHaveBeenCalledTimes(1);
    expect(mockGetApplication).toHaveBeenCalledTimes(1);
    expect(mockGetApplication).toHaveBeenCalledWith(config.cli.appId);
  });

  test('Should validate the API Key and Secret only in the CLI', async () => {
    mockGetApplicationPage.mockResolvedValue({ response: { status: 200 } });

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        apiKey: args.config.local.apiKey,
        apiSecret: args.config.local.apiSecret,
      },
    };

    await handler(args);

    const { config } = args;
    expect(console.log).toHaveBeenNthCalledWith(1, 'CLI arguments');

    const redactedCli = `${config.cli.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.cli.apiSecret}`.length - 2);
    expect(console.log).toHaveBeenNthCalledWith(
      3,
      [
        `API Key: ${config.cli.apiKey}`,
        `API Secret: ${redactedCli}`,
      ].join('\n'),
    );

    expect(mockGetApplicationPage).toHaveBeenCalledTimes(1);
    expect(mockGetApplication).not.toHaveBeenCalled();
  });

  test('Should fail to validate no config is found', async () => {
    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      localConfigExists: false,
      globalConfigExists: false,
      cli: {},
      local: {},
      global: {},
    };

    await handler(args);

    expect(console.log).toHaveBeenNthCalledWith(1, 'error: No configuration file found');

    expect(mockGetApplicationPage).not.toHaveBeenCalled();
    expect(mockGetApplication).not.toHaveBeenCalled();
    expect(exitMock).toHaveBeenCalledWith(2);
  });

  test('Should fail to validate the config settings', async () => {
    mockGetApplicationPage.mockRejectedValue({ response: { status: 401 } });
    mockGetApplication.mockRejectedValue({ response: { status: 401 } });

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {},
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
    expect(exitMock).toHaveBeenCalledWith(5);
  });

  test('Should fail to validate the config settings with invalid private key', async () => {
    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {},
      global: {
        ...args.config.global,
        privateKey: faker.string.alpha(32),
      },
    };

    await handler(args);

    const { config } = args;
    expect(console.log).toHaveBeenNthCalledWith(1, `Global credentials found at: ${config.globalConfigFile}`);

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    expect(console.log).toHaveBeenNthCalledWith(
      3,
      [
        `API Key: ${config.global.apiKey}`,
        `API Secret: ${redactedGlobal}`,
        `App ID: ${config.global.appId}`,
        'Private Key: INVALID KEY',
      ].join('\n'),
    );

    expect(mockGetApplicationPage).toHaveBeenCalledTimes(1);
    expect(mockGetApplication).not.toHaveBeenCalled();
    expect(exitMock).toHaveBeenCalledWith(22);
  });
});

