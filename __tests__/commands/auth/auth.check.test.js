process.env.FORCE_COLOR = 0;
const { faker } = require('@faker-js/faker');
const { handler } = require('../../../src/commands/auth/check');
const { mockConsole } = require('../../helpers');
const { getTestMiddlewareArgs, testPrivateKey, testPublicKey } = require('../../common');
const { Vonage } = require('@vonage/server-sdk');
const { getBasicApplication } = require('../../app');
const yargs = require('yargs');

jest.mock('@vonage/server-sdk');
jest.mock('yargs');

const oldProcessStdoutWrite = process.stdout.write;

describe('Command: vonage auth check', () => {
  let consoleMock;

  beforeEach(() => {
    process.stdout.write = jest.fn();
    consoleMock = mockConsole();
  });

  afterAll(() => {
    process.stdout.write = oldProcessStdoutWrite;
  });

  test('Should validate the global config settings', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    Vonage._mockGetApplicationPage.mockResolvedValue({response: {status: 200}});
    Vonage._mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs()};

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
    expect(consoleMock.log.mock.calls[0][0]).toBe(`Global credentials found at: ${config.globalConfigFile}`);

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    expect(consoleMock.log.mock.calls[2][0]).toBe([
      `API Key: ${config.global.apiKey}`,
      `API Secret: ${redactedGlobal}`,
      `App ID: ${config.global.appId}`,
      'Private Key: Is Set',
    ].join('\n'));

    expect(Vonage._mockGetApplicationPage).toHaveBeenCalledTimes(1);
    expect(Vonage._mockGetApplication).toHaveBeenCalledTimes(1);
    expect(Vonage._mockGetApplication.mock.calls[0][0]).toEqual(config.global.appId);
  });

  test('Should validate the local config settings', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    Vonage._mockGetApplicationPage.mockResolvedValue({response: {status: 200}});
    Vonage._mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs()};

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
    expect(consoleMock.log.mock.calls[0][0]).toBe(`Local credentials found at: ${config.localConfigFile}`);

    const redactedLocal = `${config.local.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.local.apiSecret}`.length - 2);
    expect(consoleMock.log.mock.calls[2][0]).toBe([
      `API Key: ${config.local.apiKey}`,
      `API Secret: ${redactedLocal}`,
      `App ID: ${config.local.appId}`,
      'Private Key: Is Set',
    ].join('\n'));

    expect(Vonage._mockGetApplicationPage).toHaveBeenCalledTimes(1);
    expect(Vonage._mockGetApplication).toHaveBeenCalledTimes(1);
    expect(Vonage._mockGetApplication.mock.calls[0][0]).toEqual(config.local.appId);
  });

  test('Should validate the cli arguments config settings', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    Vonage._mockGetApplicationPage.mockResolvedValue({response: {status: 200}});
    Vonage._mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs()};

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await handler(args);

    const { config } = args;
    expect(consoleMock.log.mock.calls[0][0]).toBe('CLI arguments');

    const redactedCli = `${config.cli.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.cli.apiSecret}`.length - 2);
    expect(consoleMock.log.mock.calls[2][0]).toBe([
      `API Key: ${config.cli.apiKey}`,
      `API Secret: ${redactedCli}`,
      `App ID: ${config.cli.appId}`,
      'Private Key: Is Set',
    ].join('\n'));

    expect(Vonage._mockGetApplicationPage).toHaveBeenCalledTimes(1);
    expect(Vonage._mockGetApplication).toHaveBeenCalledTimes(1);
    expect(Vonage._mockGetApplication.mock.calls[0][0]).toEqual(config.cli.appId);
  });

  test('Should validate the API Key and Secret only in the CLI', async () => {
    Vonage._mockGetApplicationPage.mockResolvedValue({response: {status: 200}});

    const args = { ...getTestMiddlewareArgs()};

    args.config = {
      ...args.config,
      cli: {
        apiKey: args.config.local.apiKey,
        apiSecret: args.config.local.apiSecret,
      },
    };

    await handler(args);

    const { config } = args;
    expect(consoleMock.log.mock.calls[0][0]).toBe('CLI arguments');

    const redactedCli = `${config.cli.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.cli.apiSecret}`.length - 2);
    expect(consoleMock.log.mock.calls[2][0]).toBe([
      `API Key: ${config.cli.apiKey}`,
      `API Secret: ${redactedCli}`,
    ].join('\n'));

    expect(Vonage._mockGetApplicationPage).toHaveBeenCalledTimes(1);
    expect(Vonage._mockGetApplication).not.toHaveBeenCalled();
  });

  test('Should fail to validate no config is found', async () => {
    const args = { ...getTestMiddlewareArgs()};

    args.config = {
      ...args.config,
      localConfigExists: false,
      globalConfigExists: false,
      cli: {},
      local: {},
      global: {},
    };

    await handler(args);

    expect(consoleMock.log.mock.calls[0][0]).toBe('error: No configuration file found');

    expect(Vonage._mockGetApplicationPage).not.toHaveBeenCalled();
    expect(Vonage._mockGetApplication).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(2);
  });

  test('Should fail to validate the config settings', async () => {
    Vonage._mockGetApplicationPage.mockRejectedValue({response: {status: 401}});
    Vonage._mockGetApplication.mockRejectedValue({response: {status: 401}});

    const args = { ...getTestMiddlewareArgs()};

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
    expect(consoleMock.log.mock.calls[0][0]).toBe(`Global credentials found at: ${config.globalConfigFile}`);

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    expect(consoleMock.log.mock.calls[2][0]).toBe([
      `API Key: ${config.global.apiKey}`,
      `API Secret: ${redactedGlobal}`,
      `App ID: ${config.global.appId}`,
      'Private Key: Is Set',
    ].join('\n'));

    expect(Vonage._mockGetApplicationPage).toHaveBeenCalledTimes(1);
    expect(Vonage._mockGetApplication).toHaveBeenCalledTimes(1);
    expect(Vonage._mockGetApplication.mock.calls[0][0]).toEqual(config.global.appId);
    expect(yargs.exit).toHaveBeenCalledWith(5);
  });

  test('Should fail to validate the config settings with invalid private key', async () => {
    const args = { ...getTestMiddlewareArgs()};

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
    expect(consoleMock.log.mock.calls[0][0]).toBe(`Global credentials found at: ${config.globalConfigFile}`);

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    expect(consoleMock.log.mock.calls[2][0]).toBe([
      `API Key: ${config.global.apiKey}`,
      `API Secret: ${redactedGlobal}`,
      `App ID: ${config.global.appId}`,
      'Private Key: INVALID KEY',
    ].join('\n'));

    expect(Vonage._mockGetApplicationPage).toHaveBeenCalledTimes(1);
    expect(Vonage._mockGetApplication).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(22);
  });

});

