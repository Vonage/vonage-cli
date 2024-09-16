process.env.FORCE_COLOR = 0;
const yaml = require('yaml');
const { handler } = require('../../../src/commands/auth/show');
const { mockConsole } = require('../../helpers');
const { getTestMiddlewareArgs, testPrivateKey, testPublicKey } = require('../../common');
const { Vonage } = require('@vonage/server-sdk');
const { getBasicApplication } = require('../../apps');

jest.mock('@vonage/server-sdk');

const oldProcessStdoutWrite = process.stdout.write;

describe('Command: vonage auth', () => {
  let consoleMock;

  beforeEach(() => {
    process.stdout.write = jest.fn();
    consoleMock = mockConsole();
  });

  afterAll(() => {
    process.stdout.write = oldProcessStdoutWrite;
  });

  test('Should show the config settings, validate them', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    Vonage._mockGetApplicationPage.mockResolvedValue({response: {status: 200}});
    Vonage._mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs()};

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
    expect(consoleMock.info).toHaveBeenCalledWith('Displaying auth information');
    expect(consoleMock.log.mock.calls[0][0]).toBe(`Local credentials found at: ${config.localConfigFile}`);

    const redactedLocal = `${config.local.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.local.apiSecret}`.length - 2);
    expect(consoleMock.log.mock.calls[2][0]).toBe([
      `API Key: ${config.local.apiKey}`,
      `API Secret: ${redactedLocal}`,
      `App ID: ${config.local.appId}`,
      'Private Key: Is Set',
    ].join('\n'));

    expect(consoleMock.log.mock.calls[7][0]).toBe(`Global credentials found at: ${config.globalConfigFile}`);

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    expect(consoleMock.log.mock.calls[9][0]).toBe([
      `API Key: ${config.global.apiKey}`,
      `API Secret: ${redactedGlobal}`,
      `App ID: ${config.global.appId}`,
      'Private Key: Is Set',
    ].join('\n'));

    // twice once for local and once for global
    expect(Vonage._mockGetApplicationPage).toHaveBeenCalledTimes(2);
    expect(Vonage._mockGetApplication).toHaveBeenCalledTimes(2);
    expect(Vonage._mockGetApplication.mock.calls[0][0]).toEqual(config.local.appId);
    expect(Vonage._mockGetApplication.mock.calls[1][0]).toEqual(config.global.appId);
  });

  test('Should show only the local config settings', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    Vonage._mockGetApplicationPage.mockResolvedValue({response: {status: 200}});
    Vonage._mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs()};

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
    expect(consoleMock.info).toHaveBeenCalledWith('Displaying auth information');
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

  test('Should show only the global config settings', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    Vonage._mockGetApplicationPage.mockResolvedValue({response: {status: 200}});
    Vonage._mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs()};

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
    expect(consoleMock.info).toHaveBeenCalledWith('Displaying auth information');
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
    expect(Vonage._mockGetApplication).toHaveBeenCalledWith(config.global.appId);
  });

  test('Should show only the API Key and Secret', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    Vonage._mockGetApplicationPage.mockResolvedValue({response: {status: 200}});

    const args = { ...getTestMiddlewareArgs()};

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
    expect(consoleMock.info).toHaveBeenCalledWith('Displaying auth information');
    expect(consoleMock.log.mock.calls[0][0]).toBe(`Global credentials found at: ${config.globalConfigFile}`);

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    expect(consoleMock.log.mock.calls[2][0]).toBe([
      `API Key: ${config.global.apiKey}`,
      `API Secret: ${redactedGlobal}`,
    ].join('\n'));

    expect(Vonage._mockGetApplicationPage).toHaveBeenCalledTimes(1);
    expect(Vonage._mockGetApplication).not.toHaveBeenCalled();
  });

  test('Should show only the App Id and Private Key', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    Vonage._mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs()};

    args.config = {
      ...args.config,
      local: {},
      global: {
        appId: args.config.global.appId,
        privateKey: testPrivateKey,
      },
    };

    await handler(args);

    const { config } = args;
    expect(consoleMock.info).toHaveBeenCalledWith('Displaying auth information');
    expect(consoleMock.log.mock.calls[0][0]).toBe(`Global credentials found at: ${config.globalConfigFile}`);

    expect(consoleMock.log.mock.calls[2][0]).toBe([
      `App ID: ${config.global.appId}`,
      'Private Key: Is Set',
    ].join('\n'));

    expect(Vonage._mockGetApplicationPage).not.toHaveBeenCalled();
    expect(Vonage._mockGetApplication).toHaveBeenCalledTimes(1);

    expect(Vonage._mockGetApplication).toHaveBeenCalledWith(config.global.appId);
  });

  test('Should show the full Private Key and API Secret', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    Vonage._mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs()};

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

    expect(consoleMock.log.mock.calls[2][0]).toBe([
      `API Key: ${config.global.apiKey}`,
      `API Secret: ${config.global.apiSecret}`,
      `App ID: ${config.global.appId}`,
      `Private Key: ${testPrivateKey}`,
    ].join('\n'));
  });

  test('should output JSON', async () => {
    const args = getTestMiddlewareArgs();
    handler({
      ...args,
      json: true,
    });

    const {config} = args;
    expect(consoleMock.table).not.toHaveBeenCalled();
    expect(consoleMock.log.mock.calls).toEqual([[JSON.stringify([config.local, config.global], null, 2)]]);
  });

  test('should output YAML', async () => {
    const args = getTestMiddlewareArgs();
    handler({
      ...args,
      yaml: true,
    });

    const {config} = args;
    expect(consoleMock.table).not.toHaveBeenCalled();
    expect(consoleMock.log.mock.calls).toEqual([[yaml.stringify([config.local, config.global], null, 2)]]);
  });
});
