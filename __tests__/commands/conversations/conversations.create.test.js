import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { EventType } from '@vonage/conversations';
import { displayDate } from '../../../src/ux/locale.js';

import { mockConsole } from '../../helpers.js';
import { getTestConversationForAPI, addCLIPropertiesToConversation } from '../../conversations.js';

const conversationEvents = Object.values(EventType);

test('Command: vonage conversations create', { concurrency: 1 }, async (ctx) => {
  const confirm = mock.fn();

  const exitMock = mock.fn();
  const yargs = mock.fn(() => ({ exit: exitMock }));

  ctx.mock.module('../../../src/ux/confirm.js', { namedExports: { confirm } });
  ctx.mock.module('yargs', { defaultExport: yargs });

  const { handler } = await import('../../../src/commands/conversations/create.js');

  ctx.beforeEach(() => {
    mockConsole();
  });

  ctx.afterEach(() => {
    confirm.mock.resetCalls();
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
  });

  await ctx.test('Will create a conversation with no options', async () => {
    const conversation = getTestConversationForAPI();

    const conversationMock = mock.fn(() => Promise.resolve(conversation));

    const sdkMock = {
      conversations: {
        createConversation: conversationMock,
      },
    };

    await handler({ SDK: sdkMock });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(conversationMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{
      displayName: undefined,
      imageUrl: undefined,
      name: undefined,
      numbers: undefined,
      properties: {
        customData: undefined,
        ttl: undefined,
      },
      callback: {
        eventMask: undefined,
        method: undefined,
        params: {
          applicationId: undefined,
          nccoUrl: undefined,
        },
        url: undefined,
      },
    }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `Name: ${conversation.name}`,
      `Conversation ID: ${conversation.id}`,
      `Display Name: ${conversation.displayName}`,
      `Image URL: ${conversation.imageUrl}`,
      `State: ${conversation.state}`,
      `Time to Leave: ${conversation.properties.ttl}`,
      `Created at: ${displayDate(conversation.timestamp.created)}`,
      `Updated at: ${displayDate(conversation.timestamp.updated)}`,
      'Destroyed at: Not Set',
      `Sequence: ${conversation.sequenceNumber}`,
    ].join('\n'), ]);
  });

  await ctx.test('Will create a conversation', async () => {
    const conversation = getTestConversationForAPI();
    const cliConversation = addCLIPropertiesToConversation(conversation);

    const conversationMock = mock.fn(() => Promise.resolve(conversation));

    const sdkMock = {
      conversations: {
        createConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      name: cliConversation.name,
      displayName: cliConversation.displayName,
      imageUrl: cliConversation.imageUrl,
      ttl: cliConversation.properties.ttl,
      customData: cliConversation.properties.customData,
      phoneNumber: cliConversation.numbers[0].number,
      callbackUrl: cliConversation.callback.url,
      callbackMethod: cliConversation.callback.method,
      callbackEventMask: cliConversation.callback.eventMask,
      callbackApplicationId: cliConversation.callback.params.applicationId,
      callbackNccoUrl: cliConversation.callback.params.nccoUrl,
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(conversationMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{
      displayName: cliConversation.displayName,
      imageUrl: cliConversation.imageUrl,
      name: cliConversation.name,
      numbers: [
        {
          type: 'phone',
          number: cliConversation.numbers[0].number,
        },
      ],
      properties: {
        ttl: cliConversation.properties.ttl,
      },
      callback: {
        eventMask: cliConversation.callback.eventMask.join(','),
        method: cliConversation.callback.method,
        params: {
          applicationId: cliConversation.callback.params.applicationId,
          nccoUrl: cliConversation.callback.params.nccoUrl,
        },
        url: cliConversation.callback.url,
      },
    }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `Name: ${conversation.name}`,
      `Conversation ID: ${conversation.id}`,
      `Display Name: ${conversation.displayName}`,
      `Image URL: ${conversation.imageUrl}`,
      `State: ${conversation.state}`,
      `Time to Leave: ${conversation.properties.ttl}`,
      `Created at: ${displayDate(conversation.timestamp.created)}`,
      `Updated at: ${displayDate(conversation.timestamp.updated)}`,
      'Destroyed at: Not Set',
      `Sequence: ${conversation.sequenceNumber}`,
    ].join('\n'), ]);
  });

  await ctx.test('Will validate event mask and create', async () => {
    confirm.mock.mockImplementation(() => Promise.resolve(true));
    const conversation = getTestConversationForAPI();

    const conversationMock = mock.fn(() => Promise.resolve(conversation));

    const sdkMock = {
      conversations: {
        createConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      callbackEventMask: ['foo:bar'],
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(conversationMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{
      displayName: undefined,
      imageUrl: undefined,
      name: undefined,
      numbers: undefined,
      properties: {
        customData: undefined,
        ttl: undefined,
      },
      callback: {
        eventMask: 'foo:bar',
        method: undefined,
        params: {
          applicationId: undefined,
          nccoUrl: undefined,
        },
        url: undefined,
      },
    }])));
    assert.deepStrictEqual(console.warn.mock.calls[0].arguments, ['Invalid event mask: foo:bar']);
    assert.deepStrictEqual(confirm.mock.calls[0].arguments, ['Do you want to continue with this mask?']);
  });

  await ctx.test('Will validate multiple event masks and create', async () => {
    confirm.mock.mockImplementation(() => Promise.resolve(true));
    const conversation = getTestConversationForAPI();

    const conversationMock = mock.fn(() => Promise.resolve(conversation));

    const sdkMock = {
      conversations: {
        createConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      callbackEventMask: [
        ...conversationEvents,
        'aduio:play',
      ],
    });

    assert.deepStrictEqual(console.warn.mock.calls[1 - 1].arguments, ['Invalid event mask: aduio:play', ]);

    assert.deepStrictEqual(console.warn.mock.calls[2 - 1].arguments, ['Did you mean: audio:play?', ]);

    assert.deepStrictEqual(confirm.mock.calls[0].arguments, ['Do you want to continue with these masks?']);

    assert.deepStrictEqual(JSON.parse(JSON.stringify(conversationMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{
      displayName: undefined,
      imageUrl: undefined,
      name: undefined,
      numbers: undefined,
      properties: {
        customData: undefined,
        ttl: undefined,
      },
      callback: {
        eventMask: [
          ...conversationEvents,
          'aduio:play',
        ].join(','),
        method: undefined,
        params: {
          applicationId: undefined,
          nccoUrl: undefined,
        },
        url: undefined,
      },
    }])));
  });

  await ctx.test('Will validate multiple event masks and not create', async () => {
    confirm.mock.mockImplementation(() => Promise.resolve(false));
    const conversation = getTestConversationForAPI();

    const conversationMock = mock.fn(() => Promise.resolve(conversation));

    const sdkMock = {
      conversations: {
        createConversation: conversationMock,
      },
    };

    await handler({
      SDK: sdkMock,
      callbackEventMask: [
        ...conversationEvents,
        'aduio:play',
      ],
    });

    assert.strictEqual(conversationMock.mock.callCount(), 0);
  });
});
