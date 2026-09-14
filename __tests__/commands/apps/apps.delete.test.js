import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { faker } from '@faker-js/faker';
import { getBasicApplication } from '../../app.js';
import { mockConsole } from '../../helpers.js';
import { Client } from '@vonage/server-client';

const confirmMock = mock.fn();
const sdkErrorMock = mock.fn();





test('Command: vonage apps delete', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('../../../src/ux/confirm.js', { namedExports: { confirm: confirmMock } });
  ctx.mock.module('../../../src/utils/sdkError.js', { namedExports: { sdkError: sdkErrorMock } });
  const { handler } = await import('../../../src/commands/apps/delete.js');
  ctx.beforeEach(() => {
    mockConsole();
    confirmMock.mock.resetCalls();
    sdkErrorMock.mock.resetCalls();
  });

  await ctx.test('Should delete app', async () => {
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

    assert.deepStrictEqual(deleteMock.mock.calls[0].arguments, [appId]);
  });

  await ctx.test('Should not delete app when user declines', async () => {
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

  await ctx.test('Should handle error from delete', async () => {
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
    assert.deepStrictEqual(sdkErrorMock.mock.calls[0].arguments, [testError]);
  });
});
