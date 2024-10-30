process.env.FORCE_COLOR = 0;
const yaml = require('yaml');
const yargs = require('yargs');
const { faker } = require('@faker-js/faker');
const { getBasicApplication } = require('../../../app');
const { handler } = require('../../../../src/commands/apps/numbers/unlink');
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

  test('Will unlink number from an app', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({numbers: [
      {
        ...numberNine,
        appId: app.id,
      },
    ]});
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
    expect(numbersMock).toHaveBeenCalledWith({
      index: 1,
      pattern: numberNine.msisdn,
      size: 100,
    });
    expect(confirm).toHaveBeenCalledWith(`Are you sure you want to unlink ${numberNine.msisdn} from ${app.name}?`);
    expect(updateMock).toHaveBeenCalledWith({
      ...numberNine,
    });
  });

  test('Will unlink number from an app and dump json', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({numbers: [
      {
        ...numberNine,
        appId: app.id,
      },
    ]});
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
      json: true,
    });

    expect(appMock).toHaveBeenCalledWith(app.id);
    expect(updateMock).toHaveBeenCalledWith({
      ...numberNine,
    });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify(numberNine, null, 2),
    );
  });

  test('Will unlink number from an app and dump yaml', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({numbers: [
      {
        ...numberNine,
        appId: app.id,
      },
    ]});
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
      yaml: true,
    });

    expect(appMock).toHaveBeenCalledWith(app.id);
    expect(updateMock).toHaveBeenCalledWith({
      ...numberNine,
    });
    expect(console.log).toHaveBeenCalledWith(
      yaml.stringify(numberNine, null, 2),
    );
  });


  test('Will not unlink number from an app when user declines', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({numbers: [
      {
        ...numberNine,
        appId: app.id,
      },
    ]});
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

    expect(appMock).toHaveBeenCalled();
    expect(numbersMock).toHaveBeenCalled();
    expect(confirm).toHaveBeenCalled();
    expect(updateMock).not.toHaveBeenCalled();
  });

  test('Will exit when number is not linked to an application', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({numbers: [numberNine]});
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


    expect(appMock).toHaveBeenCalled();
    expect(numbersMock).toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
    expect(updateMock).not.toHaveBeenCalled();
  });

  test('Will exit when number is linked to another application', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const otherAppId = faker.string.uuid();
    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({numbers: [
      {
        ...numberNine,
        appId: otherAppId,
      },
    ]});
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


    expect(appMock).toHaveBeenCalled();
    expect(numbersMock).toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
    expect(updateMock).not.toHaveBeenCalled();
  });

  test('Will exit when no numbers are found', async () => {
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
  });

  test('Will exit 20 when application not found', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const error = new Error('failed');

    error.response = {
      status: 404,
    };

    const appMock = jest.fn().mockRejectedValue(error);

    const numbersMock = jest.fn();
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
    expect(numbersMock).not.toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
    expect(updateMock).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(20);
  });
});

