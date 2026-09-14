import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConsole } from '../../helpers.js';
import { getTestUserForAPI } from '../../users.js';

test('Command: vonage users list', { concurrency: 1 }, async (ctx) => {
  const exitMock = mock.fn();
  const yargs = mock.fn(() => ({ exit: exitMock }));
  const sortKeys = (value) => Array.isArray(value)
    ? value.map(sortKeys)
    : value && typeof value === 'object'
      ? Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, item]) => [key, sortKeys(item)]))
      : value;
  const renderTable = (rows) => `TABLE:${JSON.stringify(sortKeys(rows))}`;
  const tableMock = mock.fn(async (rows) => renderTable(rows));

  const confirm = mock.fn();

  ctx.mock.module('yargs', { defaultExport: yargs });
  ctx.mock.module('../../../src/ux/confirm.js', { namedExports: { confirm } });
  ctx.mock.module('../../../src/ux/table.js', { namedExports: { table: tableMock } });

  const { handler } = await import('../../../src/commands/users/list.js');

  ctx.beforeEach(() => {
    tableMock.mock.resetCalls();
    mockConsole();
  });

  ctx.afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    confirm.mock.resetCalls();
  });

  await ctx.test('Will list all users', async () => {
    confirm.mock.mockImplementation(() => Promise.resolve(true));

    const users = Array.from(
      { length: 30 },
      getTestUserForAPI,
    );

    const userResponses = [
      {
        embedded: {
          users: users.slice(0, 10),
        },
        links: {
          next: {
            href: 'https://api.nexmo.com/users?cursor=1',
          },
        },
      },
      {
        embedded: {
          users: users.slice(10, 20),
        },
        links: {
          next: {
            href: 'https://api.nexmo.com/users?cursor=2',
          },
        },
      },
      {
        embedded: {
          users: users.slice(20),
        },
      },
    ];
    const userMock = mock.fn();
    userMock.mock.mockImplementation(() => Promise.resolve(userResponses.shift()));

    const sdkMock = {
      users: {
        getUserPage: userMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });

    assert.strictEqual(confirm.mock.callCount(), 2);
    assert.deepStrictEqual(confirm.mock.calls[1 - 1].arguments, ['There are more users. Do you want to continue?',]);
    assert.deepStrictEqual(confirm.mock.calls[2 - 1].arguments, ['There are more users. Do you want to continue?',]);

    assert.strictEqual(userMock.mock.callCount(), 3);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(userMock.mock.calls[1 - 1].arguments)), JSON.parse(JSON.stringify([{
      pageSize: 10,
      cursor: undefined,
    },])));
    assert.deepStrictEqual(JSON.parse(JSON.stringify(userMock.mock.calls[2 - 1].arguments)), JSON.parse(JSON.stringify([{
      pageSize: 10,
      cursor: '1',
    },])));
    assert.deepStrictEqual(JSON.parse(JSON.stringify(userMock.mock.calls[3 - 1].arguments)), JSON.parse(JSON.stringify([{
      pageSize: 10,
      cursor: '2',
    },])));

    assert.strictEqual(tableMock.mock.callCount(), 3);
    assert.deepStrictEqual(tableMock.mock.calls[1 - 1].arguments, [users.slice(0, 10).map((user) => ({
      'Name': user.name,
      'User ID': user.id,
      'Display Name': user.displayName,
    })),]);

    assert.deepStrictEqual(tableMock.mock.calls[2 - 1].arguments, [users.slice(10, 20).map((user) => ({
      'Name': user.name,
      'User ID': user.id,
      'Display Name': user.displayName,
    })),]);

    assert.deepStrictEqual(tableMock.mock.calls[3 - 1].arguments, [users.slice(20).map((user) => ({
      'Name': user.name,
      'User ID': user.id,
      'Display Name': user.displayName,
    })),]);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [renderTable(users.slice(0, 10).map((user) => ({
      'Name': user.name,
      'User ID': user.id,
      'Display Name': user.displayName,
    })))]);
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(users.slice(10, 20).map((user) => ({
      'Name': user.name,
      'User ID': user.id,
      'Display Name': user.displayName,
    })))]);
    assert.deepStrictEqual(console.log.mock.calls[6 - 1].arguments, [renderTable(users.slice(20).map((user) => ({
      'Name': user.name,
      'User ID': user.id,
      'Display Name': user.displayName,
    })))]);
  });

  await ctx.test('Will stop paging when user declines', async () => {
    const confirmValues = [true, false];
    confirm.mock.mockImplementation(() => Promise.resolve(confirmValues.shift()));

    const users = Array.from(
      { length: 30 },
      getTestUserForAPI,
    );

    const userResponses = [
      {
        embedded: {
          users: users.slice(0, 10),
        },
        links: {
          next: {
            href: 'https://api.nexmo.com/users?cursor=1',
          },
        },
      },
      {
        embedded: {
          users: users.slice(10, 20),
        },
        links: {
          next: {
            href: 'https://api.nexmo.com/users?cursor=2',
          },
        },
      },
    ];
    const userMock = mock.fn();
    userMock.mock.mockImplementation(() => Promise.resolve(userResponses.shift()));

    const sdkMock = {
      users: {
        getUserPage: userMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });

    assert.strictEqual(confirm.mock.callCount(), 2);
    assert.strictEqual(userMock.mock.callCount(), 2);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(userMock.mock.calls[1 - 1].arguments)), JSON.parse(JSON.stringify([{
      pageSize: 10,
      cursor: undefined,
    },])));
    assert.deepStrictEqual(JSON.parse(JSON.stringify(userMock.mock.calls[2 - 1].arguments)), JSON.parse(JSON.stringify([{
      pageSize: 10,
      cursor: '1',
    },])));

    assert.strictEqual(tableMock.mock.callCount(), 2);
    assert.deepStrictEqual(tableMock.mock.calls[1 - 1].arguments, [users.slice(0, 10).map((user) => ({
      'Name': user.name,
      'User ID': user.id,
      'Display Name': user.displayName,
    })),]);

    assert.deepStrictEqual(tableMock.mock.calls[2 - 1].arguments, [users.slice(10, 20).map((user) => ({
      'Name': user.name,
      'User ID': user.id,
      'Display Name': user.displayName,
    })),]);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [renderTable(users.slice(0, 10).map((user) => ({
      'Name': user.name,
      'User ID': user.id,
      'Display Name': user.displayName,
    })))]);
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(users.slice(10, 20).map((user) => ({
      'Name': user.name,
      'User ID': user.id,
      'Display Name': user.displayName,
    })))]);
  });

  await ctx.test('Will list an empty filtered page without prompting', async () => {
    const userMock = mock.fn(() => Promise.resolve({}));

    const sdkMock = {
      users: {
        getUserPage: userMock,
      },
    };

    await handler({
      SDK: sdkMock,
      pageSize: 5,
      cursor: 'starting-cursor',
      name: 'Filtered User',
      sort: 'asc',
    });

    assert.strictEqual(confirm.mock.callCount(), 0);
    assert.strictEqual(userMock.mock.callCount(), 1);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(userMock.mock.calls[1 - 1].arguments)), JSON.parse(JSON.stringify([{
      pageSize: 5,
      cursor: 'starting-cursor',
      name: 'Filtered User',
      sort: 'asc',
    },])));
    assert.strictEqual(tableMock.mock.callCount(), 0);
    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['No users found']);
  });
});
