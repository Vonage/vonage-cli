process.env.FORCE_COLOR = 0;
import { suite, mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConsole } from '../../../helpers.js';
import { dataSets } from '../../../__dataSets__/apps/index.js';
import { getBasicApplication } from '../../../app.js';

const confirmMock = mock.fn();
const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
const __moduleMocks = {
  '../../../../src/ux/confirm.js': (() => ({ confirm: confirmMock }))(),
  'yargs': (() => ({ default: yargs }))(),
};





const { handler } = await loadModule(import.meta.url, '../../../../src/commands/apps/capabilities/remove.js', __moduleMocks);

for (const { label, testCases } of dataSets) {
  suite(`Command: vonage apps capabilities rm ${label}`, { concurrency: 1 }, () => {
    beforeEach(() => {
      mockConsole();
      confirmMock.mock.resetCalls();
      exitMock.mock.resetCalls();
    });

    const removeTestCases = testCases.filter(({ args }) => args.action === 'rm');

    for (const { label: caseLabel, app, args, expected } of removeTestCases) {
      test(`Will ${caseLabel}`, async () => {
        const getAppMock = mock.fn(() => Promise.resolve({ ...app }));
        const updateAppMock = mock.fn(() => Promise.resolve());
        const sdkMock = {
          applications: {
            getApplication: getAppMock,
            updateApplication: updateAppMock,
          },
        };

        confirmMock.mock.mockImplementation(() => Promise.resolve(true));

        await handler({
          SDK: sdkMock,
          id: app.id,
          ...args,
        });

        assert.strictEqual(exitMock.mock.callCount(), 0);
        assertCalledWith(getAppMock, app.id);
        assertCalledWith(updateAppMock, expected);
      });

      test(`Will not ${caseLabel} when user declines`, async () => {
        const getAppMock = mock.fn(() => Promise.resolve({ ...app }));
        const updateAppMock = mock.fn(() => Promise.resolve());
        const sdkMock = {
          applications: {
            getApplication: getAppMock,
            updateApplication: updateAppMock,
          },
        };

        confirmMock.mock.mockImplementation(() => Promise.resolve(false));

        await handler({
          SDK: sdkMock,
          id: app.id,
          ...args,
        });

        assert.strictEqual(exitMock.mock.callCount(), 0);
        assertCalledWith(getAppMock, app.id);
        assert.strictEqual(updateAppMock.mock.callCount(), 0);
      });
    }

    test('Will not call when there are no capabilities', async () => {
      const app = getBasicApplication();
      const getAppMock = mock.fn(() => Promise.resolve(app));
      const updateAppMock = mock.fn(() => Promise.resolve());
      const sdkMock = {
        applications: {
          getApplication: getAppMock,
          updateApplication: updateAppMock,
        },
      };

      confirmMock.mock.mockImplementation(() => Promise.resolve(false));

      assert.strictEqual(exitMock.mock.callCount(), 0);
      await handler({
        SDK: sdkMock,
        id: app.id,
        which: label,
      });

      assertCalledWith(getAppMock, app.id);
      assert.strictEqual(updateAppMock.mock.callCount(), 0);
    });
  });
}
