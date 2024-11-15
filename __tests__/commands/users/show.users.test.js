process.env.FORCE_COLOR = 0;
const yargs = require('yargs');
const { redact } = require('../../../src/ux/redact');
const { handler } = require('../../../src/commands/users/show');
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

describe('Command: vonage users show', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will show a user', async () => {
    const user = getTestUserForAPI();

    const userMock = jest.fn()
      .mockResolvedValueOnce(user);

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    expect(userMock).toHaveBeenCalledWith(user.id);

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
    expect(console.log).toHaveBeenNthCalledWith(
      4,
      [
        'Channels:',
        '  None Set',
      ].join('\n'),
    );
  });

  test('Will show a user with the PSTN channel', async () => {
    const user = addPSTNChannelToUser(
      getTestUserForAPI(),
    );

    const userMock = jest.fn()
      .mockResolvedValueOnce(user);

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    expect(userMock).toHaveBeenCalledWith(user.id);

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

    expect(console.log).toHaveBeenNthCalledWith(
      4,
      [
        'Channels:',
        '  PSTN',
        '    Number: ' + user.channels.pstn[0].number,
        '  ',
      ].join('\n'),
    );

  });

  test('Will show a user with the SMS channel', async () => {
    const user = addSMSChannelToUser(
      getTestUserForAPI(),
    );

    const userMock = jest.fn()
      .mockResolvedValueOnce(user);

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    expect(userMock).toHaveBeenCalledWith(user.id);

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

    expect(console.log).toHaveBeenNthCalledWith(
      4,
      [
        'Channels:',
        '  SMS',
        '    Number: ' + user.channels.sms[0].number,
        '  ',
      ].join('\n'),
    );
  });

  test('Will show a user with the MMS channel', async () => {
    const user = addMMSChannelToUser(
      getTestUserForAPI(),
    );

    const userMock = jest.fn()
      .mockResolvedValueOnce(user);

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    expect(userMock).toHaveBeenCalledWith(user.id);

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

    expect(console.log).toHaveBeenNthCalledWith(
      4,
      [
        'Channels:',
        '  MMS',
        '    Number: ' + user.channels.mms[0].number,
        '  ',
      ].join('\n'),
    );
  });

  test('Will show a user with the WhatsApp channel', async () => {
    const user = addWhatsAppChannelToUser(
      getTestUserForAPI(),
    );

    const userMock = jest.fn()
      .mockResolvedValueOnce(user);

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    expect(userMock).toHaveBeenCalledWith(user.id);

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

    expect(console.log).toHaveBeenNthCalledWith(
      4,
      [
        'Channels:',
        '  WhatsApp',
        '    Number: ' + user.channels.whatsapp[0].number,
        '  ',
      ].join('\n'),
    );
  });

  test('Will show a user with the Viber channel', async () => {
    const user = addViberChannelToUser(
      getTestUserForAPI(),
    );

    const userMock = jest.fn()
      .mockResolvedValueOnce(user);

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    expect(userMock).toHaveBeenCalledWith(user.id);

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

    expect(console.log).toHaveBeenNthCalledWith(
      4,
      [
        'Channels:',
        '  Viber',
        '    Number: ' + user.channels.viber[0].number,
        '  ',
      ].join('\n'),
    );
  });

  test('Will show a user with the SIP channel', async () => {
    const user = addSIPChannelToUser(
      getTestUserForAPI(),
    );

    const userMock = jest.fn()
      .mockResolvedValueOnce(user);

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    expect(userMock).toHaveBeenCalledWith(user.id);

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

    expect(console.log).toHaveBeenNthCalledWith(
      4,
      [
        'Channels:',
        '  SIP',
        `    URI: ${user.channels.sip[0].uri}`,
        `    Username: ${user.channels.sip[0].username}`,
        `    Password: ${redact(user.channels.sip[0].password)}`,
        '    ',
      ].join('\n'),
    );
  });

  test('Will show a user with the Websocket channel', async () => {
    const user = addWebsocketChannelToUser(
      getTestUserForAPI(),
    );

    const userMock = jest.fn()
      .mockResolvedValueOnce(user);

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    expect(userMock).toHaveBeenCalledWith(user.id);

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

    expect(console.log).toHaveBeenNthCalledWith(
      4,
      [
        'Channels:',
        '  Web Socket',
        `    URL: ${user.channels.websocket[0].url}`,
        `    Content Type: ${user.channels.websocket[0].contentType}`,
        '    Headers',
        `      X-Header: ${user.channels.websocket[0].headers['X-Header']}`,
        '      ',
      ].join('\n'),
    );
  });

  test('Will handle an error', async () => {
    const user = getTestUserForAPI();

    const userMock = jest.fn()
      .mockRejectedValueOnce(new Error('An error occurred'));

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });
    expect(console.log).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(99);
  });
});
