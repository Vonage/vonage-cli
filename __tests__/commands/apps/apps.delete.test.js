const { handler } = require('../../../src/commands/apps/delete');
const { confirm } = require('../../../src/ux/confirm');
const { faker } = require('@faker-js/faker');
const { getBasicApplication } = require('../../app');
const { mockConsole } = require('../../helpers');
const { Client } = require('@vonage/server-client');
const { sdkError } = require('../../../src/utils/sdkError');

jest.mock('../../../src/utils/sdkError');
jest.mock('../../../src/ux/confirm');

describe('Command: vonage apps delete', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Should delete app', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );
    const appMock = jest.fn().mockResolvedValue(app);
    const deleteMock = jest.fn().mockResolvedValue(undefined);
    const sdkMock = {
      applications: {
        getApplication: appMock,
        deleteApplication: deleteMock,
      },
    };

    confirm.mockResolvedValue(true);
    const appId = faker.string.uuid();
    await handler({
      id: appId,
      SDK: sdkMock,
    });

    expect(deleteMock).toHaveBeenCalledWith(appId);
  });

  test('Should not delete app when user declines', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );
    const appMock = jest.fn().mockResolvedValue(app);
    const deleteMock = jest.fn().mockResolvedValue(undefined);
    const sdkMock = {
      applications: {
        getApplication: appMock,
        deleteApplication: deleteMock,
      },
    };

    confirm.mockResolvedValue(false);
    const appId = faker.string.uuid();
    await handler({
      id: appId,
      SDK: sdkMock,
    });

    expect(deleteMock).not.toHaveBeenCalled();
  });

  test('Should handle error from delete', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );
    const testError = new Error('Test error');
    const appMock = jest.fn().mockResolvedValue(app);
    const deleteMock = jest.fn().mockRejectedValue(testError);
    const sdkMock = {
      applications: {
        getApplication: appMock,
        deleteApplication: deleteMock,
      },
    };

    confirm.mockResolvedValue(true);
    const appId = faker.string.uuid();
    await handler({
      id: appId,
      SDK: sdkMock,
    });

    expect(deleteMock).toHaveBeenCalled();
    expect(sdkError).toHaveBeenCalledWith(testError);
  });
});

