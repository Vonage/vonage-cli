process.env.FORCE_COLOR = 0;
const { confirm } = require('../../../src/ux/confirm');
const yargs = require('yargs');
const { handler } = require('../../../src/commands/conversations/delete');
const { mockConsole } = require('../../helpers');
const { getTestConversationForAPI } = require('../../conversations');

jest.mock('yargs');
jest.mock('../../../src/ux/confirm');

describe('Command: vonage conversations delete', () => {
  beforeEach(() => {
    mockConsole();
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

  test('Will handle an error', async () => {
    confirm.mockResolvedValueOnce(true);
    const conversation = getTestConversationForAPI();

    const conversationMock = jest.fn()
      .mockResolvedValueOnce(conversation);

    const deleteConversationMock = jest.fn()
      .mockRejectedValueOnce(new Error('An error occurred'));

    const sdkMock = {
      conversations: {
        getConversation: conversationMock,
        deleteConversation: deleteConversationMock,
      },
    };

    await handler({ SDK: sdkMock, id: conversation.id });
    expect(console.log).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(99);
  });
});
