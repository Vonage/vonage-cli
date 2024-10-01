process.env.FORCE_COLOR = 0;
const yaml = require('yaml');
const {
  getTestApp,
  addVerifyCapabilities,
  addMessagesCapabilities,
  addVoiceCapabilities,
} = require('../../app');
const { Client } = require('@vonage/server-client');
const { handler } = require('../../../src/commands/apps/show');
const { mockConsole } = require('../../helpers');

describe('Command: vonage apps', () => {
  let consoleMock;

  beforeEach(() => {
    consoleMock = mockConsole();
  });

  test('Will display the basic application details', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const appMock = jest.fn().mockResolvedValue(app);
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({appId: app.id, SDK: sdkMock});
    expect(consoleMock.log).toHaveBeenCalledTimes(2);

    expect(consoleMock.info.mock.calls[0][0]).toBe(
      `Show information for application ${app.id}`,
    );

    expect(consoleMock.debug.mock.calls[0][0]).toBe('Found application');

    expect(consoleMock.log.mock.calls[0][0]).toEqual([
      `Name: ${app.name}`,
      `Application ID: ${app.id}`,
      'Improve AI: ❌ No',
    ].join('\n'));

    expect(consoleMock.log.mock.calls[1][0]).toBe('');
  });

  test('Will output JSON when requested', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const appMock = jest.fn().mockResolvedValue(app);
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({appId: app.id, SDK: sdkMock, json: true});
    expect(consoleMock.log).toHaveBeenCalledTimes(1);

    expect(consoleMock.log.mock.calls[0][0]).toBe(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(app, true, false),
      null,
      2,
    ));
  });

  test('Will output YAML when requested', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const appMock = jest.fn().mockResolvedValue(app);
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({appId: app.id, SDK: sdkMock, yaml: true});
    expect(consoleMock.log).toHaveBeenCalledTimes(1);

    expect(consoleMock.log.mock.calls[0][0]).toBe(yaml.stringify(
      Client.transformers.snakeCaseObjectKeys(app, true, false),
      null,
      2,
    ));
  });

  test('Will display the message capabilities details', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addMessagesCapabilities(getTestApp()),
      true,
      true,
    );

    const appMock = jest.fn().mockResolvedValue(app);
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({appId: app.id, SDK: sdkMock});
    expect(consoleMock.log).toHaveBeenCalledTimes(5);
    expect(consoleMock.log.mock.calls[2][0]).toBe('Message capabilities:');

    expect(consoleMock.log.mock.calls[3][0]).toBe([
      'Authenticate Inbound Media: ✅ ',
      `Webhook Version: ${app.capabilities.messages.version}`,
      `Status URL: ${app.capabilities.messages.webhooks.statusUrl.address} [${app.capabilities.messages.webhooks.statusUrl.httpMethod}]`,
      `Inbound URL: ${app.capabilities.messages.webhooks.inboundUrl.address} [${app.capabilities.messages.webhooks.inboundUrl.httpMethod}]`,
    ].join('\n'));

    expect(consoleMock.log.mock.calls[4][0]).toBe('');
  });

  test('Will display the voice capabilities details', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVoiceCapabilities(getTestApp()),
      true,
      true,
    );

    const appMock = jest.fn().mockResolvedValue(app);
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({appId: app.id, SDK: sdkMock});
    expect(consoleMock.log).toHaveBeenCalledTimes(5);
    expect(consoleMock.log.mock.calls[2][0]).toBe('Voice capabilities:');

    expect(consoleMock.log.mock.calls[3][0]).toBe([
      'Uses Signed callbacks: ✅ ',
      `Conversation TTL: ${app.capabilities.voice.conversationsTtl}`,
      `Leg Persistence Time: ${app.capabilities.voice.legPersistenceTime}`,
      `Event URL: ${app.capabilities.voice.webhooks.eventUrl.address} [${app.capabilities.voice.webhooks.eventUrl.httpMethod}]`,
      `Answer URL: ${app.capabilities.voice.webhooks.answerUrl.address} [${app.capabilities.voice.webhooks.answerUrl.httpMethod}]`,
      `Fallback URL: ${app.capabilities.voice.webhooks.fallbackAnswerUrl.address} [${app.capabilities.voice.webhooks.fallbackAnswerUrl.httpMethod}]`,
    ].join('\n'));

    expect(consoleMock.log.mock.calls[4][0]).toBe('');
  });

  test('Will display the verify capabilities details', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVerifyCapabilities(getTestApp()),
      true,
      true,
    );

    const appMock = jest.fn().mockResolvedValue(app);
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({appId: app.id, SDK: sdkMock});
    expect(consoleMock.log).toHaveBeenCalledTimes(5);
    expect(consoleMock.log.mock.calls[2][0]).toBe('Verify capabilities:');

    expect(consoleMock.log.mock.calls[3][0]).toBe([
      `Webhook Version: ${app.capabilities.verify.version}`,
      `Status URL: ${app.capabilities.verify.webhooks.statusUrl.address} [${app.capabilities.verify.webhooks.statusUrl.httpMethod}]`,
    ].join('\n'));
  });

  test('Will display warnings for RTC, Video, VBC and Network', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      {
        ...getTestApp(),
        capabilities: {
          rtc: {},
          video: {},
          network_apis: {},
          vbc: {},
        },
      },
      true,
      true,
    );

    const appMock = jest.fn().mockResolvedValue(app);
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({appId: app.id, SDK: sdkMock});
    expect(consoleMock.log).toHaveBeenCalledTimes(10);
    expect(consoleMock.log.mock.calls[2][0]).toBe(
      'RTC capabilities is currently in beta and not supported through the command line',
    );

    expect(consoleMock.log.mock.calls[4][0]).toBe(
      'Video capabilities is currently not supported through the command line',
    );

    expect(consoleMock.log.mock.calls[6][0]).toBe(
      'Network capabilities is currently not supported through the command line',
    );

    expect(consoleMock.log.mock.calls[8][0]).toBe(
      'VBC capabilities is currently not supported through the command line',
    );
  });
});
