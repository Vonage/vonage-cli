import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { faker } from '@faker-js/faker';
import yaml from 'yaml';
import { typeLabels } from '../../../src/numbers/types.js';
import { buildCountryString, countryCodes, getCountryName } from '../../../src/ux/locale.js';
import { getTestPhoneNumber } from '../../numbers.js';
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

const __moduleMocks = {
  'yargs': (() => ({
    default: yargs,
  }))(),
  '../../../src/ux/table.js': (() => ({
    table: tableMock,
  }))(),
};




import { mockConsole } from '../../helpers.js';

test('Command: numbers list', { concurrency: 1 }, async (ctx) => {
  for (const [specifier, namedExports] of Object.entries(__moduleMocks)) {
    const moduleOptions = { namedExports: { ...namedExports } };
    if (Object.hasOwn(moduleOptions.namedExports, 'default')) {
      moduleOptions.defaultExport = moduleOptions.namedExports.default;
      delete moduleOptions.namedExports.default;
    }
    ctx.mock.module(specifier, moduleOptions);
  }
  const { handler } = await import('../../../src/commands/numbers/list.js');

  ctx.beforeEach(() => {
    tableMock.mock.resetCalls();
    mockConsole();
  });

  ctx.afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
  });

  await ctx.test('Will list all numbers', async () => {
    const numbers = Array.from(
      { length: 102 },
      () => {
        const number = {
          ...getTestPhoneNumber(),
          appId: faker.datatype.boolean()
            ? faker.string.uuid()
            : undefined,
        };

        return number;
      },
    );

    const numberResponses = [
      {
        count: numbers.length,
        numbers: numbers.slice(0, 100),
      },
      {
        count: numbers.length,
        numbers: numbers.slice(100),
      },
    ];
    const numbersMock = mock.fn(() => Promise.resolve(numberResponses.shift()));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ SDK: sdkMock });

    assert.strictEqual(numbersMock.mock.callCount(), 2);

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ index: 1, size: 100 }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['There are 102 numbers']);;

    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.ok(tableMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [numbers.map((number) => ({
      'Country': buildCountryString(number.country),
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Linked Application ID': number.appId || 'Not linked to any application',
      'Features': number.features.sort().join(', '),
    })), ])));;
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(numbers.map((number) => ({
      'Country': buildCountryString(number.country),
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Linked Application ID': number.appId || 'Not linked to any application',
      'Features': number.features.sort().join(', '),
    })))]);;
  });

  await ctx.test('Will not list numbers when there are none', async () => {
    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({}));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ SDK: sdkMock });

    assert.strictEqual(numbersMock.mock.callCount(), 1);

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ index: 1, size: 100 }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, ['You do not have any numbers']);;

    assert.strictEqual(tableMock.mock.callCount(), 0);
  });

  await ctx.test('Will output json', async () => {
    const numbers = Array.from(
      { length: 10 },
      () => {
        const number = {
          ...getTestPhoneNumber(),
          appId: faker.datatype.boolean()
            ? faker.string.uuid()
            : undefined,
        };

        return number;
      },
    );

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ json: true, SDK: sdkMock });

    assert.ok(console.log.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [JSON.stringify(
      numbers.map(
        (number) => Client.transformers.snakeCaseObjectKeys(number, true, false),
      ),
      null,
      2,
    ), ])));;
  });

  await ctx.test('Will output empty json', async () => {
    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
    }));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ json: true, SDK: sdkMock });

    assert.ok(console.log.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['[]'])));;
  });

  await ctx.test('Will output yaml', async () => {
    const numbers = Array.from(
      { length: 10 },
      () => {
        const number = {
          ...getTestPhoneNumber(),
          appId: faker.datatype.boolean()
            ? faker.string.uuid()
            : undefined,
        };

        return number;
      },
    );

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ yaml: true, SDK: sdkMock });

    assert.ok(console.log.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [yaml.stringify(
      numbers.map(
        (number) => Client.transformers.snakeCaseObjectKeys(number, true, false),
      ),
      null,
      2,
    ), ])));;
  });

  await ctx.test('Will output empty yaml', async () => {
    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
    }));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ yaml: true, SDK: sdkMock });

    assert.ok(console.log.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['[]\n'])));;
  });

  await ctx.test('Will list all numbers for country', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const numbers = Array.from(
      { length: 10 },
      () => {
        const number = {
          ...getTestPhoneNumber(),
          country: country,
        };

        return number;
      },
    );

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ country: country, SDK: sdkMock });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ country: country, index: 1, size: 100 }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [`There are 10 numbers in ${getCountryName(country)}`, ]);;

    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.ok(tableMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [numbers.map((number) => ({
      'Country': buildCountryString(number.country),
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Linked Application ID': 'Not linked to any application',
      'Features': number.features.sort().join(', '),
    })), ])));;
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(numbers.map((number) => ({
      'Country': buildCountryString(number.country),
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Linked Application ID': 'Not linked to any application',
      'Features': number.features.sort().join(', '),
    })))]);;
  });

  await ctx.test('Will list all numbers containing pattern', async () => {
    const pattern = faker.phone.number({ style: 'international' });

    const numbers = Array.from(
      { length: 10 },
      getTestPhoneNumber,
    );

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ searchPattern: 'contains', pattern: pattern, SDK: sdkMock });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ pattern: pattern, searchPattern: 1, index: 1, size: 100 }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [`There are 10 numbers containing ${pattern}`, ]);;

    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.ok(tableMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [numbers.map((number) => ({
      'Country': buildCountryString(number.country),
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Linked Application ID': 'Not linked to any application',
      'Features': number.features.sort().join(', '),
    })), ])));;
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(numbers.map((number) => ({
      'Country': buildCountryString(number.country),
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Linked Application ID': 'Not linked to any application',
      'Features': number.features.sort().join(', '),
    })))]);;
  });

  await ctx.test('Will list all numbers starting with pattern', async () => {
    const pattern = faker.phone.number({ style: 'international' });

    const numbers = Array.from(
      { length: 10 },
      getTestPhoneNumber,
    );

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ searchPattern: 'starts', pattern: pattern, SDK: sdkMock });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ pattern: pattern, searchPattern: 0, index: 1, size: 100 }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [`There are 10 numbers starting with ${pattern}`, ]);;

    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.ok(tableMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [numbers.map((number) => ({
      'Country': buildCountryString(number.country),
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Linked Application ID': 'Not linked to any application',
      'Features': number.features.sort().join(', '),
    })), ])));;
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(numbers.map((number) => ({
      'Country': buildCountryString(number.country),
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Linked Application ID': 'Not linked to any application',
      'Features': number.features.sort().join(', '),
    })))]);;
  });


  await ctx.test('Will list all numbers ending with pattern', async () => {
    const pattern = faker.phone.number({ style: 'international' });

    const numbers = Array.from(
      { length: 10 },
      getTestPhoneNumber,
    );

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ searchPattern: 'ends', pattern: pattern, SDK: sdkMock });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ pattern: pattern, searchPattern: 2, index: 1, size: 100 }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [`There are 10 numbers ending with ${pattern}`, ]);;

    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.ok(tableMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [numbers.map((number) => ({
      'Country': buildCountryString(number.country),
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Linked Application ID': 'Not linked to any application',
      'Features': number.features.sort().join(', '),
    })), ])));;
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(numbers.map((number) => ({
      'Country': buildCountryString(number.country),
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Linked Application ID': 'Not linked to any application',
      'Features': number.features.sort().join(', '),
    })))]);;
  });

  await ctx.test('Will list the number containg pattern for a country', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const pattern = faker.phone.number({ style: 'international' });

    const numbers = Array.from(
      { length: 1 },
      getTestPhoneNumber,
    );

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({
      country: country,
      searchPattern: 'contains',
      pattern: pattern,
      SDK: sdkMock,
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ country: country, pattern: pattern, searchPattern: 1, index: 1, size: 100 }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [`There is 1 number in ${getCountryName(country)} containing ${pattern}`, ]);;

    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.ok(tableMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [numbers.map((number) => ({
      'Country': buildCountryString(number.country),
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Linked Application ID': 'Not linked to any application',
      'Features': number.features.sort().join(', '),
    })), ])));;
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(numbers.map((number) => ({
      'Country': buildCountryString(number.country),
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Linked Application ID': 'Not linked to any application',
      'Features': number.features.sort().join(', '),
    })))]);;
  });
});
