process.env.FORCE_COLOR = 0;
const { confirm } = require('../../../src/ux/confirm');
const { handler } = require('../../../src/commands/users/list');
const { mockConsole } = require('../../helpers');
const { getTestUserForAPI } = require('../../users');

jest.mock('yargs');
jest.mock('../../../src/ux/confirm');

describe('Command: vonage users list', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will list all users', async () => {
    confirm.mockResolvedValue(true);

    const users = Array.from(
      { length: 30 },
      getTestUserForAPI,
    );

    const userMock = jest.fn()
      .mockResolvedValueOnce({
        embedded: {
          users: users.slice(0, 10),
        },
        links: {
          next: {
            href: 'https://api.nexmo.com/users?cursor=1',
          },
        },
      })
      .mockResolvedValueOnce({
        embedded: {
          users: users.slice(10, 10),
        },
        links: {
          next: {
            href: 'https://api.nexmo.com/users?cursor=2',
          },
        },
      })
      .mockResolvedValueOnce({
        embedded: {
          users: users.slice(20),
        },
      });

    const sdkMock = {
      users: {
        getUserPage: userMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });

    expect(confirm).toHaveBeenCalledTimes(2);
    expect(confirm).toHaveBeenNthCalledWith(
      1,
      'There are more users. Do you want to continue?',
    );
    expect(confirm).toHaveBeenNthCalledWith(
      2,
      'There are more users. Do you want to continue?',
    );

    expect(userMock).toHaveBeenCalledTimes(3);
    expect(userMock).toHaveBeenNthCalledWith(
      1,
      {
        pageSize: 10,
        cursor: undefined,
      },
    );
    expect(userMock).toHaveBeenNthCalledWith(
      2,
      {
        pageSize: 10,
        cursor: '1',
      },
    );
    expect(userMock).toHaveBeenNthCalledWith(
      3,
      {
        pageSize: 10,
        cursor: '2',
      },
    );

    expect(console.table).toHaveBeenCalledTimes(3);
    expect(console.table).toHaveBeenNthCalledWith(
      1,
      users.slice(0, 10).map((user) => ({
        'Name': user.name,
        'User ID': user.id,
        'Display Name': user.displayName,
      })),
    );

    expect(console.table).toHaveBeenNthCalledWith(
      2,
      users.slice(10, 10).map((user) => ({
        'Name': user.name,
        'User ID': user.id,
        'Display Name': user.displayName,
      })),
    );

    expect(console.table).toHaveBeenNthCalledWith(
      3,
      users.slice(20).map((user) => ({
        'Name': user.name,
        'User ID': user.id,
        'Display Name': user.displayName,
      })),
    );
  });

  test('Will stop paging when user declines', async () => {
    confirm.mockResolvedValueOnce(true).mockResolvedValueOnce(false);

    const users = Array.from(
      { length: 30 },
      getTestUserForAPI,
    );

    const userMock = jest.fn()
      .mockResolvedValueOnce({
        embedded: {
          users: users.slice(0, 10),
        },
        links: {
          next: {
            href: 'https://api.nexmo.com/users?cursor=1',
          },
        },
      })
      .mockResolvedValueOnce({
        embedded: {
          users: users.slice(10, 10),
        },
        links: {
          next: {
            href: 'https://api.nexmo.com/users?cursor=2',
          },
        },
      });

    const sdkMock = {
      users: {
        getUserPage: userMock,
      },
    };

    await handler({ SDK: sdkMock, pageSize: 10 });

    expect(confirm).toHaveBeenCalledTimes(2);
    expect(userMock).toHaveBeenCalledTimes(2);
    expect(userMock).toHaveBeenNthCalledWith(
      1,
      {
        pageSize: 10,
        cursor: undefined,
      },
    );
    expect(userMock).toHaveBeenNthCalledWith(
      2,
      {
        pageSize: 10,
        cursor: '1',
      },
    );

    expect(console.table).toHaveBeenCalledTimes(2);
    expect(console.table).toHaveBeenNthCalledWith(
      1,
      users.slice(0, 10).map((user) => ({
        'Name': user.name,
        'User ID': user.id,
        'Display Name': user.displayName,
      })),
    );

    expect(console.table).toHaveBeenNthCalledWith(
      2,
      users.slice(10, 10).map((user) => ({
        'Name': user.name,
        'User ID': user.id,
        'Display Name': user.displayName,
      })),
    );
  });
});
