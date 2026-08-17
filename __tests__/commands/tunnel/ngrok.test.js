process.env.FORCE_COLOR = 0;

import { suite, mock, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@vonage/server-client';
import {
  getTestApp,
  addVoiceCapabilities,
  addMessagesCapabilities,
  addVideoCapabilities,
} from '../../app.js';
import { mockConsole } from '../../helpers.js';

let exitMock;

const yargs = mock.fn(() => ({ exit: exitMock }));

const __moduleMocks = {
  'yargs': (() => ({ default: yargs }))(),
  'dotenv': (() => ({
    default: {
      config: mock.fn(),
    },
  }))(),
  '@ngrok/ngrok': (() => ({
    default: {
      forward: mock.fn(),
      disconnect: mock.fn(),
      kill: mock.fn(),
    },
  }))(),
  '../../../src/utils/makeSDKCall.js': (() => ({
    makeSDKCall: mock.fn(),
  }))(),
  '../../../src/ux/confirm.js': (() => ({
    confirm: mock.fn(),
  }))(),
  '../../../src/ux/spinner.js': (() => ({
    spinner: mock.fn(() => ({
      stop: mock.fn(),
      fail: mock.fn(),
    })),
  }))(),
  '../../../src/ux/input.js': (() => ({
    inputFromTTY: mock.fn(),
  }))(),
  '../../../src/ux/cursor.js': (() => ({
    hideCursor: mock.fn(),
    resetCursor: mock.fn(),
  }))(),
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

suite('Command: vonage tunnel ngrok', { concurrency: 1 }, () => {
  let handler;
  let confirm;
  let makeSDKCall;
  let ngrok;
  let spinner;
  let inputFromTTY;
  let hideCursor;
  let resetCursor;

  beforeEach(async () => {
    mockConsole();
    exitMock = mock.fn();

    confirm = __moduleMocks['../../../src/ux/confirm.js'].confirm;
    makeSDKCall = __moduleMocks['../../../src/utils/makeSDKCall.js'].makeSDKCall;
    ngrok = __moduleMocks['@ngrok/ngrok'].default;
    spinner = __moduleMocks['../../../src/ux/spinner.js'].spinner;
    inputFromTTY = __moduleMocks['../../../src/ux/input.js'].inputFromTTY;
    hideCursor = __moduleMocks['../../../src/ux/cursor.js'].hideCursor;
    resetCursor = __moduleMocks['../../../src/ux/cursor.js'].resetCursor;

    confirm.mock.resetCalls();
    makeSDKCall.mock.resetCalls();
    ngrok.forward.mock.resetCalls();
    ngrok.disconnect.mock.resetCalls();
    ngrok.kill.mock.resetCalls();
    spinner.mock.resetCalls();
    inputFromTTY.mock.resetCalls();
    hideCursor.mock.resetCalls();
    resetCursor.mock.resetCalls();
    yargs.mock.resetCalls();

    handler = (await loadModule(
      import.meta.url,
      '../../../src/commands/tunnel/ngrok.js',
      __moduleMocks,
    )).handler;
  });

  test('updates application webhooks while the tunnel is open', async () => {
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

    const expectedUpdatedApp = updateAddressHosts(structuredClone(app), 'unit-test.ngrok.app');

    const sdkMock = {
      applications: {
        getApplication: mock.fn(),
        updateApplication: mock.fn(),
      },
    };

    confirm.mock.mockImplementation(() => Promise.resolve(true));
    mockQueue(makeSDKCall, [
      () => Promise.resolve(app),
      () => Promise.resolve(expectedUpdatedApp),
      () => Promise.resolve(app),
    ]);
    ngrok.forward.mock.mockImplementation(() => Promise.resolve({
      url: () => 'https://unit-test.ngrok.app',
    }));
    inputFromTTY.mock.mockImplementation(async ({ onKeyPress }) => {
      onKeyPress(null, 'q');
      throw 'Shutdown';
    });

    await handler({
      id: app.id,
      SDK: sdkMock,
      authToken: 'cli-token',
      region: 'eu',
      port: 3001,
      subdomain: 'unit-test',
    });

    assert.strictEqual(confirm.mock.callCount(), 1);
    assertNthCalledWith(confirm, 1, 'Are you sure you want to continue? [y/n]');

    assert.strictEqual(makeSDKCall.mock.callCount(), 3);
    assert.strictEqual(makeSDKCall.mock.calls[0].arguments[1], 'Fetching Application');
    assert.strictEqual(makeSDKCall.mock.calls[0].arguments[2], app.id);
    assert.strictEqual(makeSDKCall.mock.calls[1].arguments[1], 'Updating application webhooks');
    assert.deepStrictEqual(makeSDKCall.mock.calls[1].arguments[2], expectedUpdatedApp);
    assert.strictEqual(makeSDKCall.mock.calls[2].arguments[1], 'Reverting application webhooks');
    assert.deepStrictEqual(makeSDKCall.mock.calls[2].arguments[2], app);

    assertCalledWith(ngrok.forward, {
      authtoken: 'cli-token',
      region: 'eu',
      addr: 3001,
      subdomain: 'unit-test',
    });
    assert.strictEqual(ngrok.disconnect.mock.callCount(), 1);
    assert.strictEqual(ngrok.kill.mock.callCount(), 1);
    assert.strictEqual(hideCursor.mock.callCount(), 1);
    assert.strictEqual(resetCursor.mock.callCount(), 1);

    assert.strictEqual(spinner.mock.callCount(), 2);
    assert.deepStrictEqual(app.capabilities.video.hoolockConfigs, expectedUpdatedApp.capabilities.video.hoolockConfigs);
    assert.strictEqual(
      app.capabilities.voice.webhooks.answerUrl.address,
      'https://voice.example.com/webhooks/answer?version=1',
    );
    assert.strictEqual(exitMock.mock.callCount(), 0);
  });
});
