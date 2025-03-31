process.env.FORCE_COLOR = 0;
const yargs = require('yargs');
const { handler } = require('../../../src/commands/users/update');
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

describe('Command: vonage users update', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will update a user with no options', async () => {
    const user = getTestUserForAPI();

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);

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
    expect(yargs.exit).not.toHaveBeenCalled();

    expect(updateUserMock).toHaveBeenCalledWith(user);

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

  test('Will update a user', async () => {
    const user = getTestUserForAPI();

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(updateUserMock).toHaveBeenCalledWith({
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

  test('Will update a user with PSTN channels', async () => {
    const user = addPSTNChannelToUser(addPSTNChannelToUser(getTestUserForAPI()));

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);
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

    expect(updateUserMock).toHaveBeenCalledWith(user);
  });

  test('Will update a user with SMS channels', async () => {
    const user = addSMSChannelToUser(addSMSChannelToUser(getTestUserForAPI()));

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);
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

    expect(updateUserMock).toHaveBeenCalledWith(user);
  });

  test('Will update a user with MMS channels', async () => {
    const user = addMMSChannelToUser(addMMSChannelToUser(getTestUserForAPI()));

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(updateUserMock).toHaveBeenCalledWith(user);
  });

  test('Will update a user with Viber channels', async () => {
    const user = addViberChannelToUser(addViberChannelToUser(getTestUserForAPI()));

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);
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

    expect(updateUserMock).toHaveBeenCalledWith(user);
  });

  test('Will update a user with SIP channels', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);
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

    expect(updateUserMock).toHaveBeenCalledWith(user);
  });

  test('Will not update a user with SIP channels when username is missing', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);
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

    expect(updateUserMock).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(2);
  });

  test('Will not update a user with SIP channels when password is missing', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);
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

    expect(updateUserMock).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(2);
  });

  test('Will not update a user with SIP channels when missing a username', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);
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

    expect(updateUserMock).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(2);
  });

  test('Will not update a user with SIP channels when missing a password', async () => {
    const user = addSIPChannelToUser(addSIPChannelToUser(getTestUserForAPI()));

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);
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

    expect(updateUserMock).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(2);
  });

  test('Will update a user with Websocket channels', async () => {
    const user = addWebsocketChannelToUser(addWebsocketChannelToUser(getTestUserForAPI()));

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(updateUserMock).toHaveBeenCalledWith(user);
  });

  test('Will update a user with Websocket channels and no headers', async () => {
    const user = addWebsocketChannelToUser(getTestUserForAPI());

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(updateUserMock).toHaveBeenCalledWith({
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

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(updateUserMock).toHaveBeenCalledWith({
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

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(updateUserMock).not.toHaveBeenCalled();
  });

  test('Will not update a user with Websocket when missing content type', async () => {
    const user = addWebsocketChannelToUser(addWebsocketChannelToUser(getTestUserForAPI()));

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(updateUserMock).not.toHaveBeenCalled();
  });

  test('Will update a user with WhatsApp channels', async () => {
    const user = addWhatsAppChannelToUser(addWhatsAppChannelToUser(getTestUserForAPI()));

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(updateUserMock).toHaveBeenCalledWith(user);
  });

  test('Will update a user with Messenger channels', async () => {
    const user = addMessengerChannelToUser(addMessengerChannelToUser(getTestUserForAPI()));

    const updateUserMock = jest.fn()
      .mockResolvedValue(user);

    const getUserMock = jest.fn()
      .mockResolvedValue(user);

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

    expect(updateUserMock).toHaveBeenCalledWith(user);
  });
});
