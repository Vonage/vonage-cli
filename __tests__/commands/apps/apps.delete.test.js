import { faker } from '@faker-js/faker';
import { getBasicApplication } from '../../app.js';
import { mockConsole } from '../../helpers.js';
import { Client } from '@vonage/server-client';

const confirmMock = jest.fn();
const sdkErrorMock = jest.fn();

const __moduleMocks = {
  '../../../src/ux/confirm.js': (() => ({ confirm: confirmMock }))(),
  '../../../src/utils/sdkError.js': (() => ({ sdkError: sdkErrorMock }))(),
};





const { handler } = await loadModule(import.meta.url, '../../../src/commands/apps/delete.js', __moduleMocks);

describe('Command: vonage apps delete', () => {
  beforeEach(() => {
    mockConsole();
    confirmMock.mockReset();
    sdkErrorMock.mockReset();
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

    confirmMock.mockResolvedValue(true);
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

    confirmMock.mockResolvedValue(false);
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

    confirmMock.mockResolvedValue(true);
    const appId = faker.string.uuid();
    await handler({
      id: appId,
      SDK: sdkMock,
    });

    expect(deleteMock).toHaveBeenCalled();
    expect(sdkErrorMock).toHaveBeenCalledWith(testError);
  });
});

