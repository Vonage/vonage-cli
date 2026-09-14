process.env.FORCE_COLOR = 0;
import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import yaml from 'yaml';
import { faker } from '@faker-js/faker';
import { getBasicApplication } from '../../../app.js';
import { mockConsole } from '../../../helpers.js';
import { getTestPhoneNumber } from '../../../numbers.js';
import { Client } from '@vonage/server-client';

const confirmMock = mock.fn();
const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));





test('Command: vonage apps numbers link', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('../../../../src/ux/confirm.js', { namedExports: { confirm: confirmMock } });
  ctx.mock.module('yargs', { defaultExport: yargs });
  const { handler } = await import('../../../../src/commands/apps/numbers/link.js');
  ctx.beforeEach(() => {
    mockConsole();
    confirmMock.mock.resetCalls();
    exitMock.mock.resetCalls();
  });

  await ctx.test('Will link numbers to an app', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
      count: 1,
      numbers: [numberNine],
    }));

    const updateMock = mock.fn(() => Promise.resolve({ errorCode: '200' }));

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

    assert.deepStrictEqual(appMock.mock.calls[0].arguments, [app.id]);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{
      pattern: numberNine.msisdn,
      index: 1,
      size: 100,
    }])));
    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assert.deepStrictEqual(updateMock.mock.calls[0].arguments, [{
      ...numberNine,
      appId: app.id,
    }]);
  });

  await ctx.test('Will link number to an app and output json', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
      count: 1,
      numbers: [numberNine],
    }));

    const updateMock = mock.fn(() => Promise.resolve({ errorCode: '200' }));

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

    assert.deepStrictEqual(appMock.mock.calls[0].arguments, [app.id]);
    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assert.ok(updateMock.mock.callCount() > 0);
    assert.deepStrictEqual(console.log.mock.calls[1].arguments, [JSON.stringify(
      {
        ...numberNine,
        appId: app.id,
      },
      null,
      2,
    )]);
  });

  await ctx.test('Will link number to an app and output yaml', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
      count: 1,
      numbers: [numberNine],
    }));

    const updateMock = mock.fn(() => Promise.resolve({ errorCode: '200' }));

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

    assert.deepStrictEqual(appMock.mock.calls[0].arguments, [app.id]);
    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assert.ok(updateMock.mock.callCount() > 0);
    assert.deepStrictEqual(console.log.mock.calls[1].arguments, [yaml.stringify(
      {
        ...numberNine,
        appId: app.id,
      },
      null,
      2,
    )]);
  });

  await ctx.test('Will link numbers to an app after confirming', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const otherAppId = faker.string.uuid();
    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
      count: 1,
      numbers: [
        {
          ...numberNine,
          appId: otherAppId,
        },
      ],
    }));

    const updateMock = mock.fn(() => Promise.resolve({ errorCode: '200' }));

    confirmMock.mock.mockImplementation(() => Promise.resolve(true));

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

    assert.deepStrictEqual(confirmMock.mock.calls[0].arguments, [`Number is already linked to application [${otherAppId}]. Do you want to continue?`]);
    assert.deepStrictEqual(updateMock.mock.calls[0].arguments, [{
      ...numberNine,
      appId: app.id,
    }]);
  });

  await ctx.test('Will do nothing when number already linked', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
      count: 1,
      numbers: [
        {
          ...numberNine,
          appId: app.id,
        },
      ],
    }));

    const updateMock = mock.fn(() => Promise.resolve({ errorCode: '200' }));

    confirmMock.mock.mockImplementation(() => Promise.resolve(true));

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

    assert.deepStrictEqual(appMock.mock.calls[0].arguments, [app.id]);
    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assert.strictEqual(updateMock.mock.callCount(), 0);
  });

  await ctx.test('Wont link numbers to an app after does not confirm', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const otherAppId = faker.string.uuid();
    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
      count: 1,
      numbers: [
        {
          ...numberNine,
          appId: otherAppId,
        },
      ],
    }));

    const updateMock = mock.fn(() => Promise.resolve({ errorCode: '200' }));

    confirmMock.mock.mockImplementation(() => Promise.resolve(false));

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

    assert.deepStrictEqual(appMock.mock.calls[0].arguments, [app.id]);
    assert.ok(numbersMock.mock.callCount() > 0);
    assert.ok(confirmMock.mock.callCount() > 0);
    assert.strictEqual(updateMock.mock.callCount(), 0);
  });

  await ctx.test('Will exit 20 when no numbers are found', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
      count: 1,
      numbers: [],
    }));

    const updateMock = mock.fn();

    confirmMock.mock.mockImplementation(() => Promise.resolve(false));

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

    assert.deepStrictEqual(appMock.mock.calls[0].arguments, [app.id]);
    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assert.strictEqual(updateMock.mock.callCount(), 0);
    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [20]);
  });
});
