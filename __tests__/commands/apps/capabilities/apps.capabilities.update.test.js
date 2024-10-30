process.env.FORCE_COLOR = 0;
const { faker } = require('@faker-js/faker');
const yargs = require('yargs');
const { handler } = require('../../../../src/commands/apps/capabilities/update');
const { mockConsole } = require('../../../helpers');
const { getBasicApplication } = require('../../../app');
const { Client } = require('@vonage/server-client');
const { dataSets } = require('../../../__dataSets__/apps/index');

describe.each(dataSets)('Command: vonage apps capabilities $label', ({testCases}) => {
  beforeEach(() => {
    mockConsole();
  });

  const udpateTestCases = testCases.filter(({args}) => args.action === 'update');

  test.each(udpateTestCases)('Will $label', async ({app, args, expected}) => {
    const getAppMock = jest.fn().mockResolvedValue({...app});
    const updateAppMock = jest.fn().mockResolvedValue();
    const sdkMock = {
      applications: {
        getApplication: getAppMock,
        updateApplication: updateAppMock,
      },
    };

    await handler({
      SDK: sdkMock,
      id: app.id,
      ...args,
    });

    expect(yargs.exit).not.toHaveBeenCalled();
    expect(getAppMock).toHaveBeenCalledWith(app.id);
    expect(updateAppMock).toHaveBeenCalledWith(expected);
  });
});

describe('Command: vonage apps capabilities', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Should exit 1 if invalid flag is passed', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const getAppMock = jest.fn().mockResolvedValue({...app});
    const updateAppMock = jest.fn().mockResolvedValue();
    const sdkMock = {
      applications: {
        getApplication: getAppMock,
        updateApplication: updateAppMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      action: 'add',
      which: 'rtc',
      networkRedirectUrl: faker.internet.url(),
      messagesStatusUrl: faker.internet.url(),
    });

    expect(updateAppMock).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith('You cannot use the flag(s) [messages-status-url, network-redirect-url] when updating the rtc capability');
  });

  test('Should exit 1 if one flag is missing', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const getAppMock = jest.fn().mockResolvedValue({...app});
    const updateAppMock = jest.fn().mockResolvedValue();
    const sdkMock = {
      applications: {
        getApplication: getAppMock,
        updateApplication: updateAppMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      action: 'add',
      which: 'rtc',
    });

    expect(updateAppMock).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith('You must provide at least one rtc-* flag when updating the rtc capability');
  });
});
