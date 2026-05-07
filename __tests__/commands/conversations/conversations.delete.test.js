const confirm = mock.fn();

const __moduleMocks = {
  '../../../src/ux/confirm.js': (() => ({
    confirm,
  }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/conversations/delete.js', __moduleMocks);
import { suite, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConsole } from '../../helpers.js';
import { getTestConversationForAPI } from '../../conversations.js';

suite('Command: vonage conversations delete', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    confirm.mock.resetCalls();
  });

  test('Will delete a conversation', async () => {
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

    assertCalledWith(conversationMock, conversation.id);
    assertCalledWith(deleteConversationMock, conversation.id);

    assertNthCalledWith(console.log, 2, 'Conversation deleted');
  });

  test('Will not delete a conversation when user declines', async () => {
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

    assertCalledWith(conversationMock, conversation.id);
    assert.strictEqual(deleteConversationMock.mock.callCount(), 0);

    assertNthCalledWith(console.log, 1, 'Conversation not deleted');
  });
});
