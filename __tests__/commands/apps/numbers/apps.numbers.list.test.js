process.env.FORCE_COLOR = 0;
const yargs = require('yargs');
const yaml = require('yaml');
const { handler } = require('../../../../src/commands/apps/numbers/list');
const { typeLabels } = require('../../../../src/numbers/types');
const { buildCountryString } = require('../../../../src/ux/locale');
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
  beforeEach(() => {
    mockConsole();
  });

  test('Will list all numbers for application and warn about missing capability', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

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

    await handler({id: app.id, SDK: sdkMock});

    expect(appMock).toHaveBeenCalledWith(app.id);
    expect(numbersMock).toHaveBeenCalledWith({
      applicationId: app.id,
      index: 1,
      size: 100,
    });

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      'There is 1 number linked:',
    );

    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledWith([
      {
        'Country': buildCountryString(numberNine.country),
        'Number': numberNine.msisdn,
        'Type': typeLabels[numberNine.type],
        'Features': numberNine.features.sort().join(', '),
      },
    ]);

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      'This application does not have the voice or messages capability enabled',
    );

    expect(console.error).toHaveBeenCalledTimes(0);
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
    expect(numbersMock).toHaveBeenCalledWith({
      index: 1,
      size: 100,
      applicationId: app.id,
    });

    expect(console.log).toHaveBeenCalledTimes(4);
    expect(console.log).toHaveBeenNthCalledWith(
      2,
      'No numbers linked to this application.',
    );

    expect(console.log).toHaveBeenNthCalledWith(
      4,
      'Use vonage apps link to link a number to this application.',
    );

    expect(console.table).toHaveBeenCalledTimes(0);
    expect(console.warn).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  test('Will not warn when application has voice', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVoiceCapabilities(getTestApp()),
      true,
      true,
    );

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

    await handler({id: app.id, SDK: sdkMock});
    expect(console.log).toHaveBeenCalledTimes(4);
    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  test('Will not warn when application has messages', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addMessagesCapabilities(getTestApp()),
      true,
      true,
    );

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

    await handler({id: app.id, SDK: sdkMock});
    expect(console.log).toHaveBeenCalledTimes(4);
    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  test('Will exit 1 when there are numbers with no capabilities', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

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

    await handler({id: app.id, SDK: sdkMock, fail: true});

    expect(console.log).toHaveBeenCalledTimes(4);
    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      'This application does not have the voice or messages capability enabled',
    );

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
    const numbersMock = jest.fn().mockResolvedValue({count: 1, numbers: [numberNine]});

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({id: app.id, SDK: sdkMock, json: true});
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify(
        [Client.transformers.snakeCaseObjectKeys(numberNine, true, false)],
        null,
        2,
      ),
    );

    expect(console.table).toHaveBeenCalledTimes(0);
    expect(console.warn).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
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
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify(
        [],
        null,
        2,
      ),
    );

    expect(console.table).toHaveBeenCalledTimes(0);
    expect(console.warn).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  test('Will output YAML', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

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

    await handler({id: app.id, SDK: sdkMock, yaml: true});
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      yaml.stringify(
        [Client.transformers.snakeCaseObjectKeys(numberNine, true, false)],
        null,
        2,
      ),
    );

    expect(console.table).toHaveBeenCalledTimes(0);
    expect(console.warn).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
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
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      yaml.stringify(
        [],
        null,
        2,
      ),
    );

    expect(console.table).toHaveBeenCalledTimes(0);
    expect(console.warn).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });
});
