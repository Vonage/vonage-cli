process.env.FORCE_COLOR = 0;
import { suite, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConsole } from '../../../helpers.js';
import { verifyDataSets } from '../../../__dataSets__/apps/verifyCapabilities.js';
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

suite('Command: vonage apps capabilities rm verify', () => {
  beforeEach(() => {
    mockConsole();
    confirmMock.mock.resetCalls();
    exitMock.mock.resetCalls();
  });

  test('Will remove Verify', async () => runRemoveCapabilityTest({
    handler,
    testCase: verifyDataSets[3],
    exitMock,
    confirmMock,
    confirmed: true,
  }));

  test('Will not remove Verify when user declines', async () => runRemoveCapabilityTest({
    handler,
    testCase: verifyDataSets[3],
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
      which: 'verify',
    });

    assert.strictEqual(exitMock.mock.callCount(), 0);
    assertCalledWith(getApplication, app.id);
    assert.strictEqual(updateApplication.mock.callCount(), 0);
  });
});
