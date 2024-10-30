process.env.FORCE_COLOR = 0;
const yargs = require('yargs');
const { handler } = require('../../../../src/commands/apps/capabilities/remove');
const { mockConsole } = require('../../../helpers');
const { dataSets } = require('../../../__dataSets__/apps/index');

const { confirm } = require('../../../../src/ux/confirm');

jest.mock('../../../../src/ux/confirm');

describe.each(dataSets)('Command: vonage apps capabilities rm $label', ({testCases}) => {
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

  test.each(removeTestCases)('Will not $label', async ({app, args}) => {
    const getAppMock = jest.fn().mockResolvedValue({...app});
    const updateAppMock = jest.fn().mockResolvedValue();
    const sdkMock = {
      applications: {
        getApplication: getAppMock,
        updateApplication: updateAppMock,
      },
    };

    confirm.mockResolvedValue(false);

    await handler({
      SDK: sdkMock,
      id: app.id,
      ...args,
    });

    expect(yargs.exit).not.toHaveBeenCalled();
    expect(getAppMock).toHaveBeenCalledWith(app.id);
    expect(updateAppMock).not.toHaveBeenCalled();
  });
});
