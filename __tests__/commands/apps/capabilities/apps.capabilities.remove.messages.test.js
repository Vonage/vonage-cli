process.env.FORCE_COLOR = 0;
import { suite, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConsole } from '../../../helpers.js';
import { messageDataSets } from '../../../__dataSets__/apps/messageCapabilities.js';
import { getBasicApplication } from '../../../app.js';
import { runRemoveCapabilityTest, buildApplicationsSdk } from './helpers.js';

const confirmMock = mock.fn();
const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
const __moduleMocks = {
  '../../../../src/ux/confirm.js': (() => ({ confirm: confirmMock }))(),
  'yargs': (() => ({ default: yargs }))(),
};

const { handler } = await loadModule(import.meta.url, '../../../../src/commands/apps/capabilities/remove.js', __moduleMocks);

suite('Command: vonage apps capabilities rm messages', () => {
  beforeEach(() => {
    mockConsole();
    confirmMock.mock.resetCalls();
    exitMock.mock.resetCalls();
  });

  test('Will remove Message', async () => runRemoveCapabilityTest({
    handler,
    testCase: messageDataSets[2],
    exitMock,
    confirmMock,
    confirmed: true,
  }));

  test('Will not remove Message when user declines', async () => runRemoveCapabilityTest({
    handler,
    testCase: messageDataSets[2],
    exitMock,
    confirmMock,
    confirmed: false,
  }));

  test('Will not call when there are no capabilities', async () => {
    const app = getBasicApplication();
    const { SDK, getApplication, updateApplication } = buildApplicationsSdk(app);

    confirmMock.mock.mockImplementation(() => Promise.resolve(false));

    await handler({
      SDK,
      id: app.id,
      which: 'messages',
    });

    assert.strictEqual(exitMock.mock.callCount(), 0);
    assertCalledWith(getApplication, app.id);
    assert.strictEqual(updateApplication.mock.callCount(), 0);
  });
});
