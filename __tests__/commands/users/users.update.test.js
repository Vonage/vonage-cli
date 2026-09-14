process.env.FORCE_COLOR = false;
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

test('Command: vonage users update', { concurrency: 1 }, async (ctx) => {
  const exitMock = mock.fn();
  const yargs = mock.fn(() => ({ exit: exitMock }));

  ctx.mock.module('yargs', { defaultExport: yargs });

  const { handler } = await import('../../../src/commands/users/update.js');

  ctx.beforeEach(() => {
    mockConsole();
  });

  ctx.afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
  });

  await ctx.test('Will update a user with no options', async () => {
    const user = getTestUserForAPI();

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
    });
    assert.strictEqual(exitMock.mock.callCount(), 0);

    assert.deepStrictEqual(updateUserMock.mock.calls[0].arguments, [user]);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `User ID: ${user.id}`,
      `Name: ${user.name}`,
      `Display Name: ${user.displayName}`,
      `Image URL: ${user.imageUrl}`,
      `Time to Live: ${user.properties.ttl}`,
    ].join('\n'),]);
  });

  await ctx.test('Will update a user', async () => {
    const user = getTestUserForAPI();

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      imageUrl: user.imageUrl,
      ttl: user.properties.ttl,
      customData: user.properties.customData,
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(updateUserMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{
      id: user.id,
      displayName: user.displayName,
      imageUrl: user.imageUrl,
      name: user.name,
      properties: {
        ttl: user.properties.ttl,
      },
      channels: {},
    }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `User ID: ${user.id}`,
      `Name: ${user.name}`,
      `Display Name: ${user.displayName}`,
      `Image URL: ${user.imageUrl}`,
      `Time to Live: ${user.properties.ttl}`,
    ].join('\n'),]);
  });

  await ctx.test('Will update a user with explicit custom data', async () => {
    const user = getTestUserForAPI();
    const customData = { preferredLocale: 'en-GB' };

    const updateUserMock = mock.fn(() => Promise.resolve({
      ...user,
      properties: {
        ...user.properties,
        customData,
      },
    }));
    const getUserMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      customData,
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(updateUserMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{
      id: user.id,
      name: user.name,
      displayName: user.displayName,
      imageUrl: user.imageUrl,
      properties: {
        customData,
        ttl: user.properties.ttl,
      },
      channels: {},
    }])));
  });

  await ctx.test('Will update a user with PSTN channels', async () => {
    const user = addPSTNChannelToUser(addPSTNChannelToUser(getTestUserForAPI()));

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));
    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      pstnNumber: user.channels.pstn.map((channel) => channel.number),
    });

    assert.deepStrictEqual(updateUserMock.mock.calls[0].arguments, [user]);
  });

  await ctx.test('Will update a user with SMS channels', async () => {
    const user = addSMSChannelToUser(addSMSChannelToUser(getTestUserForAPI()));

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));
    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: user.name,
      smsNumber: user.channels.sms.map((channel) => channel.number),
    });

    assert.deepStrictEqual(updateUserMock.mock.calls[0].arguments, [user]);
  });

  await ctx.test('Will update a user with MMS channels', async () => {
    const user = addMMSChannelToUser(addMMSChannelToUser(getTestUserForAPI()));

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      mmsNumber: user.channels.mms.map((channel) => channel.number),
    });

    assert.deepStrictEqual(updateUserMock.mock.calls[0].arguments, [user]);
  });

  await ctx.test('Will update a user with Viber channels', async () => {
    const user = addViberChannelToUser(addViberChannelToUser(getTestUserForAPI()));

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));
    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      viberNumber: user.channels.viber.map((channel) => channel.number),
    });

    assert.deepStrictEqual(updateUserMock.mock.calls[0].arguments, [user]);
  });

  await ctx.test('Will update a user with SIP channels', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));
    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      sipUrl: user.channels.sip.map((channel) => channel.uri),
      sipUsername: user.channels.sip.map((channel) => channel.username),
      sipPassword: user.channels.sip.map((channel) => channel.password),
    });

    assert.deepStrictEqual(updateUserMock.mock.calls[0].arguments, [user]);
  });

  await ctx.test('Will not update a user with SIP channels when username is missing', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));
    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      sipUrl: user.channels.sip.map((channel) => channel.uri),
      sipPassword: user.channels.sip.map((channel) => channel.password),
    });

    assert.strictEqual(updateUserMock.mock.callCount(), 0);
    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [2]);
  });

  await ctx.test('Will not update a user with SIP channels when password is missing', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));
    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      sipUrl: user.channels.sip.map((channel) => channel.uri),
      sipUsername: user.channels.sip.map((channel) => channel.username),
    });

    assert.strictEqual(updateUserMock.mock.callCount(), 0);
    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [2]);
  });

  await ctx.test('Will not update a user with SIP channels when missing a username', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));
    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      sipUrl: user.channels.sip.map((channel) => channel.uri),
      sipUsername: [user.channels.sip[0].username],
      sipPassword: user.channels.sip.map((channel) => channel.password),
    });

    assert.strictEqual(updateUserMock.mock.callCount(), 0);
    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [2]);
  });

  await ctx.test('Will not update a user with SIP channels when missing a password', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));
    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      sipUrl: user.channels.sip.map((channel) => channel.uri),
      sipUsername: user.channels.sip.map((channel) => channel.username),
      sipPassword: [user.channels.sip[0].password],
    });

    assert.strictEqual(updateUserMock.mock.callCount(), 0);
    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [2]);
  });

  await ctx.test('Will update a user with Websocket channels', async () => {
    const user = addWebsocketChannelToUser(addWebsocketChannelToUser(getTestUserForAPI()));

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      websocketUrl: user.channels.websocket.map((channel) => channel.uri),
      websocketHeaders: user.channels.websocket.map((channel) => channel.headers),
      websocketContentType: user.channels.websocket.map((channel) => channel.contentType),
    });

    assert.deepStrictEqual(updateUserMock.mock.calls[0].arguments, [user]);
  });

  await ctx.test('Will update a user with Websocket channels and no headers', async () => {
    const user = addWebsocketChannelToUser(getTestUserForAPI());

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      websocketUrl: user.channels.websocket.map((channel) => channel.uri),
      websocketContentType: user.channels.websocket.map((channel) => channel.contentType),
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(updateUserMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{
      ...user,
      channels: {
        ...user.channels,
        websocket: user.channels.websocket.map((channel) => ({
          uri: channel.uri,
          contentType: channel.contentType,
        })),
      },
    }])));
  });

  await ctx.test('Will update a user with Websocket channels and no content type', async () => {
    const user = addWebsocketChannelToUser(getTestUserForAPI());

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      websocketUrl: user.channels.websocket.map((channel) => channel.uri),
      websocketHeaders: user.channels.websocket.map((channel) => channel.headers),
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(updateUserMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{
      ...user,
      channels: {
        ...user.channels,
        websocket: user.channels.websocket.map((channel) => ({
          uri: channel.uri,
          headers: channel.headers,
        })),
      },
    }])));
  });

  await ctx.test('Will not update a user with Websocket when missing header', async () => {
    const user = addWebsocketChannelToUser(addWebsocketChannelToUser(getTestUserForAPI()));

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      websocketUrl: user.channels.websocket.map((channel) => channel.uri),
      websocketHeaders: [user.channels.websocket[0].headers],
      websocketContentType: user.channels.websocket.map((channel) => channel.contentType),
    });

    assert.strictEqual(updateUserMock.mock.callCount(), 0);
  });

  await ctx.test('Will not update a user with Websocket when missing content type', async () => {
    const user = addWebsocketChannelToUser(addWebsocketChannelToUser(getTestUserForAPI()));

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      websocketUrl: user.channels.websocket.map((channel) => channel.uri),
      websocketHeaders: user.channels.websocket.map((channel) => channel.headers),
      websocketContentType: [user.channels.websocket[0].contentType],
    });

    assert.strictEqual(updateUserMock.mock.callCount(), 0);
  });

  await ctx.test('Will update a user with WhatsApp channels', async () => {
    const user = addWhatsAppChannelToUser(addWhatsAppChannelToUser(getTestUserForAPI()));

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      whatsAppNumber: user.channels.whatsapp.map((channel) => channel.number),
    });

    assert.deepStrictEqual(updateUserMock.mock.calls[0].arguments, [user]);
  });

  await ctx.test('Will update a user with Messenger channels', async () => {
    const user = addMessengerChannelToUser(addMessengerChannelToUser(getTestUserForAPI()));

    const updateUserMock = mock.fn(() => Promise.resolve(user));
    const getUserMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        updateUser: updateUserMock,
        getUser: getUserMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: user.id,
      name: user.name,
      facebookMessengerId: user.channels.messenger.map((channel) => channel.id),
    });

    assert.deepStrictEqual(updateUserMock.mock.calls[0].arguments, [user]);
  });
});
