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
} = require('../../users');

jest.mock('yargs');
jest.mock('../../../src/ux/confirm');

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
      websocketUrl: user.channels.websocket.map((channel) => channel.url),
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

  test('Will handle SDK error', async () => {
    const userMock = jest.fn()
      .mockRejectedValue(new Error('SDK Error'));

    const sdkMock = {
      users: {
        createUser: userMock,
      },
    };

    await handler({ SDK: sdkMock });

    expect(userMock).toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(99);
  });
});
