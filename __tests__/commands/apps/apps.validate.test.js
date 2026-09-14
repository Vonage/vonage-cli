process.env.FORCE_COLOR = 0;
import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getTestApp,
  addVideoCapabilities,
  addNetworkCapabilities,
  addRTCCapabilities,
  addVerifyCapabilities,
  addMessagesCapabilities,
  addVoiceCapabilities,
} from '../../app.js';
import { mockConsole } from '../../helpers.js';
import { getTestPhoneNumber } from '../../numbers.js';
import { testPrivateKey, testPublicKey } from '../../common.js';
import { faker } from '@faker-js/faker';

const testAppCapability = {
  'messages': addMessagesCapabilities,
  'networkApis': addNetworkCapabilities,
  'rtc': addRTCCapabilities,
  'vbc': (app) => ({
    ...app,
    capabilities: {
      ...app.capabilities,
      vbc: {},
    },
  }),
  'verify': addVerifyCapabilities,
  'voice': addVoiceCapabilities,
  'video': addVideoCapabilities,
};

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));




test('Command: vonage apps', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('yargs', { defaultExport: yargs });
  const { handler } = await import('../../../src/commands/apps/validate.js');
  ctx.beforeEach(() => {
    exitMock.mock.resetCalls();
    mockConsole();
  });

  await ctx.test('Will validate application', async () => {
    const app = { ...getTestApp() };

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
    });

    assert.strictEqual(exitMock.mock.callCount(), 0);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['Application validation passed ✅']);
  });

  await ctx.test('Will validate applications key', async () => {
    const app = { ...getTestApp() };
    app.keys.publicKey = testPublicKey;

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      privateKeyFile: testPrivateKey,
    });

    assert.strictEqual(exitMock.mock.callCount(), 0);

    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, ['Application validation passed ✅']);
  });

  await ctx.test('Will fail to validate applications key', async () => {
    const app = { ...getTestApp() };
    app.keys.publicKey = testPublicKey;

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      privateKeyFile: faker.string.alpha(32),
    });

    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [10]);
  });

  for (const capability of Object.keys(testAppCapability)) {
    await ctx.test(`Will validate application has ${capability} capability`, async () => {
      const app = testAppCapability[capability]({ ...getTestApp() });

      const appMock = mock.fn(() => Promise.resolve(app));
      const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [] }));

      const sdkMock = {
        applications: {
          getApplication: appMock,
        },
        numbers: {
          getOwnedNumbers: numbersMock,
        },
      };

      await handler({
        id: app.id,
        SDK: sdkMock,
        [capability]: true,
      });

      assert.strictEqual(exitMock.mock.callCount(), 0);
    });
  }

  for (const capability of Object.keys(testAppCapability)) {
    await ctx.test(`Will not validate application missing ${capability} capability`, async () => {
      const app = { ...getTestApp() };

      const appMock = mock.fn(() => Promise.resolve(app));
      const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [] }));

      const sdkMock = {
        applications: {
          getApplication: appMock,
        },
        numbers: {
          getOwnedNumbers: numbersMock,
        },
      };

      await handler({
        id: app.id,
        SDK: sdkMock,
        [capability]: true,
      });

      assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [5]);
    });
  }

  await ctx.test('Will validate voice application has linked number', async () => {
    const app = addVoiceCapabilities({ ...getTestApp() });

    const numberNine = getTestPhoneNumber();
    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      linkedNumbers: [numberNine.msisdn],
    });

    assert.strictEqual(exitMock.mock.callCount(), 0);

    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, ['Application validation passed ✅']);
  });

  await ctx.test('Will validate messages application has linked number', async () => {
    const app = addMessagesCapabilities({ ...getTestApp() });

    const numberNine = getTestPhoneNumber();
    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      linkedNumbers: [numberNine.msisdn],
    });

    assert.strictEqual(exitMock.mock.callCount(), 0);

    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, ['Application validation passed ✅']);
  });

  await ctx.test('Will validate application has linked multiple numbers', async () => {
    const app = addMessagesCapabilities({ ...getTestApp() });

    const numberNine = getTestPhoneNumber();
    const numberEight = getTestPhoneNumber();
    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 2, numbers: [numberEight, numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      linkedNumbers: [numberNine.msisdn, numberEight.msisdn],
    });

    assert.strictEqual(exitMock.mock.callCount(), 0);

    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, ['Application validation passed ✅']);
  });

  await ctx.test('Will not validate application that is missing linked number', async () => {
    const app = addVideoCapabilities(addMessagesCapabilities({ ...getTestApp() }));

    const numberNine = getTestPhoneNumber();
    const linkedNumber = getTestPhoneNumber().msisdn;
    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      linkedNumbers: [linkedNumber],
    });

    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [2]);
    assert.deepStrictEqual(console.error.mock.calls[1 - 1].arguments, ['Application is missing linked numbers']);
  });

  await ctx.test('Will not validate application that has linked number but missing capability', async () => {
    const app = { ...getTestApp() };

    const numberNine = getTestPhoneNumber();
    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      linkedNumbers: [numberNine.msisdn],
    });

    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [15]);
    assert.deepStrictEqual(console.error.mock.calls[1 - 1].arguments, ['Application has numbers linked but is missing messages or voice capabilities']);
  });

  await ctx.test('Will validate application has all capabilities', async () => {
    const app = addVideoCapabilities(
      addNetworkCapabilities(
        addRTCCapabilities(
          addVoiceCapabilities(
            addMessagesCapabilities(
              addVerifyCapabilities({
                ...getTestApp(),
                capabilities: {
                  vbc: {},
                },
              }),
            ),
          ),
        ),
      ),
    );

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      all: true,
    });

    assert.strictEqual(exitMock.mock.callCount(), 0);
    assert.deepStrictEqual(console.log.mock.calls[9 - 1].arguments, ['Application validation passed ✅']);
  });

  await ctx.test('Will not validate application missing one capability when all is requested', async () => {
    const app = addVideoCapabilities(
      addNetworkCapabilities(
        addRTCCapabilities(
          addVoiceCapabilities(
            addMessagesCapabilities(
              addVerifyCapabilities({ ...getTestApp() }),
            ),
          ),
        ),
      ),
    );

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      all: true,
    });

    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [5]);
    assert.deepStrictEqual(console.error.mock.calls[1 - 1].arguments, ['Application is missing capabilities']);
  });
});
