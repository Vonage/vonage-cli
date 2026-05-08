import yaml from 'yaml';
import { mockConsole } from '../../helpers.js';
import { getTestMiddlewareArgs, testPrivateKey, testPublicKey } from '../../common.js';
import { getBasicApplication } from '../../app.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const mockGetApplicationPage = mock.fn();
const mockGetApplication = mock.fn();



const __moduleMocks = {
  'yargs': (() => ({
    default: yargs,
  }))(),
  '@vonage/server-sdk': (() => {
    const Vonage = mock.fn();
    return { Vonage };
  })(),
};

const { handler } = await loadModule(import.meta.url, '../../../src/commands/auth/show.js', __moduleMocks);
const { Vonage } = __moduleMocks['@vonage/server-sdk'];

const oldProcessStdoutWrite = process.stdout.write;

describe('Command: vonage auth show and vonage auth', () => {
  beforeEach(() => {
    process.stdout.write = mock.fn();
    mockConsole();
    mockGetApplicationPage.mock.resetCalls();
    mockGetApplication.mock.resetCalls();
    Vonage.mock.resetCalls();
    Vonage.mock.mockImplementation(() => ({
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

    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({ response: { status: 200 } }));
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));

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
    assertCalledWith(console.info, 'Displaying auth information');
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

    assertNthCalledWith(console.log, 5, `Global credentials found at: ${config.globalConfigFile}`);

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    assertNthCalledWith(
      console.log,
      7,
      [
        `API Key: ${config.global.apiKey}`,
        `API Secret: ${redactedGlobal}`,
        `App ID: ${config.global.appId}`,
        'Private Key: Is Set',
      ].join('\n'),
    );

    // twice once for local and once for global
    assert.strictEqual(mockGetApplicationPage.mock.callCount(), 2);
    assert.strictEqual(mockGetApplication.mock.callCount(), 2);
    assertNthCalledWith(mockGetApplication, 1, config.local.appId);
    assertNthCalledWith(mockGetApplication, 2, config.global.appId);
  });

  test('Should show only the local config settings', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({ response: { status: 200 } }));
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));

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
    assertCalledWith(console.info, 'Displaying auth information');
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

  test('Should show only the global config settings', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({ response: { status: 200 } }));
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));

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
    assertCalledWith(console.info, 'Displaying auth information');
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

  test('Should show only the API Key and Secret', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({ response: { status: 200 } }));

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
    assertCalledWith(console.info, 'Displaying auth information');
    assertNthCalledWith(console.log, 1, `Global credentials found at: ${config.globalConfigFile}`);

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    assertNthCalledWith(
      console.log,
      3,
      [
        `API Key: ${config.global.apiKey}`,
        `API Secret: ${redactedGlobal}`,
      ].join('\n'),
    );

    assert.strictEqual(mockGetApplicationPage.mock.callCount(), 1);
    assert.strictEqual(mockGetApplication.mock.callCount(), 0);
  });

  test('Should show only the App Id and Private Key', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));

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
    assertCalledWith(console.info, 'Displaying auth information');
    assertNthCalledWith(console.log, 1, `Global credentials found at: ${config.globalConfigFile}`);

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

    assert.ok(mockGetApplicationPage.mock.callCount() > 0);
    assert.strictEqual(mockGetApplication.mock.callCount(), 1);
    assertCalledWith(mockGetApplication, config.global.appId);
  });

  test('Should show the full Private Key and API Secret', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));

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

    assertNthCalledWith(
      console.log,
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
    assert.strictEqual(console.table.mock.callCount(), 0);
    assertNthCalledWith(console.log, 1, JSON.stringify([config.local, config.global], null, 2));
  });

  test('should output YAML', async () => {
    const args = getTestMiddlewareArgs();
    handler({
      ...args,
      yaml: true,
    });

    const { config } = args;
    assert.strictEqual(console.table.mock.callCount(), 0);
    assertNthCalledWith(console.log, 1, yaml.stringify([config.local, config.global], null, 2));
  });
});
