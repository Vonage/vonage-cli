process.env.FORCE_COLOR = 0;
const yaml = require('yaml');
const {
  getTestApp,
  addVideoCapabilities,
  addNetworkCapabilities,
  addRTCCapabilities,
  addVerifyCapabilities,
  addMessagesCapabilities,
  addVoiceCapabilities,
} = require('../../app');
const { Client } = require('@vonage/server-client');
const { handler } = require('../../../src/commands/apps/show');
const { mockConsole } = require('../../helpers');
const { faker } = require('@faker-js/faker');

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

    await handler({id: app.id, SDK: sdkMock});
    expect(consoleMock.log).toHaveBeenCalledTimes(2);

    expect(consoleMock.info.mock.calls[0][0]).toBe(
      `Show information for application ${app.id}`,
    );

    expect(consoleMock.debug.mock.calls[0][0]).toBe('Found application');

    expect(consoleMock.log.mock.calls[0][0]).toEqual([
      `Name: ${app.name}`,
      `Application ID: ${app.id}`,
      'Improve AI: Off',
      'Private/Public Key: Set',
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

    await handler({config: {cli: {appId: app}}, SDK: sdkMock, json: true});
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

    await handler({config: {cli: {appId: app}}, SDK: sdkMock, yaml: true});
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

    await handler({config: {cli: {appId: app}}, SDK: sdkMock});
    expect(consoleMock.log).toHaveBeenCalledTimes(3);

    expect(consoleMock.log.mock.calls[2][0]).toBe([
      'Capabilities:',
      '  MESSAGES:',
      '    Authenticate Inbound Media: On',
      `    Webhook Version: ${app.capabilities.messages.version}`,
      `    Status URL: [${app.capabilities.messages.webhooks.statusUrl.httpMethod}] ${app.capabilities.messages.webhooks.statusUrl.address}`,
      `    Inbound URL: [${app.capabilities.messages.webhooks.inboundUrl.httpMethod}] ${app.capabilities.messages.webhooks.inboundUrl.address}`,
      '  ',
    ].join('\n'));
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

    await handler({config: {cli: {appId: app}}, SDK: sdkMock});

    expect(consoleMock.log).toHaveBeenCalledTimes(3);

    expect(consoleMock.log.mock.calls[2][0]).toBe([
      'Capabilities:',
      '  VOICE:',
      '    Uses Signed callbacks: On',
      `    Conversation TTL: ${app.capabilities.voice.conversationsTtl} hours`,
      `    Leg Persistence Time: ${app.capabilities.voice.legPersistenceTime} days`,
      `    Event URL: [${app.capabilities.voice.webhooks.eventUrl.httpMethod}] ${app.capabilities.voice.webhooks.eventUrl.address}`,
      `    Answer URL: [${app.capabilities.voice.webhooks.answerUrl.httpMethod}] ${app.capabilities.voice.webhooks.answerUrl.address}`,
      `    Fallback URL: [${app.capabilities.voice.webhooks.fallbackAnswerUrl.httpMethod}] ${app.capabilities.voice.webhooks.fallbackAnswerUrl.address}`,
      '  ',
    ].join('\n'));
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

    await handler({config: {cli: {appId: app}}, SDK: sdkMock});
    expect(consoleMock.log.mock.calls[2][0]).toBe([
      'Capabilities:',
      '  VERIFY:',
      `    Webhook Version: ${app.capabilities.verify.version}`,
      `    Status URL: [${app.capabilities.verify.webhooks.statusUrl.httpMethod}] ${app.capabilities.verify.webhooks.statusUrl.address}`,
      '  ',
    ].join('\n'));
  });

  test('Will display the RTC capabilities details', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addRTCCapabilities(getTestApp()),
      true,
      true,
    );

    const appMock = jest.fn().mockResolvedValue(app);
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({config: {cli: {appId: app}}, SDK: sdkMock});
    expect(consoleMock.log.mock.calls[2][0]).toBe([
      'Capabilities:',
      '  RTC:',
      `    Event URL: [${app.capabilities.rtc.webhooks.eventUrl.httpMethod}] ${app.capabilities.rtc.webhooks.eventUrl.address}`,
      '    Uses Signed callbacks: On',
      '  ',
    ].join('\n'));
  });


  test('Will display the Network API capabilities details', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addNetworkCapabilities(getTestApp()),
      true,
      true,
    );

    const appMock = jest.fn().mockResolvedValue(app);
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({config: {cli: {appId: app}}, SDK: sdkMock});
    expect(consoleMock.log.mock.calls[2][0]).toBe([
      'Capabilities:',
      '  NETWORK APIS:',
      `    Redirect URL: [GET] ${app.capabilities.networkApis.redirectUri}`,
      '  ',
    ].join('\n'));
  });

  test('Will display the Video capabilities details (no storage)', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVideoCapabilities(getTestApp()),
      true,
      true,
    );

    const appMock = jest.fn().mockResolvedValue(app);
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({config: {cli: {appId: app}}, SDK: sdkMock});
    expect(consoleMock.log.mock.calls[2][0]).toBe([
      'Capabilities:',
      '  VIDEO:',
      `    Archive Status URL: [POST] ${app.capabilities.video.webhooks.archiveStatus.address}`,
      `    Archive Status Signature Secret: ${app.capabilities.video.webhooks.archiveStatus.secret}`,
      `    Broadcast Status URL: [POST] ${app.capabilities.video.webhooks.broadcastStatus.address}`,
      `    Broadcast Status Signature Secret: ${app.capabilities.video.webhooks.broadcastStatus.secret}`,
      `    Caption Status URL: [POST] ${app.capabilities.video.webhooks.captionsStatus.address}`,
      `    Caption Status Signature Secret: ${app.capabilities.video.webhooks.captionsStatus.secret}`,
      `    Connection Created URL: [POST] ${app.capabilities.video.webhooks.connectionCreated.address}`,
      `    Connection Created Signature Secret: ${app.capabilities.video.webhooks.connectionCreated.secret}`,
      `    Connection Destroyed URL: [POST] ${app.capabilities.video.webhooks.connectionDestroyed.address}`,
      `    Connection Destroyed Signature Secret: ${app.capabilities.video.webhooks.connectionDestroyed.secret}`,
      `    Render Status URL: [POST] ${app.capabilities.video.webhooks.renderStatus.address}`,
      `    Render Status Signature Secret: ${app.capabilities.video.webhooks.renderStatus.secret}`,
      `    SIP Call Created URL: [POST] ${app.capabilities.video.webhooks.sipCallCreated.address}`,
      `    SIP Call Created Signature Secret: ${app.capabilities.video.webhooks.sipCallCreated.secret}`,
      `    SIP Call Destroyed URL: [POST] ${app.capabilities.video.webhooks.sipCallDestroyed.address}`,
      `    SIP Call Destroyed Signature Secret: ${app.capabilities.video.webhooks.sipCallDestroyed.secret}`,
      `    SIP Call Mute Forced URL: [POST] ${app.capabilities.video.webhooks.sipCallMuteForced.address}`,
      `    SIP Call Mute Forced Signature Secret: ${app.capabilities.video.webhooks.sipCallMuteForced.secret}`,
      `    SIP Call Updated URL: [POST] ${app.capabilities.video.webhooks.sipCallUpdated.address}`,
      `    SIP Call Updated Signature Secret: ${app.capabilities.video.webhooks.sipCallUpdated.secret}`,
      `    Stream Created URL: [POST] ${app.capabilities.video.webhooks.streamCreated.address}`,
      `    Stream Created Signature Secret: ${app.capabilities.video.webhooks.streamCreated.secret}`,
      `    Stream Destroyed URL: [POST] ${app.capabilities.video.webhooks.streamDestroyed.address}`,
      `    Stream Destroyed Signature Secret: ${app.capabilities.video.webhooks.streamDestroyed.secret}`,
      '  ',
      '    RECORDINGS STORAGE:',
      '      Cloud Storage: Off',
      '  ',
    ].join('\n'));
  });

  test('Will display the Video capabilities details (with storage)', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVideoCapabilities(getTestApp()),
      true,
      true,
    );

    app.capabilities.video.storage = {
      credential: faker.lorem.word(),
      credentialType: faker.helpers.shuffle(['AmazonS3', 'Azure'])[0],
      serverSideEncryption: true,
      endToEndEncryption: true,
      cloudStorage: true,
    };

    const appMock = jest.fn().mockResolvedValue(app);
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({config: {cli: {appId: app}}, SDK: sdkMock});
    expect(consoleMock.log.mock.calls[2][0]).toBe([
      'Capabilities:',
      '  VIDEO:',
      `    Archive Status URL: [POST] ${app.capabilities.video.webhooks.archiveStatus.address}`,
      `    Archive Status Signature Secret: ${app.capabilities.video.webhooks.archiveStatus.secret}`,
      `    Broadcast Status URL: [POST] ${app.capabilities.video.webhooks.broadcastStatus.address}`,
      `    Broadcast Status Signature Secret: ${app.capabilities.video.webhooks.broadcastStatus.secret}`,
      `    Caption Status URL: [POST] ${app.capabilities.video.webhooks.captionsStatus.address}`,
      `    Caption Status Signature Secret: ${app.capabilities.video.webhooks.captionsStatus.secret}`,
      `    Connection Created URL: [POST] ${app.capabilities.video.webhooks.connectionCreated.address}`,
      `    Connection Created Signature Secret: ${app.capabilities.video.webhooks.connectionCreated.secret}`,
      `    Connection Destroyed URL: [POST] ${app.capabilities.video.webhooks.connectionDestroyed.address}`,
      `    Connection Destroyed Signature Secret: ${app.capabilities.video.webhooks.connectionDestroyed.secret}`,
      `    Render Status URL: [POST] ${app.capabilities.video.webhooks.renderStatus.address}`,
      `    Render Status Signature Secret: ${app.capabilities.video.webhooks.renderStatus.secret}`,
      `    SIP Call Created URL: [POST] ${app.capabilities.video.webhooks.sipCallCreated.address}`,
      `    SIP Call Created Signature Secret: ${app.capabilities.video.webhooks.sipCallCreated.secret}`,
      `    SIP Call Destroyed URL: [POST] ${app.capabilities.video.webhooks.sipCallDestroyed.address}`,
      `    SIP Call Destroyed Signature Secret: ${app.capabilities.video.webhooks.sipCallDestroyed.secret}`,
      `    SIP Call Mute Forced URL: [POST] ${app.capabilities.video.webhooks.sipCallMuteForced.address}`,
      `    SIP Call Mute Forced Signature Secret: ${app.capabilities.video.webhooks.sipCallMuteForced.secret}`,
      `    SIP Call Updated URL: [POST] ${app.capabilities.video.webhooks.sipCallUpdated.address}`,
      `    SIP Call Updated Signature Secret: ${app.capabilities.video.webhooks.sipCallUpdated.secret}`,
      `    Stream Created URL: [POST] ${app.capabilities.video.webhooks.streamCreated.address}`,
      `    Stream Created Signature Secret: ${app.capabilities.video.webhooks.streamCreated.secret}`,
      `    Stream Destroyed URL: [POST] ${app.capabilities.video.webhooks.streamDestroyed.address}`,
      `    Stream Destroyed Signature Secret: ${app.capabilities.video.webhooks.streamDestroyed.secret}`,
      '  ',
      '    RECORDINGS STORAGE:',
      '      Cloud Storage: On',
      `      Storage Type: ${app.capabilities.video.storage.credentialType}`,
      `      Credential: ${app.capabilities.video.storage.credential}`,
      '      End to End Encryption: On',
      '      Server Side Encryption: On',
      '  ',
    ].join('\n'));
  });


  test('Will display VBC', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      {
        ...getTestApp(),
        capabilities: {
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

    await handler({id: app.id, SDK: sdkMock});

    expect(consoleMock.log.mock.calls[2][0]).toBe([
      'Capabilities:',
      '  NB: VBC capabilities is not supported through the command line.',
    ].join('\n'));
  });
});
