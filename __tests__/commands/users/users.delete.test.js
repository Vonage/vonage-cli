
const confirm = jest.fn();

const __moduleMocks = {
  '../../../src/ux/confirm.js': (() => ({
    confirm,
  }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/users/delete.js', __moduleMocks);
import { mockConsole } from '../../helpers.js';
import { getTestUserForAPI } from '../../users.js';

describe('Command: vonage users delete', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    jest.resetAllMocks();
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
});
