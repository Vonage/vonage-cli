process.env.FORCE_COLOR = 0;
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
  'verify': addVerifyCapabilities,
  'voice': addVoiceCapabilities,
  'video': addVideoCapabilities,
};

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const __moduleMocks = {
  'yargs': (() => ({ default: yargs }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/apps/validate.js', __moduleMocks);

describe('Command: vonage apps', () => {
  // I have no idea why these tests sometimes fail
  beforeEach(() => {
    exitMock.mock.resetCalls();
    mockConsole();
  });

  test('Will validate application', async () => {
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

    assertNthCalledWith(console.log, 
      2,
      'Application validation passed ✅',
    );
  });

  test('Will validate applications key', async () => {
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

    assertNthCalledWith(console.log, 
      3,
      'Application validation passed ✅',
    );
  });

  test('Will fail to validate applications key', async () => {
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

    assertCalledWith(exitMock, 10);
  });

  test.each(Object.keys(testAppCapability))('Will validate application has %s capability', async (capability) => {
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

  test.each(Object.keys(testAppCapability))('Will not validate application missing %s capability', async (capability) => {
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

    assertCalledWith(exitMock, 5);
  });

  test('Will validate voice application has linked number', async () => {
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

    assertNthCalledWith(console.log, 
      3,
      'Application validation passed ✅',
    );
  });

  test('Will validate messages application has linked number', async () => {
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

    assertNthCalledWith(console.log, 
      3,
      'Application validation passed ✅',
    );
  });

  test('Will validate application has linked multiple numbers', async () => {
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

    assertNthCalledWith(console.log, 
      4,
      'Application validation passed ✅',
    );
  });

  test('Will not validate application that is missing linked number', async () => {
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

    assertCalledWith(exitMock, 2);
    assertNthCalledWith(console.error, 
      1,
      'Application is missing linked numbers',
    );
  });

  test('Will not validate application that has linked number but missing capability', async () => {
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

    assertCalledWith(exitMock, 15);
    assertNthCalledWith(console.error, 
      1,
      'Application has numbers linked but is missing messages or voice capabilities',
    );
  });
});
