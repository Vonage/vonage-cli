process.env.FORCE_COLOR = 0;
import { faker } from '@faker-js/faker';
import { mockConsole } from '../../../helpers.js';
import { getBasicApplication } from '../../../app.js';
import { Client } from '@vonage/server-client';
import { dataSets } from '../../../__dataSets__/apps/index.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
const __moduleMocks = {
  'yargs': (() => ({ default: yargs }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../../src/commands/apps/capabilities/update.js', __moduleMocks);

describe.each(dataSets)('Command: vonage apps capabilities $label', ({ testCases }) => {
  beforeEach(() => {
    mockConsole();
    exitMock.mock.resetCalls();
  });

  const udpateTestCases = testCases.filter(({ args }) => args.action === 'update');

  test.each(udpateTestCases)('Will $label', async ({ app, args, expected }) => {
    const getAppMock = mock.fn(() => Promise.resolve({ ...app }));
    const updateAppMock = mock.fn(() => Promise.resolve());
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

    assert.strictEqual(exitMock.mock.callCount(), 0);
    assertCalledWith(getAppMock, app.id);
    assertCalledWith(updateAppMock, expected);
  });
});

describe('Command: vonage apps capabilities', () => {
  beforeEach(() => {
    mockConsole();
    exitMock.mock.resetCalls();
  });

  test('Should exit 1 if invalid flag is passed', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const getAppMock = mock.fn(() => Promise.resolve({ ...app }));
    const updateAppMock = mock.fn(() => Promise.resolve());
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

    assert.strictEqual(updateAppMock.mock.callCount(), 0);
    assertCalledWith(exitMock, 1);
    assertCalledWith(console.error, 'You cannot use the flag(s) [messages-status-url, network-redirect-url] when updating the rtc capability');
  });

  test('Should exit 1 if one flag is missing', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const getAppMock = mock.fn(() => Promise.resolve({ ...app }));
    const updateAppMock = mock.fn(() => Promise.resolve());
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

    assert.strictEqual(updateAppMock.mock.callCount(), 0);
    assertCalledWith(exitMock, 1);
    assertCalledWith(console.error, 'You must provide at least one rtc-* flag when updating the rtc capability');
  });
});
