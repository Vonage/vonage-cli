import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { faker } from '@faker-js/faker';
import { mockConsole } from '../../helpers.js';
import { getTestMiddlewareArgs, testPrivateKey } from '../../common.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
const validateApiKeyAndSecretMock = mock.fn();
const validatePrivateKeyAndAppIdMock = mock.fn();
const errorNoConfigMock = mock.fn();

const __moduleMocks = {
  'yargs': (() => ({
    default: yargs,
  }))(),
  '../../../src/utils/validateSDKAuth.js': (() => ({
    validateApiKeyAndSecret: validateApiKeyAndSecretMock,
    validatePrivateKeyAndAppId: validatePrivateKeyAndAppIdMock,
  }))(),
  '../../../src/middleware/config.js': (() => ({
    errorNoConfig: errorNoConfigMock,
  }))(),
};


test('Command: vonage auth check', { concurrency: 1 }, async (ctx) => {
  for (const [specifier, namedExports] of Object.entries(__moduleMocks)) {
    const moduleOptions = { namedExports: { ...namedExports } };
    if (Object.hasOwn(moduleOptions.namedExports, 'default')) {
      moduleOptions.defaultExport = moduleOptions.namedExports.default;
      delete moduleOptions.namedExports.default;
    }
    ctx.mock.module(specifier, moduleOptions);
  }
  const { handler } = await import('../../../src/commands/auth/check.js');

  ctx.beforeEach(() => {
    mockConsole();
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    validateApiKeyAndSecretMock.mock.resetCalls();
    validatePrivateKeyAndAppIdMock.mock.resetCalls();
    errorNoConfigMock.mock.resetCalls();
    validateApiKeyAndSecretMock.mock.mockImplementation(() => Promise.resolve(true));
    validatePrivateKeyAndAppIdMock.mock.mockImplementation(() => Promise.resolve(true));
  });

  await ctx.test('Should validate the global config settings', async () => {
    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {},
      global: {
        ...args.config.global,
        privateKey: testPrivateKey,
      },
    };

    await handler(args);

    const { config } = args;
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [`Global credentials found at: ${config.globalConfigFile}`]);;

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      `API Key: ${config.global.apiKey}`,
      `API Secret: ${redactedGlobal}`,
      `App ID: ${config.global.appId}`,
      'Private Key: Is Set',
    ].join('\n'), ]);;

    assert.ok(validateApiKeyAndSecretMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [config.global.apiKey, config.global.apiSecret, ])));;
    assert.ok(validatePrivateKeyAndAppIdMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [config.global.apiKey, config.global.apiSecret, config.global.appId, config.global.privateKey, ])));;
    assert.strictEqual(errorNoConfigMock.mock.callCount(), 0);
    assert.strictEqual(exitMock.mock.callCount(), 0);
  });

  await ctx.test('Should validate the local config settings', async () => {
    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {},
      local: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await handler({
      ...args,
      local: true,
    });

    const { config } = args;
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [`Local credentials found at: ${config.localConfigFile}`]);;

    const redactedLocal = `${config.local.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.local.apiSecret}`.length - 2);
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      `API Key: ${config.local.apiKey}`,
      `API Secret: ${redactedLocal}`,
      `App ID: ${config.local.appId}`,
      'Private Key: Is Set',
    ].join('\n'), ]);;

    assert.ok(validateApiKeyAndSecretMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [config.local.apiKey, config.local.apiSecret, ])));;
    assert.ok(validatePrivateKeyAndAppIdMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [config.local.apiKey, config.local.apiSecret, config.local.appId, config.local.privateKey, ])));;
  });

  await ctx.test('Should validate the cli arguments config settings', async () => {
    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        ...args.config.cli,
        privateKey: testPrivateKey,
      },
    };

    await handler(args);

    const { config } = args;
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, ['CLI arguments']);;

    const redactedCli = `${config.cli.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.cli.apiSecret}`.length - 2);
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      `API Key: ${config.cli.apiKey}`,
      `API Secret: ${redactedCli}`,
      `App ID: ${config.cli.appId}`,
      'Private Key: Is Set',
    ].join('\n'), ]);;

    assert.ok(validateApiKeyAndSecretMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [config.cli.apiKey, config.cli.apiSecret, ])));;
    assert.ok(validatePrivateKeyAndAppIdMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [config.cli.apiKey, config.cli.apiSecret, config.cli.appId, config.cli.privateKey, ])));;
  });

  await ctx.test('Should validate the API Key and Secret only in the CLI', async () => {
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
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, ['CLI arguments']);;

    const redactedCli = `${config.cli.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.cli.apiSecret}`.length - 2);
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      `API Key: ${config.cli.apiKey}`,
      `API Secret: ${redactedCli}`,
    ].join('\n'), ]);;

    assert.ok(validateApiKeyAndSecretMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [config.cli.apiKey, config.cli.apiSecret, ])));;
    assert.strictEqual(validatePrivateKeyAndAppIdMock.mock.callCount(), 0);
    assert.ok(
      console.log.mock.calls.some(({ arguments: [value] }) =>
        typeof value === 'string'
          && value.includes('Checking App ID and Private Key: ...')
          && value.includes('skipped')
      ),
    );
  });

  await ctx.test('Should fail to validate no config is found', async () => {
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

    assert.ok(errorNoConfigMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [undefined])));;
    assert.strictEqual(validateApiKeyAndSecretMock.mock.callCount(), 0);
    assert.strictEqual(validatePrivateKeyAndAppIdMock.mock.callCount(), 0);
  });

  await ctx.test('Should fail when local config is requested but missing', async () => {
    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {},
      localConfigExists: false,
    };

    await handler({
      ...args,
      local: true,
    });

    assert.ok(errorNoConfigMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [true])));;
    assert.strictEqual(validateApiKeyAndSecretMock.mock.callCount(), 0);
    assert.strictEqual(validatePrivateKeyAndAppIdMock.mock.callCount(), 0);
  });

  await ctx.test('Should fail to validate the config settings', async () => {
    validateApiKeyAndSecretMock.mock.mockImplementation(() => Promise.resolve(false));
    validatePrivateKeyAndAppIdMock.mock.mockImplementation(() => Promise.resolve(true));

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {},
      global: {
        ...args.config.global,
        privateKey: testPrivateKey,
      },
    };

    await handler(args);

    assert.ok(exitMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [5])));;
    assert.ok(console.error.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Configuration is not valid'])));;
    assert.ok(validatePrivateKeyAndAppIdMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [args.config.global.apiKey, args.config.global.apiSecret, args.config.global.appId, args.config.global.privateKey, ])));;
  });

  await ctx.test('Should fail to validate the config settings with invalid private key', async () => {
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
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [`Global credentials found at: ${config.globalConfigFile}`]);;

    const redactedGlobal = `${config.global.apiSecret}`.substring(0, 3) + '*'.repeat(`${config.global.apiSecret}`.length - 2);
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      `API Key: ${config.global.apiKey}`,
      `API Secret: ${redactedGlobal}`,
      `App ID: ${config.global.appId}`,
      'Private Key: INVALID KEY',
    ].join('\n'), ]);;

    assert.ok(validateApiKeyAndSecretMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [config.global.apiKey, config.global.apiSecret, ])));;
    assert.strictEqual(validatePrivateKeyAndAppIdMock.mock.callCount(), 0);
    assert.ok(exitMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [22])));;
  });
});
