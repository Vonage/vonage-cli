const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const confirm = mock.fn();



const __moduleMocks = {
  'yargs': (() => ({
    default: yargs,
  }))(),
  '../../../src/ux/confirm.js': (() => ({
    confirm,
  }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/conversations/list.js', __moduleMocks);
import { mockConsole } from '../../helpers.js';
import { getTestConversationForAPI } from '../../conversations.js';

describe('Command: vonage conversations list', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    confirm.mock.resetCalls();
  });

  test('Will list with no conversations', async () => {
    confirm.mock.mockImplementation(() => Promise.resolve(true));

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve({
      conversations: [],
      links: {
        self: {
          href: 'https://api.nexmo.com/conversations',
        },
      },
    }));

    const sdkMock = {
      conversations: {
        getConversationPage: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });

    assert.strictEqual(conversationMock.mock.callCount(), 1);
    assertNthCalledWith(
      conversationMock,
      1,
      {
        pageSize: 10,
        cursor: undefined,
      },
    );

    assertNthCalledWith(console.log, 1, 'No conversations found');
    assert.strictEqual(console.table.mock.callCount(), 0);
  });

  test('Will list all conversations', async () => {
    confirm.mock.mockImplementation(() => Promise.resolve(true));

    const conversations = Array.from(
      { length: 30 },
      getTestConversationForAPI,
    );

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve({
      conversations: conversations.slice(0, 10),
      links: {
        next: {
          href: 'https://api.nexmo.com/conversations?cursor=1',
        },
      },
    }));
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve({
      conversations: conversations.slice(10, 20),
      links: {
        next: {
          href: 'https://api.nexmo.com/conversations?cursor=2',
        },
      },
    }));
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve({
      conversations: conversations.slice(20),
    }));

    const sdkMock = {
      conversations: {
        getConversationPage: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });

    console.log(conversations.length);
    console.log(conversations.slice(0, 10).length);
    console.log(conversations.slice(10, 20).length);
    console.log(conversations.slice(20).length);

    assert.strictEqual(confirm.mock.callCount(), 2);
    assertNthCalledWith(
      confirm,
      1,
      'There are more conversations. Do you want to continue?',
    );
    assertNthCalledWith(
      confirm,
      2,
      'There are more conversations. Do you want to continue?',
    );

    assert.strictEqual(conversationMock.mock.callCount(), 3);
    assertNthCalledWith(
      conversationMock,
      1,
      {
        pageSize: 10,
        cursor: undefined,
      },
    );
    assertNthCalledWith(
      conversationMock,
      2,
      {
        pageSize: 10,
        cursor: '1',
      },
    );
    assertNthCalledWith(
      conversationMock,
      3,
      {
        pageSize: 10,
        cursor: '2',
      },
    );

    assert.strictEqual(console.table.mock.callCount(), 3);
    assertNthCalledWith(
      console.table,
      1,
      conversations.slice(0, 10).map((conversation) => ({
        'Name': conversation.name,
        'Conversation ID': conversation.id,
        'Display Name': conversation.displayName,
        'Image URL': conversation.imageUrl,
      })),
    );

    assertNthCalledWith(
      console.table,
      2,
      conversations.slice(10, 20).map((conversation) => ({
        'Name': conversation.name,
        'Conversation ID': conversation.id,
        'Display Name': conversation.displayName,
        'Image URL': conversation.imageUrl,
      })),
    );

    assertNthCalledWith(
      console.table,
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
    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));
    confirm.mock.mockImplementationOnce(() => Promise.resolve(false));

    const conversations = Array.from(
      { length: 30 },
      getTestConversationForAPI,
    );

    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve({
      conversations: conversations.slice(0, 10),
      links: {
        next: {
          href: 'https://api.nexmo.com/conversations?cursor=1',
        },
      },
    }));
    conversationMock.mock.mockImplementationOnce(() => Promise.resolve({
      conversations: conversations.slice(10, 20),
      links: {
        next: {
          href: 'https://api.nexmo.com/conversations?cursor=2',
        },
      },
    }));

    const sdkMock = {
      conversations: {
        getConversationPage: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });

    assert.strictEqual(confirm.mock.callCount(), 2);
    assert.strictEqual(conversationMock.mock.callCount(), 2);
    assertNthCalledWith(
      conversationMock,
      1,
      {
        pageSize: 10,
        cursor: undefined,
      },
    );
    assertNthCalledWith(
      conversationMock,
      2,
      {
        pageSize: 10,
        cursor: '1',
      },
    );

    assert.strictEqual(console.table.mock.callCount(), 2);
    assertNthCalledWith(
      console.table,
      1,
      conversations.slice(0, 10).map((conversation) => ({
        'Name': conversation.name,
        'Conversation ID': conversation.id,
        'Display Name': conversation.displayName,
        'Image URL': conversation.imageUrl,
      })),
    );

    assertNthCalledWith(
      console.table,
      2,
      conversations.slice(10, 20).map((conversation) => ({
        'Name': conversation.name,
        'Conversation ID': conversation.id,
        'Display Name': conversation.displayName,
        'Image URL': conversation.imageUrl,
      })),
    );
  });

  test('Will handle SDK Error', async () => {
    const conversationMock = mock.fn(() => Promise.reject(new Error('SDK Error')));

    const sdkMock = {
      conversations: {
        getConversationPage: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });
    assert.strictEqual(conversationMock.mock.callCount(), 1);
    assertCalledWith(exitMock, 99);
  });
});
