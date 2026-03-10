import { jest, describe, test, beforeEach, expect } from '@jest/globals';
process.env.FORCE_COLOR = 0;
import { faker } from '@faker-js/faker';
import { mockConsole } from '../../../helpers.js';
import { getBasicApplication } from '../../../app.js';
import { Client } from '@vonage/server-client';
import { dataSets } from '../../../__dataSets__/apps/index.js';

const exitMock = jest.fn();
const yargs = jest.fn().mockImplementation(() => ({ exit: exitMock }));
jest.unstable_mockModule('yargs', () => ({ default: yargs }));

const { handler } = await import('../../../../src/commands/apps/capabilities/update.js');

describe.each(dataSets)('Command: vonage apps capabilities $label', ({ testCases }) => {
  beforeEach(() => {
    mockConsole();
    exitMock.mockReset();
  });

  const udpateTestCases = testCases.filter(({ args }) => args.action === 'update');

  test.each(udpateTestCases)('Will $label', async ({ app, args, expected }) => {
    const getAppMock = jest.fn().mockResolvedValue({ ...app });
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

    expect(exitMock).not.toHaveBeenCalled();
    expect(getAppMock).toHaveBeenCalledWith(app.id);
    expect(updateAppMock).toHaveBeenCalledWith(expected);
  });
});

describe('Command: vonage apps capabilities', () => {
  beforeEach(() => {
    mockConsole();
    exitMock.mockReset();
  });

  test('Should exit 1 if invalid flag is passed', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const getAppMock = jest.fn().mockResolvedValue({ ...app });
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
    expect(exitMock).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith('You cannot use the flag(s) [messages-status-url, network-redirect-url] when updating the rtc capability');
  });

  test('Should exit 1 if one flag is missing', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const getAppMock = jest.fn().mockResolvedValue({ ...app });
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
    expect(exitMock).toHaveBeenCalledWith(1);
    expect(console.error).toHaveBeenCalledWith('You must provide at least one rtc-* flag when updating the rtc capability');
  });
});
