process.env.FORCE_COLOR = 0;
import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConsole } from '../../../helpers.js';
import { messageDataSets } from '../../../__dataSets__/apps/messageCapabilities.js';
import { getBasicApplication } from '../../../app.js';
import { runRemoveCapabilityTest, buildApplicationsSdk } from './helpers.js';

const confirmMock = mock.fn();
const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
test('Command: vonage apps capabilities rm messages', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('../../../../src/ux/confirm.js', { namedExports: { confirm: confirmMock } });
  ctx.mock.module('yargs', { defaultExport: yargs });
  const { handler } = await import('../../../../src/commands/apps/capabilities/remove.js');
  ctx.beforeEach(() => {
    mockConsole();
    confirmMock.mock.resetCalls();
    exitMock.mock.resetCalls();
  });

  await ctx.test('Will remove Message', async () => runRemoveCapabilityTest({
    handler,
    testCase: messageDataSets[2],
    exitMock,
    confirmMock,
    confirmed: true,
  }));

  await ctx.test('Will not remove Message when user declines', async () => runRemoveCapabilityTest({
    handler,
    testCase: messageDataSets[2],
    exitMock,
    confirmMock,
    confirmed: false,
  }));

  await ctx.test('Will not call when there are no capabilities', async () => {
    const app = getBasicApplication();
    const { SDK, getApplication, updateApplication } = buildApplicationsSdk(app);

    confirmMock.mock.mockImplementation(() => Promise.resolve(false));

    await handler({
      SDK,
      id: app.id,
      which: 'messages',
    });

    assert.strictEqual(exitMock.mock.callCount(), 0);
    assert.deepStrictEqual(getApplication.mock.calls[0].arguments, [app.id]);
    assert.strictEqual(updateApplication.mock.callCount(), 0);
  });
});
