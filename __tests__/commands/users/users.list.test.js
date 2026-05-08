
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




const { handler } = await loadModule(import.meta.url, '../../../src/commands/users/list.js', __moduleMocks);
import { mockConsole } from '../../helpers.js';
import { getTestUserForAPI } from '../../users.js';

describe('Command: vonage users list', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    confirm.mock.resetCalls();
  });

  test('Will list all users', async () => {
    confirm.mock.mockImplementation(() => Promise.resolve(true));

    const users = Array.from(
      { length: 30 },
      getTestUserForAPI,
    );

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve({
      embedded: {
        users: users.slice(0, 10),
      },
      links: {
        next: {
          href: 'https://api.nexmo.com/users?cursor=1',
        },
      },
    }));
    userMock.mock.mockImplementationOnce(() => Promise.resolve({
      embedded: {
        users: users.slice(10, 10),
      },
      links: {
        next: {
          href: 'https://api.nexmo.com/users?cursor=2',
        },
      },
    }));
    userMock.mock.mockImplementationOnce(() => Promise.resolve({
      embedded: {
        users: users.slice(20),
      },
    }));

    const sdkMock = {
      users: {
        getUserPage: userMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });

    assert.strictEqual(confirm.mock.callCount(), 2);
    assertNthCalledWith(
      confirm,
      1,
      'There are more users. Do you want to continue?',
    );
    assertNthCalledWith(
      confirm,
      2,
      'There are more users. Do you want to continue?',
    );

    assert.strictEqual(userMock.mock.callCount(), 3);
    assertNthCalledWith(
      userMock,
      1,
      {
        pageSize: 10,
        cursor: undefined,
      },
    );
    assertNthCalledWith(
      userMock,
      2,
      {
        pageSize: 10,
        cursor: '1',
      },
    );
    assertNthCalledWith(
      userMock,
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
      users.slice(0, 10).map((user) => ({
        'Name': user.name,
        'User ID': user.id,
        'Display Name': user.displayName,
      })),
    );

    assertNthCalledWith(
      console.table,
      2,
      users.slice(10, 10).map((user) => ({
        'Name': user.name,
        'User ID': user.id,
        'Display Name': user.displayName,
      })),
    );

    assertNthCalledWith(
      console.table,
      3,
      users.slice(20).map((user) => ({
        'Name': user.name,
        'User ID': user.id,
        'Display Name': user.displayName,
      })),
    );
  });

  test('Will stop paging when user declines', async () => {
    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));
    confirm.mock.mockImplementationOnce(() => Promise.resolve(false));

    const users = Array.from(
      { length: 30 },
      getTestUserForAPI,
    );

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve({
      embedded: {
        users: users.slice(0, 10),
      },
      links: {
        next: {
          href: 'https://api.nexmo.com/users?cursor=1',
        },
      },
    }));
    userMock.mock.mockImplementationOnce(() => Promise.resolve({
      embedded: {
        users: users.slice(10, 10),
      },
      links: {
        next: {
          href: 'https://api.nexmo.com/users?cursor=2',
        },
      },
    }));

    const sdkMock = {
      users: {
        getUserPage: userMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });

    assert.strictEqual(confirm.mock.callCount(), 2);
    assert.strictEqual(userMock.mock.callCount(), 2);
    assertNthCalledWith(
      userMock,
      1,
      {
        pageSize: 10,
        cursor: undefined,
      },
    );
    assertNthCalledWith(
      userMock,
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
      users.slice(0, 10).map((user) => ({
        'Name': user.name,
        'User ID': user.id,
        'Display Name': user.displayName,
      })),
    );

    assertNthCalledWith(
      console.table,
      2,
      users.slice(10, 10).map((user) => ({
        'Name': user.name,
        'User ID': user.id,
        'Display Name': user.displayName,
      })),
    );
  });
});
