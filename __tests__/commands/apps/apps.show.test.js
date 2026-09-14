process.env.FORCE_COLOR = 0;
import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import yaml from 'yaml';
import {
  getTestApp,
  addVideoCapabilities,
  addNetworkCapabilities,
  addRTCCapabilities,
  addVerifyCapabilities,
  addMessagesCapabilities,
  addVoiceCapabilities,
} from '../../app.js';
import { Client } from '@vonage/server-client';
import { mockConsole } from '../../helpers.js';
import { faker } from '@faker-js/faker';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));




test('Command: vonage apps', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('yargs', { defaultExport: yargs });
  const { handler } = await import('../../../src/commands/apps/show.js');
  ctx.beforeEach(() => {
    mockConsole();
    exitMock.mock.resetCalls();
  });

  await ctx.test('Will display the basic application details', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock });
    assert.strictEqual(console.log.mock.callCount(), 2);

    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [[
      `Name: ${app.name}`,
      `Application ID: ${app.id}`,
      'Improve AI: Off',
      'Private/Public Key: Set',
    ].join('\n')]);
  });

  await ctx.test('Will display application details when Improve AI is on and no key is set', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    app.privacy.improveAI = true;
    delete app.keys.publicKey;

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock });

    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [[
      `Name: ${app.name}`,
      `Application ID: ${app.id}`,
      'Improve AI: On',
      'Private/Public Key: Not Set',
    ].join('\n')]);
  });

  await ctx.test('Will output JSON when requested', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({ config: { cli: { appId: app } }, SDK: sdkMock, json: true });
    assert.strictEqual(console.log.mock.callCount(), 1);

    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(app, true, false),
      null,
      2,
    )]);
  });

  await ctx.test('Will output YAML when requested', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({ config: { cli: { appId: app } }, SDK: sdkMock, yaml: true });

    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [yaml.stringify(
      Client.transformers.snakeCaseObjectKeys(app, true, false),
      null,
      2,
    )]);
  });

  await ctx.test('Will display the message capabilities details', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addMessagesCapabilities(getTestApp()),
      true,
      true,
    );

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({ config: { cli: { appId: app } }, SDK: sdkMock });

    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      'Capabilities:',
      '  MESSAGES:',
      `    Authenticate Inbound Media: ${app.capabilities.messages.authenticateInboundMedia ? 'On' : 'Off'}`,
      `    Webhook Version: ${app.capabilities.messages.version}`,
      `    Status URL: [${app.capabilities.messages.webhooks.statusUrl.httpMethod}] ${app.capabilities.messages.webhooks.statusUrl.address}`,
      `    Inbound URL: [${app.capabilities.messages.webhooks.inboundUrl.httpMethod}] ${app.capabilities.messages.webhooks.inboundUrl.address}`,
      '  ',
    ].join('\n')]);
  });

  await ctx.test('Will display the voice capabilities details', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVoiceCapabilities(getTestApp()),
      true,
      true,
    );

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({ config: { cli: { appId: app } }, SDK: sdkMock });

    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      'Capabilities:',
      '  VOICE:',
      '    Uses Signed callbacks: On',
      `    Conversation TTL: ${app.capabilities.voice.conversationsTtl} hours`,
      `    Leg Persistence Time: ${app.capabilities.voice.legPersistenceTime} days`,
      `    Event URL: [${app.capabilities.voice.webhooks.eventUrl.httpMethod}] ${app.capabilities.voice.webhooks.eventUrl.address}`,
      `    Answer URL: [${app.capabilities.voice.webhooks.answerUrl.httpMethod}] ${app.capabilities.voice.webhooks.answerUrl.address}`,
      `    Fallback URL: [${app.capabilities.voice.webhooks.fallbackAnswerUrl.httpMethod}] ${app.capabilities.voice.webhooks.fallbackAnswerUrl.address}`,
      '  ',
    ].join('\n')]);
  });

  await ctx.test('Will display that no capabilities are enabled when the app has an empty capabilities object', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      {
        ...getTestApp(),
        capabilities: {},
      },
      true,
      true,
    );

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock });

    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      'Capabilities:',
      '  None Enabled',
    ].join('\n')]);
  });

  await ctx.test('Will display the verify capabilities details', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVerifyCapabilities(getTestApp()),
      true,
      true,
    );

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({ config: { cli: { appId: app } }, SDK: sdkMock });
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      'Capabilities:',
      '  VERIFY:',
      `    Webhook Version: ${app.capabilities.verify.version}`,
      `    Status URL: [${app.capabilities.verify.webhooks.statusUrl.httpMethod}] ${app.capabilities.verify.webhooks.statusUrl.address}`,
      '  ',
    ].join('\n')]);
  });

  await ctx.test('Will default message webhook methods to POST when they are missing', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addMessagesCapabilities(getTestApp()),
      true,
      true,
    );

    delete app.capabilities.messages.webhooks.statusUrl.httpMethod;
    delete app.capabilities.messages.webhooks.inboundUrl.httpMethod;

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock });

    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      'Capabilities:',
      '  MESSAGES:',
      `    Authenticate Inbound Media: ${app.capabilities.messages.authenticateInboundMedia ? 'On' : 'Off'}`,
      `    Webhook Version: ${app.capabilities.messages.version}`,
      `    Status URL: [POST] ${app.capabilities.messages.webhooks.statusUrl.address}`,
      `    Inbound URL: [POST] ${app.capabilities.messages.webhooks.inboundUrl.address}`,
      '  ',
    ].join('\n')]);
  });

  await ctx.test('Will display the RTC capabilities details', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addRTCCapabilities(getTestApp()),
      true,
      true,
    );

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({ config: { cli: { appId: app } }, SDK: sdkMock });
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      'Capabilities:',
      '  RTC:',
      `    Event URL: [${app.capabilities.rtc.webhooks.eventUrl.httpMethod}] ${app.capabilities.rtc.webhooks.eventUrl.address}`,
      '    Uses Signed callbacks: On',
      '  ',
    ].join('\n')]);
  });

  await ctx.test('Will display the Network API capabilities details', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addNetworkCapabilities(getTestApp()),
      true,
      true,
    );

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({ config: { cli: { appId: app } }, SDK: sdkMock });
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      'Capabilities:',
      '  NETWORK APIS:',
      `    Redirect URL: [GET] ${app.capabilities.networkApis.redirectUri}`,
      '  ',
    ].join('\n')]);
  });

  await ctx.test('Will display the Video capabilities details (no storage)', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVideoCapabilities(getTestApp()),
      true,
      true,
    );

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({ config: { cli: { appId: app } }, SDK: sdkMock });
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
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
    ].join('\n')]);
  });

  await ctx.test('Will display video capabilities details with missing secrets as Off', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVideoCapabilities(getTestApp()),
      true,
      true,
    );

    delete app.capabilities.video.webhooks.archiveStatus.secret;
    delete app.capabilities.video.webhooks.broadcastStatus.secret;
    delete app.capabilities.video.storage;

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock });

    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      'Capabilities:',
      '  VIDEO:',
      `    Archive Status URL: [POST] ${app.capabilities.video.webhooks.archiveStatus.address}`,
      '    Archive Status Signature Secret: Off',
      `    Broadcast Status URL: [POST] ${app.capabilities.video.webhooks.broadcastStatus.address}`,
      '    Broadcast Status Signature Secret: Off',
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
    ].join('\n')]);
  });

  await ctx.test('Will display the Video capabilities details (with storage)', async () => {
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

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({ config: { cli: { appId: app } }, SDK: sdkMock });
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
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
    ].join('\n')]);
  });

  await ctx.test('Will display VBC', async () => {
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

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock });

    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, [[
      'Capabilities:',
      '  NB: VBC capabilities is not supported through the command line.',
    ].join('\n')]);
  });
});
