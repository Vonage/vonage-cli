import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConsole } from '../../helpers.js';
import { getTestConversationForAPI } from '../../conversations.js';

test('Command: vonage conversations delete', { concurrency: 1 }, async (ctx) => {
  const confirm = mock.fn();

  ctx.mock.module('../../../src/ux/confirm.js', { namedExports: { confirm } });

  const { handler } = await import('../../../src/commands/conversations/delete.js');

  ctx.beforeEach(() => {
    mockConsole();
  });

  ctx.afterEach(() => {
    confirm.mock.resetCalls();
  });

  await ctx.test('Will delete a conversation', async () => {
    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));
    const conversation = getTestConversationForAPI();

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve(conversation));

    const deleteConversationMock = mock.fn();

    const sdkMock = {
      conversations: {
        getConversation: conversationMock,
        deleteConversation: deleteConversationMock,
      },
    };

    await handler({ SDK: sdkMock, id: conversation.id });

    assert.deepStrictEqual(conversationMock.mock.calls[0].arguments, [conversation.id]);
    assert.deepStrictEqual(deleteConversationMock.mock.calls[0].arguments, [conversation.id]);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['Conversation deleted']);
  });

  await ctx.test('Will not delete a conversation when user declines', async () => {
    confirm.mock.mockImplementationOnce(() => Promise.resolve(false));
    const conversation = getTestConversationForAPI();

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve(conversation));

    const deleteConversationMock = mock.fn();

    const sdkMock = {
      conversations: {
        getConversation: conversationMock,
        deleteConversation: deleteConversationMock,
      },
    };

    await handler({ SDK: sdkMock, id: conversation.id });

    assert.deepStrictEqual(conversationMock.mock.calls[0].arguments, [conversation.id]);
    assert.strictEqual(deleteConversationMock.mock.callCount(), 0);

    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, ['Conversation not deleted']);
  });
});
