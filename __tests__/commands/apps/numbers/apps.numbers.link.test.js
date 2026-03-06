import { jest, describe, test, beforeEach, expect } from '@jest/globals';
process.env.FORCE_COLOR = 0;
import yaml from 'yaml';
import { faker } from '@faker-js/faker';
import { getBasicApplication } from '../../../app.js';
import { mockConsole } from '../../../helpers.js';
import { getTestPhoneNumber } from '../../../numbers.js';
import { Client } from '@vonage/server-client';

const confirmMock = jest.fn();
const yargs = { exit: jest.fn() };

jest.unstable_mockModule('../../../../src/ux/confirm.js', () => ({ confirm: confirmMock }));
jest.unstable_mockModule('yargs', () => ({ default: yargs }));

const { handler } = await import('../../../../src/commands/apps/numbers/link.js');

describe('Command: vonage apps numbers link', () => {
  beforeEach(() => {
    mockConsole();
    confirmMock.mockReset();
    yargs.exit.mockReset();
  });

  test('Will link numbers to an app', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = jest.fn().mockResolvedValue(app);
    const numbersMock = jest.fn().mockResolvedValue({
      count: 1,
      numbers: [numberNine],
    });

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
    expect(confirmMock).not.toHaveBeenCalled();
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
    const numbersMock = jest.fn().mockResolvedValue({
      count: 1,
      numbers: [numberNine],
    });

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
    expect(confirmMock).not.toHaveBeenCalled();
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
    const numbersMock = jest.fn().mockResolvedValue({
      count: 1,
      numbers: [numberNine],
    });

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
    expect(confirmMock).not.toHaveBeenCalled();
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
      count: 1,
      numbers: [
        {
          ...numberNine,
          appId: otherAppId,
        },
      ],
    });

    const updateMock = jest.fn().mockResolvedValue({errorCode: '200'});

    confirmMock.mockResolvedValue(true);

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

    expect(confirmMock).toHaveBeenCalledWith(`Number is already linked to application [${otherAppId}]. Do you want to continue?`);
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
      count: 1,
      numbers: [
        {
          ...numberNine,
          appId: app.id,
        },
      ],
    });

    const updateMock = jest.fn().mockResolvedValue({errorCode: '200'});

    confirmMock.mockResolvedValue(true);

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
    expect(confirmMock).not.toHaveBeenCalled();
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
      count: 1,
      numbers: [
        {
          ...numberNine,
          appId: otherAppId,
        },
      ],
    });

    const updateMock = jest.fn().mockResolvedValue({errorCode: '200'});

    confirmMock.mockResolvedValue(false);

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
    expect(confirmMock).toHaveBeenCalled();
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
      count: 1,
      numbers: [],
    });

    const updateMock = jest.fn();

    confirmMock.mockResolvedValue(false);

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
    expect(confirmMock).not.toHaveBeenCalled();
    expect(updateMock).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(20);
  });
});

