import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
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
    // mock.fn() from node:test cannot be used with `new`.
    // Build a trackable constructor manually.
    const vonageCalls = [];
    let vonageImpl = () => undefined;
    const Vonage = function(...args) {
      vonageCalls.push({ arguments: args });
      return vonageImpl.call(this, ...args);
    };
    Vonage.mock = {
      get calls() { return vonageCalls; },
      callCount() { return vonageCalls.length; },
      resetCalls() { vonageCalls.length = 0; },
      mockImplementation(fn) { vonageImpl = fn; },
    };
    return { Vonage };
  })(),
};

const { Vonage } = __moduleMocks['@vonage/server-sdk'];

const oldProcessStdoutWrite = process.stdout.write;

test('Command: vonage auth show and vonage auth', { concurrency: 1 }, async (ctx) => {
  for (const [specifier, namedExports] of Object.entries(__moduleMocks)) {
    const moduleOptions = { namedExports: { ...namedExports } };
    if (Object.hasOwn(moduleOptions.namedExports, 'default')) {
      moduleOptions.defaultExport = moduleOptions.namedExports.default;
      delete moduleOptions.namedExports.default;
    }
    ctx.mock.module(specifier, moduleOptions);
  }
  const { handler } = await import('../../../src/commands/auth/show.js');

  ctx.beforeEach(() => {
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

  ctx.after(() => {
    process.stdout.write = oldProcessStdoutWrite;
  });

  await ctx.test('Should show the config settings, validate them', async () => {
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
    assert.ok(console.info.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Displaying auth information'])));;
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [`Local credentials found at: ${config.localConfigFile}`]);;

    const redactedLocal = `${config.local.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.local.apiSecret}`.length - 2);
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      `API Key: ${config.local.apiKey}`,
      `API Secret: ${redactedLocal}`,
      `App ID: ${config.local.appId}`,
      'Private Key: Is Set',
    ].join('\n'), ]);;

    assert.deepStrictEqual(console.log.mock.calls[5 - 1].arguments, [`Global credentials found at: ${config.globalConfigFile}`]);;

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    assert.deepStrictEqual(console.log.mock.calls[7 - 1].arguments, [[
      `API Key: ${config.global.apiKey}`,
      `API Secret: ${redactedGlobal}`,
      `App ID: ${config.global.appId}`,
      'Private Key: Is Set',
    ].join('\n'), ]);;

    // twice once for local and once for global
    assert.strictEqual(mockGetApplicationPage.mock.callCount(), 2);
    assert.strictEqual(mockGetApplication.mock.callCount(), 2);
    assert.deepStrictEqual(mockGetApplication.mock.calls[1 - 1].arguments, [config.local.appId]);;
    assert.deepStrictEqual(mockGetApplication.mock.calls[2 - 1].arguments, [config.global.appId]);;
  });

  await ctx.test('Should show only the local config settings', async () => {
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
    assert.ok(console.info.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Displaying auth information'])));;
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [`Local credentials found at: ${config.localConfigFile}`]);;

    const redactedLocal = `${config.local.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.local.apiSecret}`.length - 2);
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      `API Key: ${config.local.apiKey}`,
      `API Secret: ${redactedLocal}`,
      `App ID: ${config.local.appId}`,
      'Private Key: Is Set',
    ].join('\n'), ]);;

    assert.strictEqual(mockGetApplicationPage.mock.callCount(), 1);
    assert.strictEqual(mockGetApplication.mock.callCount(), 1);
    assert.ok(mockGetApplication.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [config.local.appId])));;
  });

  await ctx.test('Should show only the global config settings', async () => {
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
    assert.ok(console.info.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Displaying auth information'])));;
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [`Global credentials found at: ${config.globalConfigFile}`]);;

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      `API Key: ${config.global.apiKey}`,
      `API Secret: ${redactedGlobal}`,
      `App ID: ${config.global.appId}`,
      'Private Key: Is Set',
    ].join('\n'), ]);;

    assert.strictEqual(mockGetApplicationPage.mock.callCount(), 1);
    assert.strictEqual(mockGetApplication.mock.callCount(), 1);
    assert.ok(mockGetApplication.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [config.global.appId])));;
  });

  await ctx.test('Should show only the API Key and Secret', async () => {
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
    assert.ok(console.info.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Displaying auth information'])));;
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [`Global credentials found at: ${config.globalConfigFile}`]);;

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      `API Key: ${config.global.apiKey}`,
      `API Secret: ${redactedGlobal}`,
    ].join('\n'), ]);;

    assert.strictEqual(mockGetApplicationPage.mock.callCount(), 1);
    assert.strictEqual(mockGetApplication.mock.callCount(), 0);
  });

  await ctx.test('Should show only the App Id and Private Key', async () => {
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
    assert.ok(console.info.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Displaying auth information'])));;
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [`Global credentials found at: ${config.globalConfigFile}`]);;

    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      `API Key: ${config.global.apiKey}`,
      `API Secret: ${redactedGlobal}`,
      `App ID: ${config.global.appId}`,
      'Private Key: Is Set',
    ].join('\n'), ]);;

    assert.ok(mockGetApplicationPage.mock.callCount() > 0);
    assert.strictEqual(mockGetApplication.mock.callCount(), 1);
    assert.ok(mockGetApplication.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [config.global.appId])));;
  });

  await ctx.test('Should show the full Private Key and API Secret', async () => {
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

    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      `API Key: ${config.global.apiKey}`,
      `API Secret: ${config.global.apiSecret}`,
      `App ID: ${config.global.appId}`,
      `Private Key: ${testPrivateKey}`,
    ].join('\n'), ]);;
  });

  await ctx.test('should output JSON', async () => {
    const args = getTestMiddlewareArgs();
    handler({
      ...args,
      json: true,
    });

    const { config } = args;
    assert.strictEqual(console.table.mock.callCount(), 0);
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [JSON.stringify([config.local, config.global], null, 2)]);;
  });

  await ctx.test('should output YAML', async () => {
    const args = getTestMiddlewareArgs();
    handler({
      ...args,
      yaml: true,
    });

    const { config } = args;
    assert.strictEqual(console.table.mock.callCount(), 0);
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [yaml.stringify([config.local, config.global], null, 2)]);;
  });
});
