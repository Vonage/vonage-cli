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



const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test('Command: vonage apps numbers link', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('../../../../src/ux/confirm.js', { namedExports: { confirm: confirmMock } });
  ctx.mock.module('yargs', { defaultExport: yargs });
  const { handler } = await import('../../../../src/commands/apps/numbers/unlink.js');
  ctx.beforeEach(() => {
    mockConsole();
    confirmMock.mock.resetCalls();
    exitMock.mock.resetCalls();
  });

  await ctx.test('Will unlink number from an app', async () => {
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
    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{
      index: 1,
      pattern: numberNine.msisdn,
      size: 100,
    }])));
    assert.deepStrictEqual(confirmMock.mock.calls[0].arguments, [`Are you sure you want to unlink ${numberNine.msisdn} from ${app.name}?`]);
    assert.deepStrictEqual(updateMock.mock.calls[0].arguments, [{
      ...numberNine,
    }]);
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, ['Number unlinked']);
    assert.match(console.log.mock.calls[3].arguments[0], new RegExp(`Number: ${escapeRegExp(numberNine.msisdn)}`));
    assert.match(console.log.mock.calls[3].arguments[0], /Linked Application ID: Not linked to any application/);
  });

  await ctx.test('Will unlink number from an app and dump json', async () => {
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
      json: true,
    });

    assert.deepStrictEqual(appMock.mock.calls[0].arguments, [app.id]);
    assert.deepStrictEqual(updateMock.mock.calls[0].arguments, [{
      ...numberNine,
    }]);
    assert.deepStrictEqual(console.log.mock.calls[2].arguments, [JSON.stringify(numberNine, null, 2)]);
  });

  await ctx.test('Will unlink number from an app and dump yaml', async () => {
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
      yaml: true,
    });

    assert.deepStrictEqual(appMock.mock.calls[0].arguments, [app.id]);
    assert.deepStrictEqual(updateMock.mock.calls[0].arguments, [{
      ...numberNine,
    }]);
    assert.deepStrictEqual(console.log.mock.calls[2].arguments, [yaml.stringify(numberNine, null, 2)]);
  });


  await ctx.test('Will not unlink number from an app when user declines', async () => {
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

    assert.ok(appMock.mock.callCount() > 0);
    assert.ok(numbersMock.mock.callCount() > 0);
    assert.ok(confirmMock.mock.callCount() > 0);
    assert.strictEqual(updateMock.mock.callCount(), 0);
    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['Aborted']);
  });

  await ctx.test('Will exit when number is not linked to an application', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));
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


    assert.ok(appMock.mock.callCount() > 0);
    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assert.strictEqual(updateMock.mock.callCount(), 0);
    assert.deepStrictEqual(console.log.mock.calls[0].arguments, ['Number is not linked to an application']);
  });

  await ctx.test('Will exit when number is linked to another application', async () => {
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


    assert.ok(appMock.mock.callCount() > 0);
    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assert.strictEqual(updateMock.mock.callCount(), 0);
    assert.deepStrictEqual(console.error.mock.calls[0].arguments, ['Number is not linked to this application']);
  });

  await ctx.test('Will exit when no numbers are found', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
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
    assert.deepStrictEqual(console.error.mock.calls[0].arguments, ['Number not found']);
  });
});
