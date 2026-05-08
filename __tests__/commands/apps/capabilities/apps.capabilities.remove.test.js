process.env.FORCE_COLOR = 0;
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

describe.each(dataSets)('Command: vonage apps capabilities rm $label', ({ label, testCases }) => {
  beforeEach(() => {
    mockConsole();
    confirmMock.mock.resetCalls();
    exitMock.mock.resetCalls();
  });

  const removeTestCases = testCases.filter(({ args }) => args.action === 'rm');

  test.each(removeTestCases)('Will $label', async ({ app, args, expected }) => {
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

  test.each(removeTestCases)('Will not $label when user declines', async ({ app, args }) => {
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
