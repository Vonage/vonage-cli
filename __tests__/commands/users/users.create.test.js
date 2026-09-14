
import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConsole } from '../../helpers.js';
import {
  getTestUserForAPI,
  addPSTNChannelToUser,
  addSMSChannelToUser,
  addMMSChannelToUser,
  addWhatsAppChannelToUser,
  addViberChannelToUser,
  addSIPChannelToUser,
  addWebsocketChannelToUser,
  addMessengerChannelToUser,
} from '../../users.js';

test('Command: vonage users create', { concurrency: 1 }, async (ctx) => {
  const exitMock = mock.fn();
  const yargs = mock.fn(() => ({ exit: exitMock }));

  ctx.mock.module('yargs', { defaultExport: yargs });

  const { handler } = await import('../../../src/commands/users/create.js');

  ctx.beforeEach(() => {
    mockConsole();
  });

  ctx.afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
  });

  await ctx.test('Will create a user with no options', async () => {
    const user = getTestUserForAPI();

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({ SDK: sdkMock });
    assert.strictEqual(exitMock.mock.callCount(), 0);

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [{
      properties: {},
      channels: {},
    }]);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `User ID: ${user.id}`,
      `Name: ${user.name}`,
      `Display Name: ${user.displayName}`,
      `Image URL: ${user.imageUrl}`,
      `Time to Live: ${user.properties.ttl}`,
    ].join('\n'), ]);
  });

  await ctx.test('Will create a user', async () => {
    const user = getTestUserForAPI();

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      displayName: user.displayName,
      imageUrl: user.imageUrl,
      ttl: user.properties.ttl,
      customData: user.properties.customData,
    });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [{
      displayName: user.displayName,
      imageUrl: user.imageUrl,
      name: user.name,
      properties: {
        ttl: user.properties.ttl,
      },
      channels: {},
    }]);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `User ID: ${user.id}`,
      `Name: ${user.name}`,
      `Display Name: ${user.displayName}`,
      `Image URL: ${user.imageUrl}`,
      `Time to Live: ${user.properties.ttl}`,
    ].join('\n'), ]);
  });

  await ctx.test('Will create a user with PSTN channels', async () => {
    const user = addPSTNChannelToUser(addPSTNChannelToUser(getTestUserForAPI()));

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      pstnNumber: user.channels.pstn.map((channel) => channel.number),
    });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [{
      name: user.name,
      properties: {},
      channels: {
        pstn: user.channels.pstn,
      },
    }]);
  });

  await ctx.test('Will create a user with SMS channels', async () => {
    const user = addSMSChannelToUser(addSMSChannelToUser(getTestUserForAPI()));

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      smsNumber: user.channels.sms.map((channel) => channel.number),
    });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [{
      name: user.name,
      properties: {},
      channels: {
        sms: user.channels.sms,
      },
    }]);
  });

  await ctx.test('Will create a user with MMS channels', async () => {
    const user = addMMSChannelToUser(addMMSChannelToUser(getTestUserForAPI()));

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      mmsNumber: user.channels.mms.map((channel) => channel.number),
    });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [{
      name: user.name,
      properties: {},
      channels: {
        mms: user.channels.mms,
      },
    }]);
  });

  await ctx.test('Will create a user with Viber channels', async () => {
    const user = addViberChannelToUser(addViberChannelToUser(getTestUserForAPI()));

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      viberNumber: user.channels.viber.map((channel) => channel.number),
    });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [{
      name: user.name,
      properties: {},
      channels: {
        viber: user.channels.viber,
      },
    }]);
  });

  await ctx.test('Will create a user with SIP channels', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      sipUrl: user.channels.sip.map((channel) => channel.uri),
      sipUsername: user.channels.sip.map((channel) => channel.username),
      sipPassword: user.channels.sip.map((channel) => channel.password),
    });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [{
      name: user.name,
      properties: {},
      channels: {
        sip: user.channels.sip,
      },
    }]);
  });

  await ctx.test('Will create a user with partially populated SIP and Websocket channels', async () => {
    const user = {
      ...getTestUserForAPI(),
      channels: {
        sip: [
          {
            uri: 'sip:alice@example.com',
            username: 'alice',
            password: 'super-secret',
          },
          {
            uri: 'sip:bob@example.com',
          },
        ],
        websocket: [
          {
            uri: 'wss://example.com/socket-1',
            contentType: 'audio/l16;rate=16000',
            headers: {
              'X-Header': 'one',
            },
          },
          {
            uri: 'wss://example.com/socket-2',
          },
        ],
      },
    };

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      sipUrl: user.channels.sip.map((channel) => channel.uri),
      sipUsername: [user.channels.sip[0].username, ''],
      sipPassword: [user.channels.sip[0].password, ''],
      websocketUrl: user.channels.websocket.map((channel) => channel.uri),
      websocketHeaders: [user.channels.websocket[0].headers, undefined],
      websocketContentType: [user.channels.websocket[0].contentType, ''],
    });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [{
      name: user.name,
      properties: {},
      channels: user.channels,
    }]);
  });

  await ctx.test('Will not create a user with SIP channels when username is missing', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      sipUrl: user.channels.sip.map((channel) => channel.uri),
      sipPassword: user.channels.sip.map((channel) => channel.password),
    });

    assert.strictEqual(userMock.mock.callCount(), 0);
    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [2]);
  });

  await ctx.test('Will not create a user with SIP channels when password is missing', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      sipUrl: user.channels.sip.map((channel) => channel.uri),
      sipUsername: user.channels.sip.map((channel) => channel.username),
    });

    assert.strictEqual(userMock.mock.callCount(), 0);
    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [2]);
  });

  await ctx.test('Will not create a user with SIP channels when missing a username', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      sipUrl: user.channels.sip.map((channel) => channel.uri),
      sipUsername: [user.channels.sip[0].username],
      sipPassword: user.channels.sip.map((channel) => channel.password),
    });

    assert.strictEqual(userMock.mock.callCount(), 0);
    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [2]);
  });

  await ctx.test('Will not create a user with SIP channels when missing a password', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      sipUrl: user.channels.sip.map((channel) => channel.uri),
      sipUsername: user.channels.sip.map((channel) => channel.username),
      sipPassword: [user.channels.sip[0].password],
    });

    assert.strictEqual(userMock.mock.callCount(), 0);
    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [2]);
  });

  await ctx.test('Will create a user with Websocket channels', async () => {
    const user = addWebsocketChannelToUser(addWebsocketChannelToUser(getTestUserForAPI()));

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      websocketUrl: user.channels.websocket.map((channel) => channel.uri),
      websocketHeaders: user.channels.websocket.map((channel) => channel.headers),
      websocketContentType: user.channels.websocket.map((channel) => channel.contentType),
    });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [{
      name: user.name,
      properties: {},
      channels: {
        websocket: user.channels.websocket,
      },
    }]);
  });

  await ctx.test('Will create a user with Websocket channels and no headers', async () => {
    const user = addWebsocketChannelToUser(getTestUserForAPI());

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      websocketUrl: user.channels.websocket.map((channel) => channel.uri),
      websocketContentType: user.channels.websocket.map((channel) => channel.contentType),
    });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [{
      name: user.name,
      properties: {},
      channels: {
        websocket: [
          {
            uri: user.channels.websocket[0].uri,
            contentType: user.channels.websocket[0].contentType,
          },
        ],
      },
    }]);
  });

  await ctx.test('Will create a user with Websocket channels and no content type', async () => {
    const user = addWebsocketChannelToUser(getTestUserForAPI());

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      websocketUrl: user.channels.websocket.map((channel) => channel.uri),
      websocketHeaders: user.channels.websocket.map((channel) => channel.headers),
    });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [{
      name: user.name,
      properties: {},
      channels: {
        websocket: [
          {
            uri: user.channels.websocket[0].uri,
            headers: user.channels.websocket[0].headers,
          },
        ],
      },
    }]);
  });

  await ctx.test('Will not create a user with Websocket when missing header', async () => {
    const user = addWebsocketChannelToUser(addWebsocketChannelToUser(getTestUserForAPI()));

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      websocketUrl: user.channels.websocket.map((channel) => channel.uri),
      websocketHeaders: [user.channels.websocket[0].headers],
      websocketContentType: user.channels.websocket.map((channel) => channel.contentType),
    });

    assert.strictEqual(userMock.mock.callCount(), 0);
  });

  await ctx.test('Will not create a user with Websocket when missing content type', async () => {
    const user = addWebsocketChannelToUser(addWebsocketChannelToUser(getTestUserForAPI()));

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      websocketUrl: user.channels.websocket.map((channel) => channel.uri),
      websocketHeaders: user.channels.websocket.map((channel) => channel.headers),
      websocketContentType: [user.channels.websocket[0].contentType],
    });

    assert.strictEqual(userMock.mock.callCount(), 0);
  });

  await ctx.test('Will create a user with WhatsApp channels', async () => {
    const user = addWhatsAppChannelToUser(addWhatsAppChannelToUser(getTestUserForAPI()));

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      whatsAppNumber: user.channels.whatsapp.map((channel) => channel.number),
    });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [{
      name: user.name,
      properties: {},
      channels: {
        whatsapp: user.channels.whatsapp,
      },
    }]);
  });

  await ctx.test('Will create a user with Messenger channels', async () => {
    const user = addMessengerChannelToUser(addMessengerChannelToUser(getTestUserForAPI()));

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      facebookMessengerId: user.channels.messenger.map((channel) => channel.id),
    });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [{
      name: user.name,
      properties: {},
      channels: {
        messenger: user.channels.messenger,
      },
    }]);
  });
});
