
const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const __moduleMocks = {
  'yargs': (() => ({
    default: yargs,
  }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/users/create.js', __moduleMocks);
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

describe('Command: vonage users create', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
  });

  test('Will create a user with no options', async () => {
    const user = getTestUserForAPI();

    const userMock = mock.fn(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({ SDK: sdkMock });
    assert.strictEqual(exitMock.mock.callCount(), 0);

    assertCalledWith(userMock, {
      properties: {},
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

  test('Will create a user', async () => {
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

    assertCalledWith(userMock, {
      displayName: user.displayName,
      imageUrl: user.imageUrl,
      name: user.name,
      properties: {
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

  test('Will create a user with PSTN channels', async () => {
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

    assertCalledWith(userMock, {
      name: user.name,
      properties: {},
      channels: {
        pstn: user.channels.pstn,
      },
    });
  });

  test('Will create a user with SMS channels', async () => {
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

    assertCalledWith(userMock, {
      name: user.name,
      properties: {},
      channels: {
        sms: user.channels.sms,
      },
    });
  });

  test('Will create a user with MMS channels', async () => {
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

    assertCalledWith(userMock, {
      name: user.name,
      properties: {},
      channels: {
        mms: user.channels.mms,
      },
    });
  });

  test('Will create a user with Viber channels', async () => {
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

    assertCalledWith(userMock, {
      name: user.name,
      properties: {},
      channels: {
        viber: user.channels.viber,
      },
    });
  });

  test('Will create a user with SIP channels', async () => {
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

    assertCalledWith(userMock, {
      name: user.name,
      properties: {},
      channels: {
        sip: user.channels.sip,
      },
    });
  });

  test('Will not create a user with SIP channels when username is missing', async () => {
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
    assertCalledWith(exitMock, 2);
  });

  test('Will not create a user with SIP channels when password is missing', async () => {
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
    assertCalledWith(exitMock, 2);
  });

  test('Will not create a user with SIP channels when missing a username', async () => {
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
    assertCalledWith(exitMock, 2);
  });

  test('Will not create a user with SIP channels when missing a password', async () => {
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
    assertCalledWith(exitMock, 2);
  });

  test('Will create a user with Websocket channels', async () => {
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

    assertCalledWith(userMock, {
      name: user.name,
      properties: {},
      channels: {
        websocket: user.channels.websocket,
      },
    });
  });

  test('Will create a user with Websocket channels and no headers', async () => {
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

    assertCalledWith(userMock, {
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
    });
  });

  test('Will create a user with Websocket channels and no content type', async () => {
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

    assertCalledWith(userMock, {
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
    });
  });

  test('Will not create a user with Websocket when missing header', async () => {
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

  test('Will not create a user with Websocket when missing content type', async () => {
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

  test('Will create a user with WhatsApp channels', async () => {
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

    assertCalledWith(userMock, {
      name: user.name,
      properties: {},
      channels: {
        whatsapp: user.channels.whatsapp,
      },
    });
  });

  test('Will create a user with Messenger channels', async () => {
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

    assertCalledWith(userMock, {
      name: user.name,
      properties: {},
      channels: {
        messenger: user.channels.messenger,
      },
    });
  });
});
