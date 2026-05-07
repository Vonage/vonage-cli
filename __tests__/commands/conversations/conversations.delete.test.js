
const confirm = jest.fn();

const __moduleMocks = {
  '../../../src/ux/confirm.js': (() => ({
  confirm,
}))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/conversations/delete.js', __moduleMocks);
import { mockConsole } from '../../helpers.js';
import { getTestConversationForAPI } from '../../conversations.js';

describe('Command: vonage conversations delete', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Will delete a conversation', async () => {
    confirm.mockResolvedValueOnce(true);
    const conversation = getTestConversationForAPI();

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const deleteConversationMock = jest.fn();

    const sdkMock = {
      conversations: {
        getConversation: conversationMock,
        deleteConversation: deleteConversationMock,
      },
    };

    await handler({ SDK: sdkMock, id: conversation.id });

    expect(conversationMock).toHaveBeenCalledWith(conversation.id);
    expect(deleteConversationMock).toHaveBeenCalledWith(conversation.id);

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      'Conversation deleted',
    );
  });

  test('Will not delete a conversation when user declines', async () => {
    confirm.mockResolvedValueOnce(false);
    const conversation = getTestConversationForAPI();

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const deleteConversationMock = jest.fn();

    const sdkMock = {
      conversations: {
        getConversation: conversationMock,
        deleteConversation: deleteConversationMock,
      },
    };

    await handler({ SDK: sdkMock, id: conversation.id });

    expect(conversationMock).toHaveBeenCalledWith(conversation.id);
    expect(deleteConversationMock).not.toHaveBeenCalled();

    expect(console.log).toHaveBeenNthCalledWith(
      1,
      'Conversation not deleted',
    );
  });
});
