process.env.FORCE_COLOR = 0;
const yargs = require('yargs');
const { handler } = require('../../../src/commands/users/create');
const { mockConsole } = require('../../helpers');
const {
  getTestUserForAPI,
  addPSTNChannelToUser,
  addSMSChannelToUser,
  addMMSChannelToUser,
  addWhatsAppChannelToUser,
  addViberChannelToUser,
  addSIPChannelToUser,
  addWebsocketChannelToUser,
  addMessengerChannelToUser,
} = require('../../users');

jest.mock('yargs');

describe('Command: vonage users create', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will create a user with no options', async () => {
    const user = getTestUserForAPI();

    const userMock = jest.fn()
      .mockResolvedValue(user);

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({ SDK: sdkMock });
    expect(yargs.exit).not.toHaveBeenCalled();

    expect(userMock).toHaveBeenCalledWith({
      properties: {},
      channels: {},
    });

    expect(console.log).toHaveBeenNthCalledWith(
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

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).toHaveBeenCalledWith({
      displayName: user.displayName,
      imageUrl: user.imageUrl,
      name: user.name,
      properties: {
        ttl: user.properties.ttl,
      },
      channels: {},
    });

    expect(console.log).toHaveBeenNthCalledWith(
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

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).toHaveBeenCalledWith({
      name: user.name,
      properties: {},
      channels: {
        pstn: user.channels.pstn,
      },
    });
  });

  test('Will create a user with SMS channels', async () => {
    const user = addSMSChannelToUser(addSMSChannelToUser(getTestUserForAPI()));

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).toHaveBeenCalledWith({
      name: user.name,
      properties: {},
      channels: {
        sms: user.channels.sms,
      },
    });
  });

  test('Will create a user with MMS channels', async () => {
    const user = addMMSChannelToUser(addMMSChannelToUser(getTestUserForAPI()));

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).toHaveBeenCalledWith({
      name: user.name,
      properties: {},
      channels: {
        mms: user.channels.mms,
      },
    });
  });

  test('Will create a user with Viber channels', async () => {
    const user = addViberChannelToUser(addViberChannelToUser(getTestUserForAPI()));

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).toHaveBeenCalledWith({
      name: user.name,
      properties: {},
      channels: {
        viber: user.channels.viber,
      },
    });
  });

  test('Will create a user with SIP channels', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).toHaveBeenCalledWith({
      name: user.name,
      properties: {},
      channels: {
        sip: user.channels.sip,
      },
    });
  });

  test('Will not create a user with SIP channels when username is missing', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(2);
  });

  test('Will not create a user with SIP channels when password is missing', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(2);
  });

  test('Will not create a user with SIP channels when missing a username', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(2);
  });

  test('Will not create a user with SIP channels when missing a password', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(2);
  });

  test('Will create a user with Websocket channels', async () => {
    const user = addWebsocketChannelToUser(addWebsocketChannelToUser(getTestUserForAPI()));

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).toHaveBeenCalledWith({
      name: user.name,
      properties: {},
      channels: {
        websocket: user.channels.websocket,
      },
    });
  });

  test('Will create a user with Websocket channels and no headers', async () => {
    const user = addWebsocketChannelToUser(getTestUserForAPI());

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).toHaveBeenCalledWith({
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

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).toHaveBeenCalledWith({
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

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).not.toHaveBeenCalled();
  });

  test('Will not create a user with Websocket when missing content type', async () => {
    const user = addWebsocketChannelToUser(addWebsocketChannelToUser(getTestUserForAPI()));

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).not.toHaveBeenCalled();
  });

  test('Will create a user with WhatsApp channels', async () => {
    const user = addWhatsAppChannelToUser(addWhatsAppChannelToUser(getTestUserForAPI()));

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).toHaveBeenCalledWith({
      name: user.name,
      properties: {},
      channels: {
        whatsapp: user.channels.whatsapp,
      },
    });
  });

  test('Will create a user with Messenger channels', async () => {
    const user = addMessengerChannelToUser(addMessengerChannelToUser(getTestUserForAPI()));

    const userMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(userMock).toHaveBeenCalledWith({
      name: user.name,
      properties: {},
      channels: {
        messenger: user.channels.messenger,
      },
    });
  });
});
