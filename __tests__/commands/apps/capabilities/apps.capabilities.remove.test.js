import { jest, describe, test, beforeEach, expect } from '@jest/globals';
process.env.FORCE_COLOR = 0;
import { mockConsole } from '../../../helpers.js';
import { dataSets } from '../../../__dataSets__/apps/index.js';
import { getBasicApplication } from '../../../app.js';

const confirmMock = jest.fn();
const exitMock = jest.fn();
const yargs = jest.fn().mockImplementation(() => ({ exit: exitMock }));
jest.unstable_mockModule('../../../../src/ux/confirm.js', () => ({ confirm: confirmMock }));
jest.unstable_mockModule('yargs', () => ({ default: yargs }));

const { handler } = await import('../../../../src/commands/apps/capabilities/remove.js');

describe.each(dataSets)('Command: vonage apps capabilities rm $label', ({ label, testCases }) => {
  beforeEach(() => {
    mockConsole();
    confirmMock.mockReset();
    exitMock.mockReset();
  });

  const removeTestCases = testCases.filter(({ args }) => args.action === 'rm');

  test.each(removeTestCases)('Will $label', async ({ app, args, expected }) => {
    const getAppMock = jest.fn().mockResolvedValue({ ...app });
    const updateAppMock = jest.fn().mockResolvedValue();
    const sdkMock = {
      applications: {
        getApplication: getAppMock,
        updateApplication: updateAppMock,
      },
    };

    confirmMock.mockResolvedValue(true);

    await handler({
      SDK: sdkMock,
      id: app.id,
      ...args,
    });

    expect(exitMock).not.toHaveBeenCalled();
    expect(getAppMock).toHaveBeenCalledWith(app.id);
    expect(updateAppMock).toHaveBeenCalledWith(expected);
  });

  test.each(removeTestCases)('Will not $label when user declines', async ({ app, args }) => {
    const getAppMock = jest.fn().mockResolvedValue({ ...app });
    const updateAppMock = jest.fn().mockResolvedValue();
    const sdkMock = {
      applications: {
        getApplication: getAppMock,
        updateApplication: updateAppMock,
      },
    };

    confirmMock.mockResolvedValue(false);

    await handler({
      SDK: sdkMock,
      id: app.id,
      ...args,
    });

    expect(exitMock).not.toHaveBeenCalled();
    expect(getAppMock).toHaveBeenCalledWith(app.id);
    expect(updateAppMock).not.toHaveBeenCalled();
  });

  test('Will not call when there are no capabilities', async () => {
    const app = getBasicApplication();
    const getAppMock = jest.fn().mockResolvedValue(app);
    const updateAppMock = jest.fn().mockResolvedValue();
    const sdkMock = {
      applications: {
        getApplication: getAppMock,
        updateApplication: updateAppMock,
      },
    };

    confirmMock.mockResolvedValue(false);

    expect(exitMock).not.toHaveBeenCalled();
    await handler({
      SDK: sdkMock,
      id: app.id,
      which: label,
    });

    expect(getAppMock).toHaveBeenCalledWith(app.id);
    expect(updateAppMock).not.toHaveBeenCalled();
  });
});
