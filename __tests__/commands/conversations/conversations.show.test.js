import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { displayDate } from '../../../src/ux/locale.js';

import { mockConsole } from '../../helpers.js';
import { getTestConversationForAPI } from '../../conversations.js';

test('Command: vonage conversations show', { concurrency: 1 }, async (ctx) => {
  const exitMock = mock.fn();
  const yargs = mock.fn(() => ({ exit: exitMock }));

  const confirm = mock.fn();

  ctx.mock.module('yargs', { defaultExport: yargs });
  ctx.mock.module('../../../src/ux/confirm.js', { namedExports: { confirm } });

  const { handler } = await import('../../../src/commands/conversations/show.js');

  ctx.beforeEach(() => {
    mockConsole();
  });

  ctx.afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    confirm.mock.resetCalls();
  });

  await ctx.test('Will show a conversation', async () => {
    const conversation = getTestConversationForAPI();

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve(conversation));

    const sdkMock = {
      conversations: {
        getConversation: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, conversationId: conversation.id });

    assert.deepStrictEqual(conversationMock.mock.calls[0].arguments, [conversation.id]);

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

  await ctx.test('Will handle an error', async () => {
    const conversation = getTestConversationForAPI();

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.reject(new Error('An error occurred')));

    const sdkMock = {
      conversations: {
        getConversation: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, id: conversation.id });
    assert.strictEqual(console.log.mock.callCount(), 0);
    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [99]);
  });
});
