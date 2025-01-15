process.env.FORCE_COLOR = 0;
const yargs = require('yargs');
const {
  getTestApp,
  addVideoCapabilities,
  addNetworkCapabilities,
  addRTCCapabilities,
  addVerifyCapabilities,
  addMessagesCapabilities,
  addVoiceCapabilities,
} = require('../../app');
const { handler } = require('../../../src/commands/apps/validate');
const { mockConsole } = require('../../helpers');
const { getTestPhoneNumber } = require('../../numbers');
const { testPrivateKey, testPublicKey } = require('../../common');
const { faker } = require('@faker-js/faker');

const testAppCapability = {
  'messages': addMessagesCapabilities,
  'networkApis': addNetworkCapabilities,
  'rtc': addRTCCapabilities,
  'verify': addVerifyCapabilities,
  'voice': addVoiceCapabilities,
  'video': addVideoCapabilities,
};

jest.mock('yargs');

describe('Command: vonage apps', () => {
  // I have no idea why these tests sometimes fail
  jest.retryTimes(3);
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    mockConsole();
  });

  test('Will validate application', async () => {
    const app = {...getTestApp()};

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({count: 1, numbers: []});

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

    expect(yargs.exit).not.toHaveBeenCalled();

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      'Application validation passed ✅',
    );
  });

  test('Will validate applications key', async () => {
    const app = {...getTestApp()};
    app.keys.publicKey = testPublicKey;

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({count: 1, numbers: []});

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

    expect(yargs.exit).not.toHaveBeenCalled();

    expect(console.log).toHaveBeenNthCalledWith(
      3,
      'Application validation passed ✅',
    );
  });

  test('Will fail to validate applications key', async () => {
    const app = {...getTestApp()};
    app.keys.publicKey = testPublicKey;

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({count: 1, numbers: []});

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

    expect(yargs.exit).toHaveBeenCalledWith(10);
  });

  test.each(Object.keys(testAppCapability))('Will validate application has %s capability', async (capability) => {
    const app = testAppCapability[capability]({...getTestApp()});

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({count: 1, numbers: []});

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

    expect(yargs.exit).not.toHaveBeenCalled();
  });

  test.each(Object.keys(testAppCapability))('Will not validate application missing %s capability', async (capability) => {
    const app = {...getTestApp()};

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({count: 1, numbers: []});

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

    expect(yargs.exit).toHaveBeenCalledWith(5);
  });

  test('Will validate voice application has linked number', async () => {
    const app = addVoiceCapabilities({...getTestApp()});

    const numberNine = getTestPhoneNumber();
    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({count: 1, numbers: [numberNine]});

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

    expect(yargs.exit).not.toHaveBeenCalled();

    expect(console.log).toHaveBeenNthCalledWith(
      3,
      'Application validation passed ✅',
    );
  });

  test('Will validate messages application has linked number', async () => {
    const app = addMessagesCapabilities({...getTestApp()});

    const numberNine = getTestPhoneNumber();
    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({count: 1, numbers: [numberNine]});

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

    expect(yargs.exit).not.toHaveBeenCalled();

    expect(console.log).toHaveBeenNthCalledWith(
      3,
      'Application validation passed ✅',
    );
  });

  test('Will validate application has linked multiple numbers', async () => {
    const app = addMessagesCapabilities({...getTestApp()});

    const numberNine = getTestPhoneNumber();
    const numberEight = getTestPhoneNumber();
    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({count: 2, numbers: [numberEight, numberNine]});

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

    expect(yargs.exit).not.toHaveBeenCalled();

    expect(console.log).toHaveBeenNthCalledWith(
      4,
      'Application validation passed ✅',
    );
  });

  test('Will not validate application that is missing linked number', async () => {
    const app = addVideoCapabilities(addMessagesCapabilities({...getTestApp()}));

    const numberNine = getTestPhoneNumber();
    const linkedNumber= getTestPhoneNumber().msisdn;
    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({count: 1, numbers: [numberNine]});

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

    expect(yargs.exit).toHaveBeenCalledWith(2);
    expect(console.error).toHaveBeenNthCalledWith(
      1,
      'Application is missing linked numbers',
    );
  });

  test('Will not validate application that has linked number but missing capability', async () => {
    const app = {...getTestApp()};

    const numberNine = getTestPhoneNumber();
    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({count: 1, numbers: [numberNine]});

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

    expect(yargs.exit).toHaveBeenCalledWith(15);
    expect(console.error).toHaveBeenNthCalledWith(
      1,
      'Application has numbers linked but is missing messages or voice capabilities',
    );
  });
});
