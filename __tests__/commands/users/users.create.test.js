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
      whatsapp: user.channels.whatsapp.map((channel) => channel.number),
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
