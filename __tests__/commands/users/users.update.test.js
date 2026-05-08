
const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const __moduleMocks = {
  'yargs': (() => ({
    default: yargs,
  }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/users/update.js', __moduleMocks);
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

describe('Command: vonage users update', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
  });

  test('Will update a user with no options', async () => {
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

    assertCalledWith(updateUserMock, user);

    assertNthCalledWith(
      console.log,
      2,
      [
        `User ID: ${user.id}`,
        `Name: ${user.name}`,
        `Display Name: ${user.displayName}`,
        `Image URL: ${user.imageUrl}`,
        `Time to Live: ${user.properties.ttl}`,
      ].join('\n'),
    );
  });

  test('Will update a user', async () => {
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

    assertCalledWith(updateUserMock, {
      id: user.id,
      displayName: user.displayName,
      imageUrl: user.imageUrl,
      name: user.name,
      properties: {
        customData: user.properties.customData,
        ttl: user.properties.ttl,
      },
      channels: {},
    });

    assertNthCalledWith(
      console.log,
      2,
      [
        `User ID: ${user.id}`,
        `Name: ${user.name}`,
        `Display Name: ${user.displayName}`,
        `Image URL: ${user.imageUrl}`,
        `Time to Live: ${user.properties.ttl}`,
      ].join('\n'),
    );
  });

  test('Will update a user with PSTN channels', async () => {
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

    assertCalledWith(updateUserMock, user);
  });

  test('Will update a user with SMS channels', async () => {
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

    assertCalledWith(updateUserMock, user);
  });

  test('Will update a user with MMS channels', async () => {
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

    assertCalledWith(updateUserMock, user);
  });

  test('Will update a user with Viber channels', async () => {
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

    assertCalledWith(updateUserMock, user);
  });

  test('Will update a user with SIP channels', async () => {
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

    assertCalledWith(updateUserMock, user);
  });

  test('Will not update a user with SIP channels when username is missing', async () => {
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
    assertCalledWith(exitMock, 2);
  });

  test('Will not update a user with SIP channels when password is missing', async () => {
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
    assertCalledWith(exitMock, 2);
  });

  test('Will not update a user with SIP channels when missing a username', async () => {
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
    assertCalledWith(exitMock, 2);
  });

  test('Will not update a user with SIP channels when missing a password', async () => {
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
    assertCalledWith(exitMock, 2);
  });

  test('Will update a user with Websocket channels', async () => {
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

    assertCalledWith(updateUserMock, user);
  });

  test('Will update a user with Websocket channels and no headers', async () => {
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

    assertCalledWith(updateUserMock, {
      ...user,
      channels: {
        ...user.channels,
        websocket: user.channels.websocket.map((channel) => ({
          uri: channel.uri,
          contentType: channel.contentType,
        })),
      },
    });
  });

  test('Will update a user with Websocket channels and no content type', async () => {
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

    assertCalledWith(updateUserMock, {
      ...user,
      channels: {
        ...user.channels,
        websocket: user.channels.websocket.map((channel) => ({
          uri: channel.uri,
          headers: channel.headers,
        })),
      },
    });
  });

  test('Will not update a user with Websocket when missing header', async () => {
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

  test('Will not update a user with Websocket when missing content type', async () => {
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

  test('Will update a user with WhatsApp channels', async () => {
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

    assertCalledWith(updateUserMock, user);
  });

  test('Will update a user with Messenger channels', async () => {
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

    assertCalledWith(updateUserMock, user);
  });
});
