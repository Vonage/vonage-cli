
import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConsole } from '../../helpers.js';
import { getTestUserForAPI } from '../../users.js';

test('Command: vonage users delete', { concurrency: 1 }, async (ctx) => {
  const confirm = mock.fn();

  ctx.mock.module('../../../src/ux/confirm.js', { namedExports: { confirm } });

  const { handler } = await import('../../../src/commands/users/delete.js');

  ctx.beforeEach(() => {
    mockConsole();
  });

  ctx.afterEach(() => {
    confirm.mock.resetCalls();
  });

  await ctx.test('Will delete a user', async () => {
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

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [user.id]);
    assert.deepStrictEqual(deleteUserMock.mock.calls[0].arguments, [user.id]);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['User deleted', ]);
  });

  await ctx.test('Will not delete a user when user declines', async () => {
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

    assert.deepStrictEqual(userMock.mock.calls[0].arguments, [user.id]);
    assert.strictEqual(deleteUserMock.mock.callCount(), 0);

    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, ['User not deleted', ]);
  });
});
