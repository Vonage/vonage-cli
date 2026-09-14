process.env.FORCE_COLOR = 0;
import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import yaml from 'yaml';
import { typeLabels } from '../../../../src/numbers/types.js';
import { buildCountryString } from '../../../../src/ux/locale.js';
import { mockConsole } from '../../../helpers.js';
import {
  getTestApp,
  addMessagesCapabilities,
  addVoiceCapabilities,
} from '../../../app.js';
import { getTestPhoneNumber } from '../../../numbers.js';
import { Client } from '@vonage/server-client';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
const sortKeys = (value) => Array.isArray(value)
  ? value.map(sortKeys)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, item]) => [key, sortKeys(item)]))
    : value;
const renderTable = (rows) => `TABLE:${JSON.stringify(sortKeys(rows))}`;
const tableMock = mock.fn(async (rows) => renderTable(rows));




test('Command: vonage apps numbers list', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('yargs', { defaultExport: yargs });
  ctx.mock.module('../../../../src/ux/table.js', { namedExports: { table: tableMock } });
  const { handler } = await import('../../../../src/commands/apps/numbers/list.js');
  ctx.beforeEach(() => {
    tableMock.mock.resetCalls();
    mockConsole();
    exitMock.mock.resetCalls();
  });

  await ctx.test('Will list all numbers for application and warn about missing capability', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock });

    assert.deepStrictEqual(appMock.mock.calls[0].arguments, [app.id]);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{
      applicationId: app.id,
      index: 1,
      size: 100,
    }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['There is 1 number linked:']);

    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.deepStrictEqual(tableMock.mock.calls[0].arguments, [[
      {
        'Country': buildCountryString(numberNine.country),
        'Number': numberNine.msisdn,
        'Type': typeLabels[numberNine.type],
        'Features': numberNine.features.sort().join(', '),
      },
    ]]);
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable([
      {
        'Country': buildCountryString(numberNine.country),
        'Number': numberNine.msisdn,
        'Type': typeLabels[numberNine.type],
        'Features': numberNine.features.sort().join(', '),
      },
    ])]);

    assert.strictEqual(console.warn.mock.callCount(), 1);
    assert.deepStrictEqual(console.warn.mock.calls[0].arguments, ['This application does not have the voice or messages capability enabled']);

    assert.strictEqual(console.error.mock.callCount(), 0);
  });

  await ctx.test('Will not list numbers when there are none', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );


    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve(undefined));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock });
    assert.deepStrictEqual(appMock.mock.calls[0].arguments, [app.id]);
    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{
      index: 1,
      size: 100,
      applicationId: app.id,
    }])));

    assert.strictEqual(console.log.mock.callCount(), 4);
    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['No numbers linked to this application.']);

    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, ['Use vonage apps numbers link to link a number to this application.']);

    assert.strictEqual(tableMock.mock.callCount(), 0);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 0);
  });

  await ctx.test('Will not warn when application has voice', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVoiceCapabilities(getTestApp()),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock });
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, ['']);
    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['There is 1 number linked:']);
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, ['']);
    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable([
      {
        'Country': buildCountryString(numberNine.country),
        'Number': numberNine.msisdn,
        'Type': typeLabels[numberNine.type],
        'Features': numberNine.features.sort().join(', '),
      },
    ])]);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 0);
  });

  await ctx.test('Will not warn when application has messages', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addMessagesCapabilities(getTestApp()),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock });
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, ['']);
    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['There is 1 number linked:']);
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, ['']);
    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable([
      {
        'Country': buildCountryString(numberNine.country),
        'Number': numberNine.msisdn,
        'Type': typeLabels[numberNine.type],
        'Features': numberNine.features.sort().join(', '),
      },
    ])]);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 0);
  });

  await ctx.test('Will exit 1 when there are numbers with no capabilities', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock, fail: true });

    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, ['']);
    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['There is 1 number linked:']);
    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, ['']);
    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable([
      {
        'Country': buildCountryString(numberNine.country),
        'Number': numberNine.msisdn,
        'Type': typeLabels[numberNine.type],
        'Features': numberNine.features.sort().join(', '),
      },
    ])]);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 1);
    assert.deepStrictEqual(console.error.mock.calls[0].arguments, ['This application does not have the voice or messages capability enabled']);

    assert.deepStrictEqual(exitMock.mock.calls[0].arguments, [1]);
  });

  await ctx.test('Will output JSON', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock, json: true });
    assert.strictEqual(console.log.mock.callCount(), 1);
    assert.deepStrictEqual(console.log.mock.calls[0].arguments, [JSON.stringify(
      [Client.transformers.snakeCaseObjectKeys(numberNine, true, false)],
      null,
      2,
    )]);

    assert.strictEqual(tableMock.mock.callCount(), 0);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 0);
  });

  await ctx.test('Will output JSON with no numbers', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve(undefined));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock, json: true });
    assert.strictEqual(console.log.mock.callCount(), 1);
    assert.deepStrictEqual(console.log.mock.calls[0].arguments, [JSON.stringify(
      [],
      null,
      2,
    )]);

    assert.strictEqual(tableMock.mock.callCount(), 0);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 0);
  });

  await ctx.test('Will output YAML', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );

    const numberNine = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({ count: 1, numbers: [numberNine] }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock, yaml: true });
    assert.strictEqual(console.log.mock.callCount(), 1);
    assert.deepStrictEqual(console.log.mock.calls[0].arguments, [yaml.stringify(
      [Client.transformers.snakeCaseObjectKeys(numberNine, true, false)],
      null,
      2,
    )]);

    assert.strictEqual(tableMock.mock.callCount(), 0);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 0);
  });

  await ctx.test('Will output YAML with no numbers', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getTestApp(),
      true,
      true,
    );


    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve(undefined));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock, yaml: true });
    assert.strictEqual(console.log.mock.callCount(), 1);
    assert.deepStrictEqual(console.log.mock.calls[0].arguments, [yaml.stringify(
      [],
      null,
      2,
    )]);

    assert.strictEqual(tableMock.mock.callCount(), 0);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 0);
  });

  await ctx.test('Will list multiple linked numbers with plural output', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVoiceCapabilities(getTestApp()),
      true,
      true,
    );

    const numberOne = getTestPhoneNumber();
    const numberTwo = getTestPhoneNumber();

    const appMock = mock.fn(() => Promise.resolve(app));
    const numbersMock = mock.fn(() => Promise.resolve({
      count: 2,
      numbers: [numberOne, numberTwo],
    }));

    const sdkMock = {
      applications: {
        getApplication: appMock,
      },
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ id: app.id, SDK: sdkMock });

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['There are 2 numbers linked:']);
    assert.deepStrictEqual(tableMock.mock.calls[0].arguments, [[
      {
        'Country': buildCountryString(numberOne.country),
        'Number': numberOne.msisdn,
        'Type': typeLabels[numberOne.type],
        'Features': numberOne.features.sort().join(', '),
      },
      {
        'Country': buildCountryString(numberTwo.country),
        'Number': numberTwo.msisdn,
        'Type': typeLabels[numberTwo.type],
        'Features': numberTwo.features.sort().join(', '),
      },
    ]]);
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable([
      {
        'Country': buildCountryString(numberOne.country),
        'Number': numberOne.msisdn,
        'Type': typeLabels[numberOne.type],
        'Features': numberOne.features.sort().join(', '),
      },
      {
        'Country': buildCountryString(numberTwo.country),
        'Number': numberTwo.msisdn,
        'Type': typeLabels[numberTwo.type],
        'Features': numberTwo.features.sort().join(', '),
      },
    ])]);
    assert.strictEqual(console.warn.mock.callCount(), 0);
    assert.strictEqual(console.error.mock.callCount(), 0);
  });
});
