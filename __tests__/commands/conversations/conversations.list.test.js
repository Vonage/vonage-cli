process.env.FORCE_COLOR = 0;
const { confirm } = require('../../../src/ux/confirm');
const yargs = require('yargs');
const { handler } = require('../../../src/commands/conversations/list');
const { mockConsole } = require('../../helpers');
const { getTestConversationForAPI } = require('../../conversations');

jest.mock('yargs');
jest.mock('../../../src/ux/confirm');

describe('Command: vonage conversations list', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will list all conversations', async () => {
    confirm.mockResolvedValue(true);

    const conversations = Array.from(
      { length: 30 },
      getTestConversationForAPI,
    );

    const conversationMock = jest.fn()
      .mockResolvedValueOnce({
        conversations: conversations.slice(0, 10),
        links: {
          next: {
            href: 'https://api.nexmo.com/conversations?cursor=1',
          },
        },
      })
      .mockResolvedValueOnce({
        conversations: conversations.slice(10, 10),
        links: {
          next: {
            href: 'https://api.nexmo.com/conversations?cursor=2',
          },
        },
      })
      .mockResolvedValueOnce({
        conversations: conversations.slice(20),
      });

    const sdkMock = {
      conversations: {
        getConversationPage: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });

    expect(confirm).toHaveBeenCalledTimes(2);
    expect(confirm).toHaveBeenNthCalledWith(
      1,
      'There are more conversations. Do you want to continue?',
    );
    expect(confirm).toHaveBeenNthCalledWith(
      2,
      'There are more conversations. Do you want to continue?',
    );

    expect(conversationMock).toHaveBeenCalledTimes(3);
    expect(conversationMock).toHaveBeenNthCalledWith(
      1,
      {
        pageSize: 10,
        cursor: undefined,
      },
    );
    expect(conversationMock).toHaveBeenNthCalledWith(
      2,
      {
        pageSize: 10,
        cursor: '1',
      },
    );
    expect(conversationMock).toHaveBeenNthCalledWith(
      3,
      {
        pageSize: 10,
        cursor: '2',
      },
    );

    expect(console.table).toHaveBeenCalledTimes(3);
    expect(console.table).toHaveBeenNthCalledWith(
      1,
      conversations.slice(0, 10).map((conversation) => ({
        'Name': conversation.name,
        'Conversation ID': conversation.id,
        'Display Name': conversation.displayName,
        'Image URL': conversation.imageUrl,
      })),
    );

    expect(console.table).toHaveBeenNthCalledWith(
      2,
      conversations.slice(10, 10).map((conversation) => ({
        'Name': conversation.name,
        'Conversation ID': conversation.id,
        'Display Name': conversation.displayName,
        'Image URL': conversation.imageUrl,
      })),
    );

    expect(console.table).toHaveBeenNthCalledWith(
      3,
      conversations.slice(20).map((conversation) => ({
        'Name': conversation.name,
        'Conversation ID': conversation.id,
        'Display Name': conversation.displayName,
        'Image URL': conversation.imageUrl,
      })),
    );
  });

  test('Will stop paging when user declines', async () => {
    confirm.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

    const conversations = Array.from(
      { length: 30 },
      getTestConversationForAPI,
    );

    const conversationMock = jest.fn()
      .mockResolvedValueOnce({
        conversations: conversations.slice(0, 10),
        links: {
          next: {
            href: 'https://api.nexmo.com/conversations?cursor=1',
          },
        },
      })
      .mockResolvedValueOnce({
        conversations: conversations.slice(10, 10),
        links: {
          next: {
            href: 'https://api.nexmo.com/conversations?cursor=2',
          },
        },
      });

    const sdkMock = {
      conversations: {
        getConversationPage: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });

    expect(confirm).toHaveBeenCalledTimes(2);
    expect(conversationMock).toHaveBeenCalledTimes(2);
    expect(conversationMock).toHaveBeenNthCalledWith(
      1,
      {
        pageSize: 10,
        cursor: undefined,
      },
    );
    expect(conversationMock).toHaveBeenNthCalledWith(
      2,
      {
        pageSize: 10,
        cursor: '1',
      },
    );

    expect(console.table).toHaveBeenCalledTimes(2);
    expect(console.table).toHaveBeenNthCalledWith(
      1,
      conversations.slice(0, 10).map((conversation) => ({
        'Name': conversation.name,
        'Conversation ID': conversation.id,
        'Display Name': conversation.displayName,
        'Image URL': conversation.imageUrl,
      })),
    );

    expect(console.table).toHaveBeenNthCalledWith(
      2,
      conversations.slice(10, 10).map((conversation) => ({
        'Name': conversation.name,
        'Conversation ID': conversation.id,
        'Display Name': conversation.displayName,
        'Image URL': conversation.imageUrl,
      })),
    );
  });

  test('Will handle SDK Error', async () => {
    const conversationMock = jest.fn()
      .mockRejectedValue(new Error('SDK Error'));

    const sdkMock = {
      conversations: {
        getConversationPage: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });
    expect(conversationMock).toHaveBeenCalledTimes(1);
    expect(yargs.exit).toHaveBeenCalledWith(99);
  });
});
