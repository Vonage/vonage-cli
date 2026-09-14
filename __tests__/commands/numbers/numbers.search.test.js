import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { faker } from '@faker-js/faker';
import yaml from 'yaml';
import { typeLabels } from '../../../src/numbers/types.js';
import { countryCodes, getCountryName, displayCurrency } from '../../../src/ux/locale.js';
import { getTestPhoneNumber } from '../../numbers.js';
import { Client } from '@vonage/server-client';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));
const renderTable = (rows) => `TABLE:${JSON.stringify(rows)}`;
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

test('Command: vonage numbers search', { concurrency: 1 }, async (ctx) => {
  for (const [specifier, namedExports] of Object.entries(__moduleMocks)) {
    const moduleOptions = { namedExports: { ...namedExports } };
    if (Object.hasOwn(moduleOptions.namedExports, 'default')) {
      moduleOptions.defaultExport = moduleOptions.namedExports.default;
      delete moduleOptions.namedExports.default;
    }
    ctx.mock.module(specifier, moduleOptions);
  }
  const { handler } = await import('../../../src/commands/numbers/search.js');

  ctx.beforeEach(() => {
    tableMock.mock.resetCalls();
    mockConsole();
  });

  ctx.afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
  });

  await ctx.test('Will search for numbers', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const numbers = Array.from(
      { length: 100 },
      () => ({
        ...getTestPhoneNumber(),
        country: country,
        cost: faker.commerce.price(),
        initialPrice: faker.commerce.price(),
      }),
    );

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
      },
    };

    await handler({
      country: country,
      SDK: sdkMock,
      page: 1,
      limit: 100,
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ country: country, index: 1, size: 100 }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [`There are 100 numbers available for purchase in ${getCountryName(country)}`, ]);;

    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.ok(tableMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [numbers.map((number) => ({
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Features': number.features.sort().join(', '),
      'Monthly Cost': displayCurrency(number.cost),
      'Setup Cost': displayCurrency(number.initialPrice),
    })), ])));;
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(numbers.map((number) => ({
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Features': number.features.sort().join(', '),
      'Monthly Cost': displayCurrency(number.cost),
      'Setup Cost': displayCurrency(number.initialPrice),
    })))]);;
  });

  await ctx.test('Will not list numbers when there are none', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({}));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
      },
    };

    await handler({
      country: country,
      SDK: sdkMock,
      page: 1,
      limit: 100,
    });

    assert.strictEqual(numbersMock.mock.callCount(), 1);

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ country: country, index: 1, size: 100 }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [`There are no matching numbers available for purchase in ${getCountryName(country)}`, ]);;

    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, ['Try to broaden your search criteria', ]);;

    assert.strictEqual(tableMock.mock.callCount(), 0);
  });

  await ctx.test('Will output json', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const numbers = Array.from(
      { length: 10 },
      () => {
        const number = {
          ...getTestPhoneNumber(),
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
        getAvailableNumbers: numbersMock,
      },
    };

    await handler({
      country: country,
      json: true,
      SDK: sdkMock,
      page: 1,
      limit: 100,
    });

    assert.ok(console.log.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [JSON.stringify(
      numbers.map(
        (number) => Client.transformers.snakeCaseObjectKeys(number, true, false),
      ),
      null,
      2,
    ), ])));;
  });

  await ctx.test('Will output empty json', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
    }));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
      },
    };

    await handler({
      country: country,
      json: true,
      SDK: sdkMock,
      page: 1,
      limit: 100,
    });

    assert.ok(console.log.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['[]'])));;
  });

  await ctx.test('Will output yaml', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const numbers = Array.from(
      { length: 10 },
      () => {
        const number = {
          ...getTestPhoneNumber(),
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
        getAvailableNumbers: numbersMock,
      },
    };

    await handler({
      country: country,
      yaml: true,
      SDK: sdkMock,
      page: 1,
      limit: 100,
    });

    assert.ok(console.log.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [yaml.stringify(
      numbers.map(
        (number) => Client.transformers.snakeCaseObjectKeys(number, true, false),
      ),
      null,
      2,
    ), ])));;
  });

  await ctx.test('Will output empty yaml', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
    }));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
      },
    };

    await handler({
      country: country,
      yaml: true,
      SDK: sdkMock,
      page: 1,
      limit: 100,
    });

    assert.ok(console.log.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, ['[]\n'])));;
  });

  await ctx.test('Will search for numbers containing pattern', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const pattern = faker.phone.number({ style: 'international' });

    const numbers = Array.from(
      { length: 10 },
      () => ({
        ...getTestPhoneNumber(),
        country: country,
        cost: faker.commerce.price(),
        initialPrice: faker.commerce.price(),
      }),
    );

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
      },
    };

    await handler({
      country: country,
      searchPattern: 'contains',
      pattern: pattern,
      SDK: sdkMock,
      page: 1,
      limit: 100,
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ country: country, pattern: pattern, searchPattern: 1, index: 1, size: 100 }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [`There are 10 numbers available for purchase in ${getCountryName(country)} containing ${pattern}`, ]);;

    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.ok(tableMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [numbers.map((number) => ({
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Features': number.features.sort().join(', '),
      'Monthly Cost': displayCurrency(number.cost),
      'Setup Cost': displayCurrency(number.initialPrice),
    })), ])));;
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(numbers.map((number) => ({
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Features': number.features.sort().join(', '),
      'Monthly Cost': displayCurrency(number.cost),
      'Setup Cost': displayCurrency(number.initialPrice),
    })))]);;
  });

  await ctx.test('Will search for numbers starting with pattern', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const pattern = faker.phone.number({ style: 'international' });

    const numbers = Array.from(
      { length: 10 },
      () => ({
        ...getTestPhoneNumber(),
        country: country,
        cost: faker.commerce.price(),
        initialPrice: faker.commerce.price(),
      }),
    );

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
      },
    };

    await handler({
      country: country,
      searchPattern: 'starts',
      pattern: pattern,
      SDK: sdkMock,
      page: 1,
      limit: 100,
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ country: country, pattern: pattern, searchPattern: 0, index: 1, size: 100 }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [`There are 10 numbers available for purchase in ${getCountryName(country)} starting with ${pattern}`, ]);;

    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.ok(tableMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [numbers.map((number) => ({
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Features': number.features.sort().join(', '),
      'Monthly Cost': displayCurrency(number.cost),
      'Setup Cost': displayCurrency(number.initialPrice),
    })), ])));;
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(numbers.map((number) => ({
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Features': number.features.sort().join(', '),
      'Monthly Cost': displayCurrency(number.cost),
      'Setup Cost': displayCurrency(number.initialPrice),
    })))]);;
  });


  await ctx.test('Will search for numbers ending with pattern', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const pattern = faker.phone.number({ style: 'international' });

    const numbers = Array.from(
      { length: 1 },
      () => ({
        ...getTestPhoneNumber(),
        country: country,
        cost: faker.commerce.price(),
        initialPrice: faker.commerce.price(),
      }),
    );

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
      },
    };

    await handler({
      country: country,
      searchPattern: 'ends',
      pattern: pattern,
      SDK: sdkMock,
      page: 1,
      limit: 100,
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ country: country, pattern: pattern, searchPattern: 2, index: 1, size: 100 }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [`There is 1 number available for purchase in ${getCountryName(country)} ending with ${pattern}`, ]);;

    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.ok(tableMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [numbers.map((number) => ({
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Features': number.features.sort().join(', '),
      'Monthly Cost': displayCurrency(number.cost),
      'Setup Cost': displayCurrency(number.initialPrice),
    })), ])));;
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(numbers.map((number) => ({
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Features': number.features.sort().join(', '),
      'Monthly Cost': displayCurrency(number.cost),
      'Setup Cost': displayCurrency(number.initialPrice),
    })))]);;
  });

  await ctx.test('Will search for numbers by type', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const pattern = faker.phone.number({ style: 'international' });

    const numbers = Array.from(
      { length: 1 },
      () => ({
        ...getTestPhoneNumber(),
        country: country,
        cost: faker.commerce.price(),
        initialPrice: faker.commerce.price(),
      }),
    );

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
      },
    };

    await handler({
      type: 'mobile-lvn',
      country: country,
      searchPattern: 'ends',
      pattern: pattern,
      SDK: sdkMock,
      page: 1,
      limit: 100,
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ type: 'mobile-lvn', country: country, pattern: pattern, searchPattern: 2, index: 1, size: 100 }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [`There is 1 Mobile number available for purchase in ${getCountryName(country)} ending with ${pattern}`, ]);;

    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.ok(tableMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [numbers.map((number) => ({
      'Number': number.msisdn,
      'Features': number.features.sort().join(', '),
      'Monthly Cost': displayCurrency(number.cost),
      'Setup Cost': displayCurrency(number.initialPrice),
    })), ])));;
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(numbers.map((number) => ({
      'Number': number.msisdn,
      'Features': number.features.sort().join(', '),
      'Monthly Cost': displayCurrency(number.cost),
      'Setup Cost': displayCurrency(number.initialPrice),
    })))]);;
  });

  await ctx.test('Will search for numbers having MMS feature', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const pattern = faker.phone.number({ style: 'international' });

    const numbers = Array.from(
      { length: 1 },
      () => ({
        ...getTestPhoneNumber(),
        country: country,
        cost: faker.commerce.price(),
        initialPrice: faker.commerce.price(),
      }),
    );

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
      },
    };

    await handler({
      features: ['MMS'],
      country: country,
      searchPattern: 'ends',
      pattern: pattern,
      SDK: sdkMock,

      page: 1,
      limit: 100,
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ features: 'MMS', country: country, pattern: pattern, searchPattern: 2, index: 1, size: 100 }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [`There is 1 number available for purchase in ${getCountryName(country)} ending with ${pattern} having the MMS feature`, ]);;

    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.ok(tableMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [numbers.map((number) => ({
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Features': number.features.sort().join(', '),
      'Monthly Cost': displayCurrency(number.cost),
      'Setup Cost': displayCurrency(number.initialPrice),
    })), ])));;
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(numbers.map((number) => ({
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Features': number.features.sort().join(', '),
      'Monthly Cost': displayCurrency(number.cost),
      'Setup Cost': displayCurrency(number.initialPrice),
    })))]);;
  });

  await ctx.test('Will search for numbers having multiple features', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const pattern = faker.phone.number({ style: 'international' });

    const numbers = Array.from(
      { length: 1 },
      () => ({
        ...getTestPhoneNumber(),
        country: country,
        cost: faker.commerce.price(),
        initialPrice: faker.commerce.price(),
      }),
    );

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
      },
    };

    await handler({
      features: ['MMS', 'SMS', 'VOICE'],
      country: country,
      searchPattern: 'ends',
      pattern: pattern,
      SDK: sdkMock,
      page: 1,
      limit: 100,
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ features: 'MMS,SMS,VOICE', country: country, pattern: pattern, searchPattern: 2, index: 1, size: 100 }])));

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [`There is 1 number available for purchase in ${getCountryName(country)} ending with ${pattern} having the MMS, SMS, VOICE features`, ]);;

    assert.strictEqual(tableMock.mock.callCount(), 1);
    assert.ok(tableMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [numbers.map((number) => ({
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Features': number.features.sort().join(', '),
      'Monthly Cost': displayCurrency(number.cost),
      'Setup Cost': displayCurrency(number.initialPrice),
    })), ])));;
    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [renderTable(numbers.map((number) => ({
      'Number': number.msisdn,
      'Type': typeLabels[number.type],
      'Features': number.features.sort().join(', '),
      'Monthly Cost': displayCurrency(number.cost),
      'Setup Cost': displayCurrency(number.initialPrice),
    })))]);;
  });
});
