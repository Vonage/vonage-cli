import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { faker } from '@faker-js/faker';
import yaml from 'yaml';
import { typeLabels } from '../../../src/numbers/types.js';
import { countryCodes, displayCurrency, buildCountryString } from '../../../src/ux/locale.js';
import { getTestPhoneNumber } from '../../numbers.js';
import { Client } from '@vonage/server-client';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const confirm = mock.fn();

const __moduleMocks = {
  'yargs': (() => ({
    default: yargs,
  }))(),
  '../../../src/ux/confirm.js': (() => ({
    confirm,
  }))(),
};

import { mockConsole } from '../../helpers.js';

test('Command: numbers buy', { concurrency: 1 }, async (ctx) => {
  for (const [specifier, namedExports] of Object.entries(__moduleMocks)) {
    const moduleOptions = { namedExports: { ...namedExports } };
    if (Object.hasOwn(moduleOptions.namedExports, 'default')) {
      moduleOptions.defaultExport = moduleOptions.namedExports.default;
      delete moduleOptions.namedExports.default;
    }
    ctx.mock.module(specifier, moduleOptions);
  }
  const { handler } = await import('../../../src/commands/numbers/buy.js');

  ctx.beforeEach(() => {
    mockConsole();
  });

  ctx.afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    confirm.mock.resetCalls();
  });

  await ctx.test('Will purchase number', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };

    const numbers = [testNumber];

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const buyNumberMock = mock.fn();
    buyNumberMock.mock.mockImplementationOnce(() => Promise.resolve({
      errorCode: '200',
      errorStatus: 'success',
    }));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
    });

    assert.ok(numbersMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [{
      country: country,
      size: 1,
      searchPattern: 1,
      pattern: testNumber.msisdn,
    }])));;

    assert.ok(buyNumberMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [{
      country: country,
      msisdn: testNumber.msisdn,
    }])));;

    assert.strictEqual(exitMock.mock.callCount(), 0);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [`Number ${testNumber.msisdn} purchased`]);;

    assert.deepStrictEqual(console.log.mock.calls[4 - 1].arguments, [[
      `Number: ${testNumber.msisdn}`,
      `Country: ${buildCountryString(testNumber.country)}`,
      `Type: ${typeLabels[testNumber.type]}`,
      `Features: ${testNumber.features.join(', ')}`,
      `Monthly Cost: ${displayCurrency(testNumber.cost)}`,
      `Setup Cost: ${displayCurrency(testNumber.initialPrice)}`,
      'Linked Application ID: Not linked to any application',
      'Voice Callback: Not Set',
      'Voice Callback Value: Not Set',
      'Voice Status Callback: Not Set',
    ].join('\n'), ]);;
  });

  await ctx.test('Will purchase number and output JSON', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };

    const numbers = [testNumber];

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const buyNumberMock = mock.fn();
    buyNumberMock.mock.mockImplementationOnce(() => Promise.resolve({
      errorCode: '200',
      errorStatus: 'success',
    }));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
      json: true,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.ok(buyNumberMock.mock.callCount() > 0);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(testNumber, true, false),
      null,
      2,
    ), ]);;
  });

  await ctx.test('Will purchase number and output yaml', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };

    const numbers = [testNumber];

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const buyNumberMock = mock.fn();
    buyNumberMock.mock.mockImplementationOnce(() => Promise.resolve({
      errorCode: '200',
      errorStatus: 'success',
    }));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
      yaml: true,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.ok(buyNumberMock.mock.callCount() > 0);
    assert.strictEqual(exitMock.mock.callCount(), 0);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [yaml.stringify(
      Client.transformers.snakeCaseObjectKeys(testNumber, true, false),
      null,
      2,
    ), ]);;
  });

  await ctx.test('Will not purchase number when user declines', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };

    const numbers = [testNumber];

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const buyNumberMock = mock.fn();

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mock.mockImplementationOnce(() => Promise.resolve(false));

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(buyNumberMock.mock.callCount(), 0);
    assert.strictEqual(exitMock.mock.callCount(), 0);
  });

  await ctx.test('Will handel SDK error', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };

    const numbers = [testNumber];

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const buyNumberMock = mock.fn();
    buyNumberMock.mock.mockImplementationOnce(() => Promise.reject(new Error('SDK Error')));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.ok(buyNumberMock.mock.callCount() > 0);
    assert.ok(exitMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [99])));;
  });

  await ctx.test('Will not purchase number when not found', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };

    const numbers = [testNumber];

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
    }));

    const buyNumberMock = mock.fn();

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mock.mockImplementationOnce(() => Promise.resolve(false));

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(buyNumberMock.mock.callCount(), 0);
    assert.ok(exitMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [44])));;
  });
});
