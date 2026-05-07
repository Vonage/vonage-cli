process.env.FORCE_COLOR = 0;
import { suite, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConsole } from '../../../helpers.js';
import { networkDataSets } from '../../../__dataSets__/apps/networkCapabilities.js';
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

suite('Command: vonage apps capabilities rm network_apis', () => {
  beforeEach(() => {
    mockConsole();
    confirmMock.mock.resetCalls();
    exitMock.mock.resetCalls();
  });

  test('Will remove network api', async () => runRemoveCapabilityTest({
    handler,
    testCase: networkDataSets[2],
    exitMock,
    confirmMock,
    confirmed: true,
  }));

  test('Will not remove network api when user declines', async () => runRemoveCapabilityTest({
    handler,
    testCase: networkDataSets[2],
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
      which: 'network_apis',
    });

    assert.strictEqual(exitMock.mock.callCount(), 0);
    assertCalledWith(getApplication, app.id);
    assert.strictEqual(updateApplication.mock.callCount(), 0);
  });
});
