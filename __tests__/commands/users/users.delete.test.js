
const confirm = mock.fn();

const __moduleMocks = {
  '../../../src/ux/confirm.js': (() => ({
    confirm,
  }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/users/delete.js', __moduleMocks);
import { suite, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConsole } from '../../helpers.js';
import { getTestUserForAPI } from '../../users.js';

suite('Command: vonage users delete', { concurrency: 1 }, () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    confirm.mock.resetCalls();
  });

  test('Will delete a user', async () => {
    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));
    const user = getTestUserForAPI();

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve(user));

    const deleteUserMock = mock.fn();

    const sdkMock = {
      users: {
        getUser: userMock,
        deleteUser: deleteUserMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    assertCalledWith(userMock, user.id);
    assertCalledWith(deleteUserMock, user.id);

    assertNthCalledWith(
      console.log,
      2,
      'User deleted',
    );
  });

  test('Will not delete a user when user declines', async () => {
    confirm.mock.mockImplementationOnce(() => Promise.resolve(false));
    const user = getTestUserForAPI();

    const userMock = mock.fn();
    userMock.mock.mockImplementationOnce(() => Promise.resolve(user));

    const deleteUserMock = mock.fn();

    const sdkMock = {
      users: {
        getUser: userMock,
        deleteUser: deleteUserMock,
      },
    };

    await handler({ SDK: sdkMock, id: user.id });

    assertCalledWith(userMock, user.id);
    assert.strictEqual(deleteUserMock.mock.callCount(), 0);

    assertNthCalledWith(
      console.log,
      1,
      'User not deleted',
    );
  });
});
