process.env.FORCE_COLOR = 0;

import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { Client } from '@vonage/server-client';
import { EOL } from 'os';
import {
  getTestApp,
  addVoiceCapabilities,
  addMessagesCapabilities,
  addVideoCapabilities,
} from '../../app.js';
import { mockConsole } from '../../helpers.js';

const originalNgrokAuthtoken = process.env.NGROK_AUTHTOKEN;
const originalNgrokAuthToken = process.env.NGROK_AUTH_TOKEN;
const originalStdoutWrite = process.stdout.write;

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
const makeSDKCallMock = mock.fn();
const confirmMock = mock.fn();
const spinnerStopMock = mock.fn();
const spinnerFailMock = mock.fn();
const spinnerMock = mock.fn(() => ({
  stop: spinnerStopMock,
  fail: spinnerFailMock,
}));
const inputFromTTYMock = mock.fn();
const hideCursorMock = mock.fn();
const resetCursorMock = mock.fn();
const ngrokForwardMock = mock.fn();
const ngrokDisconnectMock = mock.fn();
const ngrokKillMock = mock.fn();
const dotenvConfigMock = mock.fn();

const __moduleMocks = {
  'yargs': (() => ({ default: yargs }))(),
  'dotenv': (() => ({
    default: {
      config: dotenvConfigMock,
    },
  }))(),
  '@ngrok/ngrok': (() => ({
    default: {
      forward: ngrokForwardMock,
      disconnect: ngrokDisconnectMock,
      kill: ngrokKillMock,
    },
  }))(),
  '../../../src/utils/makeSDKCall.js': (() => ({
    makeSDKCall: makeSDKCallMock,
  }))(),
  '../../../src/ux/confirm.js': (() => ({
    confirm: confirmMock,
  }))(),
  '../../../src/ux/spinner.js': (() => ({
    spinner: spinnerMock,
  }))(),
  '../../../src/ux/input.js': (() => ({
    inputFromTTY: inputFromTTYMock,
  }))(),
  '../../../src/ux/cursor.js': (() => ({
    hideCursor: hideCursorMock,
    resetCursor: resetCursorMock,
  }))(),
};


const getAppWithWebhooks = () => {
  const app = Client.transformers.camelCaseObjectKeys(
    addVideoCapabilities(
      addMessagesCapabilities(
        addVoiceCapabilities(getTestApp()),
      ),
    ),
    true,
    true,
  );

  app.capabilities.voice.webhooks.answerUrl.address = 'https://voice.example.com/webhooks/answer?version=1';
  app.capabilities.voice.webhooks.fallbackAnswerUrl.address = 'http://voice.example.com/webhooks/fallback';
  app.capabilities.messages.webhooks.inboundUrl.address = 'https://messages.example.com/webhooks/inbound';
  app.capabilities.messages.webhooks.statusUrl.address = 'https://messages.example.com/webhooks/status';

  return app;
};

const updateAddressHosts = (config, host) => Object.entries(config).reduce(
  (acc, [key, value]) => {
    if (Array.isArray(value)) {
      acc[key] = value.map((item) => (
        item && typeof item === 'object'
          ? updateAddressHosts(item, host)
          : item
      ));
      return acc;
    }

    if (value && typeof value === 'object') {
      acc[key] = updateAddressHosts(value, host);
      return acc;
    }

    if (key !== 'address') {
      acc[key] = value;
      return acc;
    }

    const webhookUrl = new URL(value);
    webhookUrl.host = host;
    acc[key] = webhookUrl.toString();
    return acc;
  },
  {},
);

const getSDK = () => ({
  applications: {
    getApplication: mock.fn(),
    updateApplication: mock.fn(),
  },
});

test('Command: vonage tunnel ngrok', { concurrency: 1 }, async (ctx) => {
  for (const [specifier, namedExports] of Object.entries(__moduleMocks)) {
    const moduleOptions = { namedExports: { ...namedExports } };
    if (Object.hasOwn(moduleOptions.namedExports, 'default')) {
      moduleOptions.defaultExport = moduleOptions.namedExports.default;
      delete moduleOptions.namedExports.default;
    }
    ctx.mock.module(specifier, moduleOptions);
  }
  const { handler } = await import('../../../src/commands/tunnel/ngrok.js');

  ctx.beforeEach(() => {
    mockConsole();
    process.stdout.write = mock.fn();

    delete process.env.NGROK_AUTHTOKEN;
    delete process.env.NGROK_AUTH_TOKEN;

    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    makeSDKCallMock.mock.resetCalls();
    confirmMock.mock.resetCalls();
    spinnerMock.mock.resetCalls();
    spinnerStopMock.mock.resetCalls();
    spinnerFailMock.mock.resetCalls();
    inputFromTTYMock.mock.resetCalls();
    hideCursorMock.mock.resetCalls();
    resetCursorMock.mock.resetCalls();
    ngrokForwardMock.mock.resetCalls();
    ngrokDisconnectMock.mock.resetCalls();
    ngrokKillMock.mock.resetCalls();
    dotenvConfigMock.mock.resetCalls();

    confirmMock.mock.mockImplementation(() => Promise.resolve(true));
    ngrokForwardMock.mock.mockImplementation(() => Promise.resolve({
      url: () => 'https://unit-test.ngrok.app',
    }));
    ngrokDisconnectMock.mock.mockImplementation(() => Promise.resolve());
    ngrokKillMock.mock.mockImplementation(() => Promise.resolve());
    inputFromTTYMock.mock.mockImplementation(async ({ onKeyPress }) => {
      onKeyPress(null, 'q');
      throw 'Shutdown';
    });
  });

  ctx.afterEach(() => {
    process.env.NGROK_AUTHTOKEN = originalNgrokAuthtoken;
    process.env.NGROK_AUTH_TOKEN = originalNgrokAuthToken;
  });

  ctx.after(() => {
    process.stdout.write = originalStdoutWrite;
  });

  await ctx.test('updates application webhooks while the tunnel is open', async () => {
    const app = getAppWithWebhooks();
    const expectedUpdatedApp = updateAddressHosts(structuredClone(app), 'unit-test.ngrok.app');

    const makeSDKCallResponses = [app, expectedUpdatedApp, app];
    makeSDKCallMock.mock.mockImplementation(() => Promise.resolve(makeSDKCallResponses.shift()));

    await handler({
      id: app.id,
      SDK: getSDK(),
      authToken: 'cli-token',
      region: 'eu',
      port: 3001,
      subdomain: 'unit-test',
    });

    assert.strictEqual(confirmMock.mock.callCount(), 1);
    assert.deepStrictEqual(confirmMock.mock.calls[1 - 1].arguments, ['Are you sure you want to continue? [y/n]']);;

    assert.strictEqual(makeSDKCallMock.mock.callCount(), 3);
    assert.strictEqual(makeSDKCallMock.mock.calls[0].arguments[1], 'Fetching Application');
    assert.strictEqual(makeSDKCallMock.mock.calls[0].arguments[2], app.id);
    assert.strictEqual(makeSDKCallMock.mock.calls[1].arguments[1], 'Updating application webhooks');
    assert.deepStrictEqual(makeSDKCallMock.mock.calls[1].arguments[2], expectedUpdatedApp);
    assert.strictEqual(makeSDKCallMock.mock.calls[2].arguments[1], 'Reverting application webhooks');
    assert.deepStrictEqual(makeSDKCallMock.mock.calls[2].arguments[2], app);

    assert.ok(ngrokForwardMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [{
      authtoken: 'cli-token',
      region: 'eu',
      addr: 3001,
      subdomain: 'unit-test',
    }])));;
    assert.strictEqual(ngrokDisconnectMock.mock.callCount(), 1);
    assert.strictEqual(ngrokKillMock.mock.callCount(), 1);
    assert.strictEqual(hideCursorMock.mock.callCount(), 1);
    assert.strictEqual(resetCursorMock.mock.callCount(), 1);
    assert.strictEqual(spinnerMock.mock.callCount(), 2);
    assert.ok(process.stdout.write.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Press q to quit'])));;
    assert.ok(process.stdout.write.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [EOL])));;
    assert.strictEqual(
      app.capabilities.voice.webhooks.answerUrl.address,
      'https://voice.example.com/webhooks/answer?version=1',
    );
    assert.strictEqual(exitMock.mock.callCount(), 0);
  });

  await ctx.test('exits when the user declines the initial risk confirmation', async () => {
    confirmMock.mock.mockImplementation(() => Promise.resolve(false));

    await handler({
      id: 'app-id',
      SDK: getSDK(),
    });

    assert.strictEqual(confirmMock.mock.callCount(), 1);
    assert.deepStrictEqual(confirmMock.mock.calls[1 - 1].arguments, ['Are you sure you want to continue? [y/n]']);;
    assert.ok(exitMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [1])));;
    assert.strictEqual(makeSDKCallMock.mock.callCount(), 0);
    assert.strictEqual(ngrokForwardMock.mock.callCount(), 0);
    assert.strictEqual(spinnerMock.mock.callCount(), 0);
  });

  await ctx.test('uses NGROK_AUTHTOKEN when set and NGROK_AUTH_TOKEN is not set', async () => {
    const app = getAppWithWebhooks();
    const expectedUpdatedApp = updateAddressHosts(structuredClone(app), 'unit-test.ngrok.app');

    process.env.NGROK_AUTHTOKEN = 'env-authtoken';

    const makeSDKCallResponses = [app, expectedUpdatedApp, app];
    makeSDKCallMock.mock.mockImplementation(() => Promise.resolve(makeSDKCallResponses.shift()));

    await handler({
      id: app.id,
      SDK: getSDK(),
      region: 'us',
      port: 3000,
    });

    assert.ok(ngrokForwardMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [{
      authtoken: 'env-authtoken',
      region: 'us',
      addr: 3000,
      subdomain: undefined,
    }])));;
    assert.strictEqual(exitMock.mock.callCount(), 0);
  });

  await ctx.test('uses NGROK_AUTH_TOKEN when set and NGROK_AUTHTOKEN is not set', async () => {
    const app = getAppWithWebhooks();
    const expectedUpdatedApp = updateAddressHosts(structuredClone(app), 'unit-test.ngrok.app');

    process.env.NGROK_AUTH_TOKEN = 'legacy-env-token';

    const makeSDKCallResponses = [app, expectedUpdatedApp, app];
    makeSDKCallMock.mock.mockImplementation(() => Promise.resolve(makeSDKCallResponses.shift()));

    await handler({
      id: app.id,
      SDK: getSDK(),
      region: 'us',
      port: 3000,
    });

    assert.ok(ngrokForwardMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [{
      authtoken: 'legacy-env-token',
      region: 'us',
      addr: 3000,
      subdomain: undefined,
    }])));;
    assert.strictEqual(exitMock.mock.callCount(), 0);
  });

  await ctx.test('warns when neither NGROK_AUTHTOKEN nor NGROK_AUTH_TOKEN is set and exits when user declines', async () => {
    const app = getTestApp();

    const confirmValues = [true, false];
    confirmMock.mock.mockImplementation(() => Promise.resolve(confirmValues.shift()));
    makeSDKCallMock.mock.mockImplementation(() => Promise.resolve(app));

    await handler({
      id: app.id,
      SDK: getSDK(),
      region: 'us',
      port: 3000,
    });

    assert.strictEqual(confirmMock.mock.callCount(), 2);
    assert.deepStrictEqual(confirmMock.mock.calls[1 - 1].arguments, ['Are you sure you want to continue? [y/n]']);;
    assert.deepStrictEqual(confirmMock.mock.calls[2 - 1].arguments, ['‼️  Unable to verify the ngrok authentication token! This may cause the tunnel to not be created. Ok to proceed? [y/n]', { noForce: true }, ]);;
    assert.ok(exitMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [1])));;
    assert.strictEqual(makeSDKCallMock.mock.callCount(), 1);
    assert.strictEqual(makeSDKCallMock.mock.calls[0].arguments[1], 'Fetching Application');
    assert.strictEqual(ngrokForwardMock.mock.callCount(), 0);
    assert.strictEqual(spinnerMock.mock.callCount(), 0);
    assert.ok(console.error.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Cannot open ngrok tunnel without the ngrok authentication token'])));;
  });

  await ctx.test('proceeds with auth_from_env when no ngrok token is available and user confirms', async () => {
    const app = getAppWithWebhooks();
    const expectedUpdatedApp = updateAddressHosts(structuredClone(app), 'unit-test.ngrok.app');

    const confirmValues = [true, true];
    confirmMock.mock.mockImplementation(() => Promise.resolve(confirmValues.shift()));
    const makeSDKCallResponses = [app, expectedUpdatedApp, app];
    makeSDKCallMock.mock.mockImplementation(() => Promise.resolve(makeSDKCallResponses.shift()));

    await handler({
      id: app.id,
      SDK: getSDK(),
      region: 'ap',
      port: 3005,
    });

    assert.ok(ngrokForwardMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [{
      auth_from_env: true,
      region: 'ap',
      addr: 3005,
      subdomain: undefined,
    }])));;
    assert.strictEqual(makeSDKCallMock.mock.callCount(), 3);
    assert.strictEqual(exitMock.mock.callCount(), 0);
  });

  await ctx.test('exits with code 69 when ngrok fails to open the tunnel', async () => {
    const app = getTestApp();
    const error = {
      body: {
        details: {
          err: 'ngrok tunnel unavailable',
        },
      },
    };

    makeSDKCallMock.mock.mockImplementation(() => Promise.resolve(app));
    ngrokForwardMock.mock.mockImplementation(() => Promise.reject(error));

    await handler({
      id: app.id,
      SDK: getSDK(),
      authToken: 'cli-token',
      region: 'eu',
      port: 3001,
    });

    assert.strictEqual(makeSDKCallMock.mock.callCount(), 1);
    assert.ok(ngrokForwardMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [{
      authtoken: 'cli-token',
      region: 'eu',
      addr: 3001,
      subdomain: undefined,
    }])));;
    assert.strictEqual(spinnerFailMock.mock.callCount(), 1);
    assert.strictEqual(spinnerStopMock.mock.callCount(), 0);
    assert.strictEqual(ngrokDisconnectMock.mock.callCount(), 0);
    assert.strictEqual(ngrokKillMock.mock.callCount(), 0);
    assert.strictEqual(hideCursorMock.mock.callCount(), 0);
    assert.strictEqual(resetCursorMock.mock.callCount(), 0);
    assert.ok(exitMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [69])));;
    assert.ok(console.error.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Unable to open ngrok tunnel'])));;
    assert.ok(console.log.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['ngrok tunnel unavailable'])));;
  });

  await ctx.test('logs the raw ngrok error when no nested error reason is present', async () => {
    const app = getTestApp();
    const error = new Error('plain ngrok failure');

    makeSDKCallMock.mock.mockImplementation(() => Promise.resolve(app));
    ngrokForwardMock.mock.mockImplementation(() => Promise.reject(error));

    await handler({
      id: app.id,
      SDK: getSDK(),
      authToken: 'cli-token',
      region: 'eu',
      port: 3001,
    });

    assert.ok(console.error.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Unable to open ngrok tunnel'])));;
    assert.ok(console.log.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [error])));;
    assert.ok(exitMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [69])));;
  });

  await ctx.test('waits until q is pressed before shutting down', async () => {
    const app = getAppWithWebhooks();
    const expectedUpdatedApp = updateAddressHosts(structuredClone(app), 'unit-test.ngrok.app');

    const makeSDKCallResponses = [app, expectedUpdatedApp, app];
    makeSDKCallMock.mock.mockImplementation(() => Promise.resolve(makeSDKCallResponses.shift()));
    inputFromTTYMock.mock.mockImplementation(async ({ onKeyPress }) => {
      onKeyPress(null, 'x');
      onKeyPress(null, 'q');
      throw 'Shutdown';
    });

    await handler({
      id: app.id,
      SDK: getSDK(),
      authToken: 'cli-token',
      region: 'us',
      port: 3000,
    });

    assert.ok(process.stdout.write.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Press q to quit'])));;
    assert.ok(process.stdout.write.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [EOL])));;
    assert.strictEqual(ngrokDisconnectMock.mock.callCount(), 1);
    assert.strictEqual(ngrokKillMock.mock.callCount(), 1);
  });

  await ctx.test('logs unexpected input errors and still reverts the application', async () => {
    const app = getAppWithWebhooks();
    const expectedUpdatedApp = updateAddressHosts(structuredClone(app), 'unit-test.ngrok.app');
    const ttyError = new Error('TTY failure');

    const makeSDKCallResponses = [app, expectedUpdatedApp, app];
    makeSDKCallMock.mock.mockImplementation(() => Promise.resolve(makeSDKCallResponses.shift()));
    inputFromTTYMock.mock.mockImplementation(() => Promise.reject(ttyError));

    await handler({
      id: app.id,
      SDK: getSDK(),
      authToken: 'cli-token',
      region: 'us',
      port: 3000,
    });

    assert.ok(console.error.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['Unexpected error', ttyError])));;
    assert.strictEqual(ngrokDisconnectMock.mock.callCount(), 1);
    assert.strictEqual(ngrokKillMock.mock.callCount(), 1);
    assert.strictEqual(makeSDKCallMock.mock.callCount(), 3);
    assert.strictEqual(makeSDKCallMock.mock.calls[2].arguments[1], 'Reverting application webhooks');
    assert.strictEqual(resetCursorMock.mock.callCount(), 1);
  });
});
