process.env.FORCE_COLOR = 0;
const yargs = require('yargs');
const yaml = require('yaml');
const { handler } = require('../../../../src/commands/apps/numbers/list');
const { typeLabels } = require('../../../../src/numbers/display');
const { buildCountryString } = require('../../../../src/utils/countries');
const { mockConsole } = require('../../../helpers');
const {
  getTestApp,
  addMessagesCapabilities,
  addVoiceCapabilities,
} = require('../../../app');
const { getTestPhoneNumber } = require('../../../numbers');
const { Client } = require('@vonage/server-client');

jest.mock('yargs');

describe('Command: vonage apps numbers list', () => {
  let consoleMock;

  beforeEach(() => {
    consoleMock = mockConsole();
  });

  test('Will list all numbers for application and warn about missing capability', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({numbers: [numberNine]}); 

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({id: app.id, SDK: sdkMock});
    expect(appMock).toHaveBeenCalledWith(app.id);
    expect(numbersMock).toHaveBeenCalledWith({applicationId: app.id});

    expect(consoleMock.log).toHaveBeenCalledTimes(4);

    expect(consoleMock.log).toHaveBeenNthCalledWith(
      3,
      'Linked number(s):',
    );

    expect(consoleMock.table).toHaveBeenCalledTimes(1);
    expect(consoleMock.table).toHaveBeenCalledWith([
      {
        'Country': buildCountryString(numberNine.country),
        'Number': numberNine.msisdn,
        'Type': typeLabels[numberNine.type],
        'Features': numberNine.features.sort().join(', '),
      },
    ]);

    expect(consoleMock.warn).toHaveBeenCalledTimes(1);
    expect(consoleMock.warn).toHaveBeenCalledWith(
      'This application does not have the voice or messages capability enabled',
    );

    expect(consoleMock.error).toHaveBeenCalledTimes(0);
  });

  test('Will not list numbers when there are none', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );


    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue(undefined); 

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({id: app.id, SDK: sdkMock});
    expect(appMock).toHaveBeenCalledWith(app.id);
    expect(numbersMock).toHaveBeenCalledWith({applicationId: app.id});

    expect(consoleMock.log).toHaveBeenCalledTimes(4);

    expect(consoleMock.log).toHaveBeenNthCalledWith(
      2,
      'No numbers linked to this application.',
    );

    expect(consoleMock.log).toHaveBeenNthCalledWith(
      4,
      'Use vonage apps link to link a number to this application.',
    );

    expect(consoleMock.table).toHaveBeenCalledTimes(0);
    expect(consoleMock.warn).toHaveBeenCalledTimes(0);
    expect(consoleMock.error).toHaveBeenCalledTimes(0);
  });

  test('Will not warn when application has voice', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVoiceCapabilities(getTestApp()),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({numbers: [numberNine]}); 

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({id: app.id, SDK: sdkMock});
    expect(consoleMock.log).toHaveBeenCalledTimes(3);
    expect(consoleMock.table).toHaveBeenCalledTimes(1);
    expect(consoleMock.warn).toHaveBeenCalledTimes(0);
    expect(consoleMock.error).toHaveBeenCalledTimes(0);
  });

  test('Will not warn when application has messages', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addMessagesCapabilities(getTestApp()),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({numbers: [numberNine]}); 

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({id: app.id, SDK: sdkMock});
    expect(consoleMock.log).toHaveBeenCalledTimes(3);
    expect(consoleMock.table).toHaveBeenCalledTimes(1);
    expect(consoleMock.warn).toHaveBeenCalledTimes(0);
    expect(consoleMock.error).toHaveBeenCalledTimes(0);
  });

  test('Will exit 1 when there are numbers with no capabilities', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({numbers: [numberNine]}); 

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({id: app.id, SDK: sdkMock, fail: true});
    expect(consoleMock.log).toHaveBeenCalledTimes(3);

    expect(consoleMock.table).toHaveBeenCalledTimes(1);
    expect(consoleMock.warn).toHaveBeenCalledTimes(0);
    expect(consoleMock.error).toHaveBeenCalledTimes(1);
    expect(consoleMock.error).toHaveBeenCalledWith(
      'This application does not have the voice or messages capability enabled',
    );

    expect(yargs.exit).toHaveBeenCalledWith(1);
  });

  test('Will exit 1 when application is not found', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const appMock = jest.fn().mockRejectedValue(new Error('Failed'));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
    };

    await handler({id: app.id, SDK: sdkMock, fail: true});

    expect(consoleMock.table).toHaveBeenCalledTimes(0);
    expect(yargs.exit).toHaveBeenCalledWith(1);
  });

  test('Will exit 1 when calling getOwnedNumbers Fails', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockRejectedValue(new Error('Failed')); 

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({id: app.id, SDK: sdkMock});

    expect(consoleMock.table).toHaveBeenCalledTimes(0);
    expect(yargs.exit).toHaveBeenCalledWith(1);
  });

  test('Will output JSON', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({numbers: [numberNine]}); 

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({id: app.id, SDK: sdkMock, json: true});
    expect(consoleMock.log).toHaveBeenCalledTimes(1);
    expect(consoleMock.log).toHaveBeenCalledWith(
      JSON.stringify(
        [Client.transformers.snakeCaseObjectKeys(numberNine, true, false)],
        null,
        2,
      ),
    );

    expect(consoleMock.table).toHaveBeenCalledTimes(0);
    expect(consoleMock.warn).toHaveBeenCalledTimes(0);
    expect(consoleMock.error).toHaveBeenCalledTimes(0);
  });

  test('Will output JSON with no numbers', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue(undefined); 

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({id: app.id, SDK: sdkMock, json: true});
    expect(consoleMock.log).toHaveBeenCalledTimes(1);
    expect(consoleMock.log).toHaveBeenCalledWith(
      JSON.stringify(
        [],
        null,
        2,
      ),
    );

    expect(consoleMock.table).toHaveBeenCalledTimes(0);
    expect(consoleMock.warn).toHaveBeenCalledTimes(0);
    expect(consoleMock.error).toHaveBeenCalledTimes(0);
  });

  test('Will output YAML', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({numbers: [numberNine]}); 

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({id: app.id, SDK: sdkMock, yaml: true});
    expect(consoleMock.log).toHaveBeenCalledTimes(1);
    expect(consoleMock.log).toHaveBeenCalledWith(
      yaml.stringify(
        [Client.transformers.snakeCaseObjectKeys(numberNine, true, false)],
        null,
        2,
      ),
    );

    expect(consoleMock.table).toHaveBeenCalledTimes(0);
    expect(consoleMock.warn).toHaveBeenCalledTimes(0);
    expect(consoleMock.error).toHaveBeenCalledTimes(0);
  });

  test('Will output YAML with no numbers', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );


    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue(undefined); 

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({id: app.id, SDK: sdkMock, yaml: true});
    expect(consoleMock.log).toHaveBeenCalledTimes(1);
    expect(consoleMock.log).toHaveBeenCalledWith(
      yaml.stringify(
        [],
        null,
        2,
      ),
    );

    expect(consoleMock.table).toHaveBeenCalledTimes(0);
    expect(consoleMock.warn).toHaveBeenCalledTimes(0);
    expect(consoleMock.error).toHaveBeenCalledTimes(0);
  });
});
