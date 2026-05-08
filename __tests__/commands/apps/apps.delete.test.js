import { faker } from '@faker-js/faker';
import { getBasicApplication } from '../../app.js';
import { mockConsole } from '../../helpers.js';
import { Client } from '@vonage/server-client';

const confirmMock = mock.fn();
const sdkErrorMock = mock.fn();

const __moduleMocks = {
  '../../../src/ux/confirm.js': (() => ({ confirm: confirmMock }))(),
  '../../../src/utils/sdkError.js': (() => ({ sdkError: sdkErrorMock }))(),
};





const { handler } = await loadModule(import.meta.url, '../../../src/commands/apps/delete.js', __moduleMocks);

describe('Command: vonage apps delete', () => {
  beforeEach(() => {
    mockConsole();
    confirmMock.mock.resetCalls();
    sdkErrorMock.mock.resetCalls();
  });

  test('Should delete app', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );
    const appMock = mock.fn(() => Promise.resolve(app));
    const deleteMock = mock.fn(() => Promise.resolve(undefined));
    const sdkMock = {
      applications: {
        getApplication: appMock,
        deleteApplication: deleteMock,
      },
    };

    confirmMock.mock.mockImplementation(() => Promise.resolve(true));
    const appId = faker.string.uuid();
    await handler({
      id: appId,
      SDK: sdkMock,
    });

    assertCalledWith(deleteMock, appId);
  });

  test('Should not delete app when user declines', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );
    const appMock = mock.fn(() => Promise.resolve(app));
    const deleteMock = mock.fn(() => Promise.resolve(undefined));
    const sdkMock = {
      applications: {
        getApplication: appMock,
        deleteApplication: deleteMock,
      },
    };

    confirmMock.mock.mockImplementation(() => Promise.resolve(false));
    const appId = faker.string.uuid();
    await handler({
      id: appId,
      SDK: sdkMock,
    });

    assert.strictEqual(deleteMock.mock.callCount(), 0);
  });

  test('Should handle error from delete', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );
    const testError = new Error('Test error');
    const appMock = mock.fn(() => Promise.resolve(app));
    const deleteMock = mock.fn(() => Promise.reject(testError));
    const sdkMock = {
      applications: {
        getApplication: appMock,
        deleteApplication: deleteMock,
      },
    };

    confirmMock.mock.mockImplementation(() => Promise.resolve(true));
    const appId = faker.string.uuid();
    await handler({
      id: appId,
      SDK: sdkMock,
    });

    assert.ok(deleteMock.mock.callCount() > 0);
    assertCalledWith(sdkErrorMock, testError);
  });
});

