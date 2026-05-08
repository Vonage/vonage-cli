import { faker } from '@faker-js/faker';
import { mockConsole } from '../../helpers.js';
import { getTestMiddlewareArgs, testPrivateKey, testPublicKey } from '../../common.js';
import { getBasicApplication } from '../../app.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const oldProcessStdoutWrite = process.stdout.write;

describe('Command: vonage auth check', () => {
  let mockGetApplicationPage = mock.fn();
  let mockGetApplication = mock.fn();

  // mock.fn() from node:test cannot be used with `new`, so use a trackable constructor.
  const vonageClassCalls = [];
  let VonageClass = function(...args) {
    vonageClassCalls.push({ arguments: args });
    return {
      applications: {
        getApplication: mockGetApplication,
        getApplicationPage: mockGetApplicationPage,
      },
    };
  };
  VonageClass.mock = {
    get calls() { return vonageClassCalls; },
    callCount() { return vonageClassCalls.length; },
    resetCalls() { vonageClassCalls.length = 0; },
  };
  let handler;

  beforeEach(async () => {
    process.stdout.write = mock.fn();
    mockConsole();
    mockGetApplicationPage = mock.fn();
    mockGetApplication = mock.fn();

    const __moduleMocks = {
      'yargs': (() => ({
        default: yargs,
      }))(),
      '@vonage/server-sdk': (() => ({
        Vonage: VonageClass,
      }))(),
    };

    handler = (await loadModule(import.meta.url, '../../../src/commands/auth/check.js', __moduleMocks)).handler;
  });

  afterAll(() => {
    process.stdout.write = oldProcessStdoutWrite;
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    VonageClass.mock.resetCalls();
    mockGetApplicationPage.mock.resetCalls();
    mockGetApplication.mock.resetCalls();
  });

  test('Should validate the global config settings', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({ response: { status: 200 } }));
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));

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
    assertNthCalledWith(console.log, 1, `Global credentials found at: ${config.globalConfigFile}`);

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    assertNthCalledWith(
      console.log,
      3,
      [
        `API Key: ${config.global.apiKey}`,
        `API Secret: ${redactedGlobal}`,
        `App ID: ${config.global.appId}`,
        'Private Key: Is Set',
      ].join('\n'),
    );

    assert.strictEqual(mockGetApplicationPage.mock.callCount(), 1);
    assert.strictEqual(mockGetApplication.mock.callCount(), 1);
    assertCalledWith(mockGetApplication, config.global.appId);
  });

  test('Should validate the local config settings', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({ response: { status: 200 } }));
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));

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
    assertNthCalledWith(console.log, 1, `Local credentials found at: ${config.localConfigFile}`);

    const redactedLocal = `${config.local.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.local.apiSecret}`.length - 2);
    assertNthCalledWith(
      console.log,
      3,
      [
        `API Key: ${config.local.apiKey}`,
        `API Secret: ${redactedLocal}`,
        `App ID: ${config.local.appId}`,
        'Private Key: Is Set',
      ].join('\n'),
    );

    assert.strictEqual(mockGetApplicationPage.mock.callCount(), 1);
    assert.strictEqual(mockGetApplication.mock.callCount(), 1);
    assertCalledWith(mockGetApplication, config.local.appId);
  });

  test('Should validate the cli arguments config settings', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({ response: { status: 200 } }));
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));

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
    assertNthCalledWith(console.log, 1, 'CLI arguments');

    const redactedCli = `${config.cli.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.cli.apiSecret}`.length - 2);
    assertNthCalledWith(
      console.log,
      3,
      [
        `API Key: ${config.cli.apiKey}`,
        `API Secret: ${redactedCli}`,
        `App ID: ${config.cli.appId}`,
        'Private Key: Is Set',
      ].join('\n'),
    );

    assert.strictEqual(mockGetApplicationPage.mock.callCount(), 1);
    assert.strictEqual(mockGetApplication.mock.callCount(), 1);
    assertCalledWith(mockGetApplication, config.cli.appId);
  });

  test('Should validate the API Key and Secret only in the CLI', async () => {
    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({ response: { status: 200 } }));

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
    assertNthCalledWith(console.log, 1, 'CLI arguments');

    const redactedCli = `${config.cli.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.cli.apiSecret}`.length - 2);
    assertNthCalledWith(
      console.log,
      3,
      [
        `API Key: ${config.cli.apiKey}`,
        `API Secret: ${redactedCli}`,
      ].join('\n'),
    );

    assert.strictEqual(mockGetApplicationPage.mock.callCount(), 1);
    assert.strictEqual(mockGetApplication.mock.callCount(), 0);
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

    assertNthCalledWith(console.log, 1, 'error: No configuration file found');

    assert.strictEqual(mockGetApplicationPage.mock.callCount(), 0);
    assert.strictEqual(mockGetApplication.mock.callCount(), 0);
    assertCalledWith(exitMock, 2);
  });

  test('Should fail to validate the config settings', async () => {
    mockGetApplicationPage.mock.mockImplementation(() => Promise.reject({ response: { status: 401 } }));
    mockGetApplication.mock.mockImplementation(() => Promise.reject({ response: { status: 401 } }));

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
    assertNthCalledWith(console.log, 1, `Global credentials found at: ${config.globalConfigFile}`);

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    assertNthCalledWith(
      console.log,
      3,
      [
        `API Key: ${config.global.apiKey}`,
        `API Secret: ${redactedGlobal}`,
        `App ID: ${config.global.appId}`,
        'Private Key: Is Set',
      ].join('\n'),
    );

    assert.strictEqual(mockGetApplicationPage.mock.callCount(), 1);
    assert.strictEqual(mockGetApplication.mock.callCount(), 1);
    assertCalledWith(mockGetApplication, config.global.appId);
    assertCalledWith(exitMock, 5);
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
    assertNthCalledWith(console.log, 1, `Global credentials found at: ${config.globalConfigFile}`);

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    assertNthCalledWith(
      console.log,
      3,
      [
        `API Key: ${config.global.apiKey}`,
        `API Secret: ${redactedGlobal}`,
        `App ID: ${config.global.appId}`,
        'Private Key: INVALID KEY',
      ].join('\n'),
    );

    assert.strictEqual(mockGetApplicationPage.mock.callCount(), 1);
    assert.strictEqual(mockGetApplication.mock.callCount(), 0);
    assertCalledWith(exitMock, 22);
  });
});
