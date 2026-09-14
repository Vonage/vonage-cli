import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConsole } from '../../helpers.js';
import { getTestConversationForAPI } from '../../conversations.js';

test('Command: vonage conversations list', { concurrency: 1 }, async (ctx) => {
  const exitMock = mock.fn();
  const yargs = mock.fn(() => ({ exit: exitMock }));
  const renderTable = (rows) => `TABLE:${JSON.stringify(rows)}`;
  const tableMock = mock.fn(async (rows) => renderTable(rows));

  const confirm = mock.fn();

  ctx.mock.module('yargs', { defaultExport: yargs });
  ctx.mock.module('../../../src/ux/confirm.js', { namedExports: { confirm } });
  ctx.mock.module('../../../src/ux/table.js', { namedExports: { table: tableMock } });

  const { handler } = await import('../../../src/commands/conversations/list.js');

  ctx.beforeEach(() => {
    tableMock.mock.resetCalls();
    mockConsole();
  });

  ctx.afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    confirm.mock.resetCalls();
  });

  await ctx.test('Will list with no conversations', async () => {
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
    assert.deepStrictEqual(conversationMock.mock.calls[1 - 1].arguments, [{
      pageSize: 10,
      cursor: undefined,
    }, ]);

    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, ['No conversations found']);
    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['Done Listing conversations']);
    assert.strictEqual(tableMock.mock.callCount(), 0);
  });

  await ctx.test('Will list all conversations', async () => {
    confirm.mock.mockImplementation(() => Promise.resolve(true));

    const conversations = Array.from(
      { length: 30 },
      getTestConversationForAPI,
    );

    const conversationResponses = [
      {
        conversations: conversations.slice(0, 10),
        links: {
          next: {
            href: 'https://api.nexmo.com/conversations?cursor=1',
          },
        },
      },
      {
        conversations: conversations.slice(10, 20),
        links: {
          next: {
            href: 'https://api.nexmo.com/conversations?cursor=2',
          },
        },
      },
      {
        conversations: conversations.slice(20),
      },
    ];
    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementation(() => Promise.resolve(conversationResponses.shift()));

    const sdkMock = {
      conversations: {
        getConversationPage: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });

    assert.strictEqual(confirm.mock.callCount(), 2);
    assert.deepStrictEqual(confirm.mock.calls[1 - 1].arguments, ['There are more conversations. Do you want to continue?', ]);
    assert.deepStrictEqual(confirm.mock.calls[2 - 1].arguments, ['There are more conversations. Do you want to continue?', ]);

    assert.strictEqual(conversationMock.mock.callCount(), 3);
    assert.deepStrictEqual(conversationMock.mock.calls[1 - 1].arguments, [{
      pageSize: 10,
      cursor: undefined,
    }, ]);
    assert.deepStrictEqual(conversationMock.mock.calls[2 - 1].arguments, [{
      pageSize: 10,
      cursor: '1',
    }, ]);
    assert.deepStrictEqual(conversationMock.mock.calls[3 - 1].arguments, [{
      pageSize: 10,
      cursor: '2',
    }, ]);

    assert.strictEqual(tableMock.mock.callCount(), 3);
    assert.deepStrictEqual(tableMock.mock.calls[1 - 1].arguments, [conversations.slice(0, 10).map((conversation) => ({
      'Name': conversation.name,
      'Conversation ID': conversation.id,
      'Display Name': conversation.displayName,
      'Image URL': conversation.imageUrl,
    })), ]);

    assert.deepStrictEqual(tableMock.mock.calls[2 - 1].arguments, [conversations.slice(10, 20).map((conversation) => ({
      'Name': conversation.name,
      'Conversation ID': conversation.id,
      'Display Name': conversation.displayName,
      'Image URL': conversation.imageUrl,
    })), ]);

    assert.deepStrictEqual(tableMock.mock.calls[3 - 1].arguments, [conversations.slice(20).map((conversation) => ({
      'Name': conversation.name,
      'Conversation ID': conversation.id,
      'Display Name': conversation.displayName,
      'Image URL': conversation.imageUrl,
    })), ]);
    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [renderTable(conversations.slice(0, 10).map((conversation) => ({
      'Name': conversation.name,
      'Conversation ID': conversation.id,
      'Display Name': conversation.displayName,
      'Image URL': conversation.imageUrl,
    })))]);
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(conversations.slice(10, 20).map((conversation) => ({
      'Name': conversation.name,
      'Conversation ID': conversation.id,
      'Display Name': conversation.displayName,
      'Image URL': conversation.imageUrl,
    })))]);
    assert.deepStrictEqual(console.log.mock.calls[6 - 1].arguments, [renderTable(conversations.slice(20).map((conversation) => ({
      'Name': conversation.name,
      'Conversation ID': conversation.id,
      'Display Name': conversation.displayName,
      'Image URL': conversation.imageUrl,
    })))]);
    assert.deepStrictEqual(console.log.mock.calls[7 - 1].arguments, ['Done Listing conversations']);
  });

  await ctx.test('Will stop paging when user declines', async () => {
    const confirmValues = [true, false];
    confirm.mock.mockImplementation(() => Promise.resolve(confirmValues.shift()));

    const conversations = Array.from(
      { length: 30 },
      getTestConversationForAPI,
    );

    const conversationResponses = [
      {
        conversations: conversations.slice(0, 10),
        links: {
          next: {
            href: 'https://api.nexmo.com/conversations?cursor=1',
          },
        },
      },
      {
        conversations: conversations.slice(10, 20),
        links: {
          next: {
            href: 'https://api.nexmo.com/conversations?cursor=2',
          },
        },
      },
    ];
    const conversationMock = mock.fn();
    conversationMock.mock.mockImplementation(() => Promise.resolve(conversationResponses.shift()));

    const sdkMock = {
      conversations: {
        getConversationPage: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });

    assert.strictEqual(confirm.mock.callCount(), 2);
    assert.strictEqual(conversationMock.mock.callCount(), 2);
    assert.deepStrictEqual(conversationMock.mock.calls[1 - 1].arguments, [{
      pageSize: 10,
      cursor: undefined,
    }, ]);
    assert.deepStrictEqual(conversationMock.mock.calls[2 - 1].arguments, [{
      pageSize: 10,
      cursor: '1',
    }, ]);

    assert.strictEqual(tableMock.mock.callCount(), 2);
    assert.deepStrictEqual(tableMock.mock.calls[1 - 1].arguments, [conversations.slice(0, 10).map((conversation) => ({
      'Name': conversation.name,
      'Conversation ID': conversation.id,
      'Display Name': conversation.displayName,
      'Image URL': conversation.imageUrl,
    })), ]);

    assert.deepStrictEqual(tableMock.mock.calls[2 - 1].arguments, [conversations.slice(10, 20).map((conversation) => ({
      'Name': conversation.name,
      'Conversation ID': conversation.id,
      'Display Name': conversation.displayName,
      'Image URL': conversation.imageUrl,
    })), ]);
    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [renderTable(conversations.slice(0, 10).map((conversation) => ({
      'Name': conversation.name,
      'Conversation ID': conversation.id,
      'Display Name': conversation.displayName,
      'Image URL': conversation.imageUrl,
    })))]);
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(conversations.slice(10, 20).map((conversation) => ({
      'Name': conversation.name,
      'Conversation ID': conversation.id,
      'Display Name': conversation.displayName,
      'Image URL': conversation.imageUrl,
    })))]);
    assert.deepStrictEqual(console.log.mock.calls[5 - 1].arguments, ['Done Listing conversations']);
  });

  await ctx.test('Will handle SDK Error', async () => {
    const conversationMock = mock.fn(() => Promise.reject(new Error('SDK Error')));

    const sdkMock = {
      conversations: {
        getConversationPage: conversationMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });
    assert.strictEqual(conversationMock.mock.callCount(), 1);
    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [99]);
  });
});
