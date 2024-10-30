process.env.FORCE_COLOR = 0;
const yargs = require('yargs');
const { handler } = require('../../../../src/commands/apps/capabilities/remove');
const { mockConsole } = require('../../../helpers');
const { dataSets } = require('../../../__dataSets__/apps/index');
const { getBasicApplication } = require('../../../app');

const { confirm } = require('../../../../src/ux/confirm');

jest.mock('../../../../src/ux/confirm');

describe.each(dataSets)('Command: vonage apps capabilities rm $label', ({label, testCases}) => {
  beforeEach(() => {
    mockConsole();
  });

  const removeTestCases = testCases.filter(({args}) => args.action === 'rm');

  test.each(removeTestCases)('Will $label', async ({app, args, expected}) => {
    const getAppMock = jest.fn().mockResolvedValue({...app});
    const updateAppMock = jest.fn().mockResolvedValue();
    const sdkMock = {
      applications: {
        getApplication: getAppMock,
        updateApplication: updateAppMock,
      },
    };

    confirm.mockResolvedValue(true);

    await handler({
      SDK: sdkMock,
      id: app.id,
      ...args,
    });

    expect(yargs.exit).not.toHaveBeenCalled();
    expect(getAppMock).toHaveBeenCalledWith(app.id);
    expect(updateAppMock).toHaveBeenCalledWith(expected);
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

    confirm.mockResolvedValue(false);

    expect(yargs.exit).not.toHaveBeenCalled();
    await handler({
      SDK: sdkMock,
      id: app.id,
      which: label,
    });

    expect(getAppMock).toHaveBeenCalledWith(app.id);
    expect(updateAppMock).not.toHaveBeenCalled();
  });
});
