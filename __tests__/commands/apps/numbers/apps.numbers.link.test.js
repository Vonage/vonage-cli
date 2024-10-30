process.env.FORCE_COLOR = 0;
const yargs = require('yargs');
const yaml = require('yaml');
const { faker } = require('@faker-js/faker');
const { getBasicApplication } = require('../../../app');
const { handler } = require('../../../../src/commands/apps/numbers/link');
const { mockConsole } = require('../../../helpers');
const { confirm } = require('../../../../src/ux/confirm');
const { getTestPhoneNumber } = require('../../../numbers');
const { Client } = require('@vonage/server-client');

jest.mock('../../../../src/ux/confirm');
jest.mock('yargs');

describe('Command: apps numbers link', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will link numbers to an app', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({numbers: [numberNine]});

    const updateMock = jest.fn().mockResolvedValue({errorCode: '200'});

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateMock,
      },
    };

    await handler({
      id: app.id,
      msisdn: numberNine.msisdn,
      SDK: sdkMock,
    });

    expect(appMock).toHaveBeenCalledWith(app.id);
    expect(numbersMock).toHaveBeenCalledWith({
      pattern: numberNine.msisdn,
      index: 1,
      size: 100,
    });
    expect(confirm).not.toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalledWith({
      ...numberNine,
      appId: app.id,
    });
  });

  test('Will link number to an app and output json', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({numbers: [numberNine]});

    const updateMock = jest.fn().mockResolvedValue({errorCode: '200'});

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateMock,
      },
    };

    await handler({
      id: app.id,
      msisdn: numberNine.msisdn,
      SDK: sdkMock,
      json: true,
    });

    expect(appMock).toHaveBeenCalledWith(app.id);
    expect(numbersMock).toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(JSON.stringify(
      {
        ...numberNine,
        appId: app.id,
      },
      null,
      2,
    ));
  });

  test('Will link number to an app and output yaml', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({numbers: [numberNine]});

    const updateMock = jest.fn().mockResolvedValue({errorCode: '200'});

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateMock,
      },
    };

    await handler({
      id: app.id,
      msisdn: numberNine.msisdn,
      SDK: sdkMock,
      yaml: true,
    });

    expect(appMock).toHaveBeenCalledWith(app.id);
    expect(numbersMock).toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(yaml.stringify(
      {
        ...numberNine,
        appId: app.id,
      },
      null,
      2,
    ));
  });

  test('Will link numbers to an app after confirming', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const otherAppId = faker.string.uuid();
    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({
      numbers: [
        {
          ...numberNine,
          appId: otherAppId,
        },
      ],
    });

    const updateMock = jest.fn().mockResolvedValue({errorCode: '200'});

    confirm.mockResolvedValue(true);

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateMock,
      },
    };

    await handler({
      id: app.id,
      msisdn: numberNine.msisdn,
      SDK: sdkMock,
    });

    expect(confirm).toHaveBeenCalledWith(`Number is already linked to application [${otherAppId}]. Do you want to continue?`);
    expect(updateMock).toHaveBeenCalledWith({
      ...numberNine,
      appId: app.id,
    });
  });

  test('Will do nothing when number already linked', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({
      numbers: [
        {
          ...numberNine,
          appId: app.id,
        },
      ],
    });

    const updateMock = jest.fn().mockResolvedValue({errorCode: '200'});

    confirm.mockResolvedValue(true);

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateMock,
      },
    };

    await handler({
      id: app.id,
      msisdn: numberNine.msisdn,
      SDK: sdkMock,
    });

    expect(appMock).toHaveBeenCalledWith(app.id);
    expect(numbersMock).toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
    expect(updateMock).not.toHaveBeenCalled();
  });

  test('Wont link numbers to an app after does not confirm', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const otherAppId = faker.string.uuid();
    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({
      numbers: [
        {
          ...numberNine,
          appId: otherAppId,
        },
      ],
    });

    const updateMock = jest.fn().mockResolvedValue({errorCode: '200'});

    confirm.mockResolvedValue(false);

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateMock,
      },
    };

    await handler({
      id: app.id,
      msisdn: numberNine.msisdn,
      SDK: sdkMock,
    });

    expect(appMock).toHaveBeenCalledWith(app.id);
    expect(numbersMock).toHaveBeenCalled();
    expect(confirm).toHaveBeenCalled();
    expect(updateMock).not.toHaveBeenCalled();
  });

  test('Will exit 20 when no numbers are found', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({
      numbers: [],
    });

    const updateMock = jest.fn();

    confirm.mockResolvedValue(false);

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateMock,
      },
    };

    await handler({
      id: app.id,
      msisdn: numberNine.msisdn,
      SDK: sdkMock,
    });

    expect(appMock).toHaveBeenCalledWith(app.id);
    expect(confirm).not.toHaveBeenCalled();
    expect(updateMock).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(20);
  });

  test('Will exit 99 when update fails', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);

    const numbersMock = jest.fn().mockResolvedValue({numbers: [numberNine]});
    const updateMock = jest.fn().mockResolvedValue({errorCode: '500'});

    confirm.mockResolvedValue(false);

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateMock,
      },
    };

    await handler({
      id: app.id,
      msisdn: numberNine.msisdn,
      SDK: sdkMock,
    });

    expect(yargs.exit).toHaveBeenCalledWith(99);
  });
});

