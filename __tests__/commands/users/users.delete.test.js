process.env.FORCE_COLOR = 0;
const { confirm } = require('../../../src/ux/confirm');
const yargs = require('yargs');
const { handler } = require('../../../src/commands/users/delete');
const { mockConsole } = require('../../helpers');
const { getTestUserForAPI } = require('../../users');

jest.mock('yargs');
jest.mock('../../../src/ux/confirm');

describe('Command: vonage users delete', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will delete a user', async () => {
    confirm.mockResolvedValueOnce(true);
    const user = getTestUserForAPI();

    const userMock = jest.fn()
      .mockResolvedValueOnce(user);

    const deleteUserMock = jest.fn();

    const sdkMock = {
      users: {
        getUser: userMock,
        deleteUser: deleteUserMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    expect(userMock).toHaveBeenCalledWith(user.id);
    expect(deleteUserMock).toHaveBeenCalledWith(user.id);

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      'User deleted',
    );
  });

  test('Will not delete a user when user declines', async () => {
    confirm.mockResolvedValueOnce(false);
    const user = getTestUserForAPI();

    const userMock = jest.fn()
      .mockResolvedValueOnce(user);

    const deleteUserMock = jest.fn();

    const sdkMock = {
      users: {
        getUser: userMock,
        deleteUser: deleteUserMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    expect(userMock).toHaveBeenCalledWith(user.id);
    expect(deleteUserMock).not.toHaveBeenCalled();

    expect(console.log).toHaveBeenNthCalledWith(
      1,
      'User not deleted',
    );
  });

  test('Will handle an error', async () => {
    confirm.mockResolvedValueOnce(true);
    const user = getTestUserForAPI();

    const userMock = jest.fn()
      .mockResolvedValueOnce(user);

    const deleteUserMock = jest.fn()
      .mockRejectedValueOnce(new Error('An error occurred'));

    const sdkMock = {
      users: {
        getUser: userMock,
        deleteUser: deleteUserMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });
    expect(console.log).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(99);
  });
});
