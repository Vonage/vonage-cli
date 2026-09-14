process.env.FORCE_COLOR = false;
process.env.NO_COLOR = false;

import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import yaml from 'yaml';
import { redact } from '../../../src/ux/redact.js';
import { handler } from '../../../src/commands/users/show.js';
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

test('Command: vonage users show', { concurrency: 1 }, async (ctx) => {
  ctx.beforeEach(() => {
    mockConsole();
  });

  await ctx.test('Will show a user', async () => {
    const user = getTestUserForAPI();

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [user.id]);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `User ID: ${user.id}`,
      `Name: ${user.name}`,
      `Display Name: ${user.displayName}`,
      `Image URL: ${user.imageUrl}`,
      `Time to Live: ${user.properties.ttl}`,
    ].join('\n'),]);
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [[
      'Channels:',
      '  None Set',
    ].join('\n'),]);
  });

  await ctx.test('Will show a user with the PSTN channel', async () => {
    const user = addPSTNChannelToUser(
      getTestUserForAPI(),
    );

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [user.id]);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `User ID: ${user.id}`,
      `Name: ${user.name}`,
      `Display Name: ${user.displayName}`,
      `Image URL: ${user.imageUrl}`,
      `Time to Live: ${user.properties.ttl}`,
    ].join('\n'),]);

    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [[
      'Channels:',
      '  PSTN',
      '    Number: ' + user.channels.pstn[0].number,
      '  ',
    ].join('\n'),]);

  });

  await ctx.test('Will show a user with the SMS channel', async () => {
    const user = addSMSChannelToUser(
      getTestUserForAPI(),
    );

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [user.id]);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `User ID: ${user.id}`,
      `Name: ${user.name}`,
      `Display Name: ${user.displayName}`,
      `Image URL: ${user.imageUrl}`,
      `Time to Live: ${user.properties.ttl}`,
    ].join('\n'),]);

    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [[
      'Channels:',
      '  SMS',
      '    Number: ' + user.channels.sms[0].number,
      '  ',
    ].join('\n'),]);
  });

  await ctx.test('Will show a user with the MMS channel', async () => {
    const user = addMMSChannelToUser(
      getTestUserForAPI(),
    );

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [user.id]);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `User ID: ${user.id}`,
      `Name: ${user.name}`,
      `Display Name: ${user.displayName}`,
      `Image URL: ${user.imageUrl}`,
      `Time to Live: ${user.properties.ttl}`,
    ].join('\n'),]);

    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [[
      'Channels:',
      '  MMS',
      '    Number: ' + user.channels.mms[0].number,
      '  ',
    ].join('\n'),]);
  });

  await ctx.test('Will show a user with the WhatsApp channel', async () => {
    const user = addWhatsAppChannelToUser(
      getTestUserForAPI(),
    );

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [user.id]);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `User ID: ${user.id}`,
      `Name: ${user.name}`,
      `Display Name: ${user.displayName}`,
      `Image URL: ${user.imageUrl}`,
      `Time to Live: ${user.properties.ttl}`,
    ].join('\n'),]);

    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [[
      'Channels:',
      '  WhatsApp',
      '    Number: ' + user.channels.whatsapp[0].number,
      '  ',
    ].join('\n'),]);
  });

  await ctx.test('Will show a user with the Viber channel', async () => {
    const user = addViberChannelToUser(
      getTestUserForAPI(),
    );

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [user.id]);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `User ID: ${user.id}`,
      `Name: ${user.name}`,
      `Display Name: ${user.displayName}`,
      `Image URL: ${user.imageUrl}`,
      `Time to Live: ${user.properties.ttl}`,
    ].join('\n'),]);

    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [[
      'Channels:',
      '  Viber',
      '    Number: ' + user.channels.viber[0].number,
      '  ',
    ].join('\n'),]);
  });

  await ctx.test('Will show a user with the SIP channel', async () => {
    const user = addSIPChannelToUser(
      getTestUserForAPI(),
    );

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [user.id]);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `User ID: ${user.id}`,
      `Name: ${user.name}`,
      `Display Name: ${user.displayName}`,
      `Image URL: ${user.imageUrl}`,
      `Time to Live: ${user.properties.ttl}`,
    ].join('\n'),]);

    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [[
      'Channels:',
      '  SIP',
      `    URI: ${user.channels.sip[0].uri}`,
      `    Username: ${user.channels.sip[0].username}`,
      `    Password: ${redact(user.channels.sip[0].password)}`,
      '    ',
    ].join('\n'),]);
  });

  await ctx.test('Will show a user with the Websocket channel', async () => {
    const user = addWebsocketChannelToUser(
      getTestUserForAPI(),
    );

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [user.id]);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `User ID: ${user.id}`,
      `Name: ${user.name}`,
      `Display Name: ${user.displayName}`,
      `Image URL: ${user.imageUrl}`,
      `Time to Live: ${user.properties.ttl}`,
    ].join('\n'),]);

    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [[
      'Channels:',
      '  Web Socket',
      `    URL: ${user.channels.websocket[0].uri}`,
      `    Content Type: ${user.channels.websocket[0].contentType}`,
      '    Headers',
      `      X-Header: ${user.channels.websocket[0].headers['X-Header']}`,
      '      ',
    ].join('\n'),]);
  });

  await ctx.test('Will show a user with the Websocket channel and no headers', async () => {
    const user = {
      ...addWebsocketChannelToUser(getTestUserForAPI()),
      channels: {
        websocket: [
          {
            uri: 'wss://example.com/socket',
            contentType: 'audio/l16;rate=16000',
          },
        ],
      },
    };

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [user.id]);

    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [[
      'Channels:',
      '  Web Socket',
      `    URL: ${user.channels.websocket[0].uri}`,
      `    Content Type: ${user.channels.websocket[0].contentType}`,
    ].join('\n'),]);
  });

  await ctx.test('Will show a user with the Messenger channel', async () => {
    const user = addMessengerChannelToUser(
      getTestUserForAPI(),
    );

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [user.id]);

    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [[
      'Channels:',
      '  Messenger',
      `    Id: ${user.channels.messenger[0].id}`,
      '  ',
    ].join('\n'),]);
  });

  await ctx.test('Will output JSON when requested', async () => {
    const user = getTestUserForAPI();

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id, json: true });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [user.id]);
    assert.strictEqual(console.log.mock.callCount(), 1);
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [JSON.stringify(user, null, 2),]);
  });

  await ctx.test('Will output YAML when requested', async () => {
    const user = getTestUserForAPI();

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve(user));

    const sdkMock = {
      users: {
        getUser: userMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id, yaml: true });

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [user.id]);
    assert.strictEqual(console.log.mock.callCount(), 1);
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [yaml.stringify(user),]);
  });
});
