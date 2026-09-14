import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { faker } from '@faker-js/faker';
import { typeLabels } from '../../../src/numbers/types.js';
import { countryCodes, displayCurrency, buildCountryString } from '../../../src/ux/locale.js';
import { getTestPhoneNumber } from '../../numbers.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const __moduleMocks = {
  'yargs': (() => ({
    default: yargs,
  }))(),
};




import { mockConsole } from '../../helpers.js';

test('Command: numbers update', { concurrency: 1 }, async (ctx) => {
  for (const [specifier, namedExports] of Object.entries(__moduleMocks)) {
    const moduleOptions = { namedExports: { ...namedExports } };
    if (Object.hasOwn(moduleOptions.namedExports, 'default')) {
      moduleOptions.defaultExport = moduleOptions.namedExports.default;
      delete moduleOptions.namedExports.default;
    }
    ctx.mock.module(specifier, moduleOptions);
  }
  const { handler } = await import('../../../src/commands/numbers/update.js');

  ctx.beforeEach(() => {
    mockConsole();
  });

  ctx.afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
  });

  await ctx.test('Will update number', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };


    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: 1,
      numbers: [testNumber],
    }));

    const updateNumberMock = mock.fn();
    updateNumberMock.mock.mockImplementationOnce(() => Promise.resolve({
      errorCode: '200',
      errorStatus: 'success',
    }));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateNumberMock,
      },
    };

    const voiceCallbackValue = faker.internet.url();
    const voiceCallbackType = faker.helpers.arrayElements(['app', 'sip', 'tel'])[0];
    const voiceStatusCallbackUrl = faker.internet.url();

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
      voiceCallbackValue,
      voiceCallbackType,
      voiceStatusCallback: voiceStatusCallbackUrl,
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{ country: country, index: 1, size: 1, searchPattern: 1, pattern: testNumber.msisdn }])));

    assert.ok(updateNumberMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [{
      ...testNumber,
      voiceCallbackValue,
      voiceCallbackType,
      voiceStatusCallback: voiceStatusCallbackUrl,
    }])));;

    assert.strictEqual(exitMock.mock.callCount(), 0);

    assert.deepStrictEqual(console.log.mock.calls[3 - 1].arguments, ['Number updated successfully']);;

    assert.deepStrictEqual(console.log.mock.calls[5 - 1].arguments, [[
      `Number: ${testNumber.msisdn}`,
      `Country: ${buildCountryString(testNumber.country)}`,
      `Type: ${typeLabels[testNumber.type]}`,
      `Features: ${testNumber.features.join(', ')}`,
      `Monthly Cost: ${displayCurrency(testNumber.cost)}`,
      `Setup Cost: ${displayCurrency(testNumber.initialPrice)}`,
      'Linked Application ID: Not linked to any application',
      `Voice Callback: ${voiceCallbackType}`,
      `Voice Callback Value: ${voiceCallbackValue}`,
      `Voice Status Callback: ${voiceStatusCallbackUrl}`,
    ].join('\n'), ]);;
  });

  await ctx.test('Will not update number when not found', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };


    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve(undefined));

    const updateNumberMock = mock.fn();

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateNumberMock,
      },
    };

    const voiceCallbackValue = faker.internet.url();
    const voiceCallbackType = faker.helpers.arrayElements(['app', 'sip', 'tel'])[0];
    const voiceStatusCallbackUrl = faker.internet.url();

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
      voiceCallbackValue,
      voiceCallbackType,
      voiceStatusCallback: voiceStatusCallbackUrl,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(updateNumberMock.mock.callCount(), 0);
    assert.ok(exitMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [44])));;
  });

  await ctx.test('Will handle SDK error', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };


    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: 1,
      numbers: [testNumber],
    }));

    const updateNumberMock = mock.fn();
    updateNumberMock.mock.mockImplementationOnce(() => Promise.reject(new Error('SDK error')));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateNumberMock,
      },
    };

    const voiceCallbackValue = faker.internet.url();
    const voiceCallbackType = faker.helpers.arrayElements(['app', 'sip', 'tel'])[0];
    const voiceStatusCallbackUrl = faker.internet.url();

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
      voiceCallbackValue,
      voiceCallbackType,
      voiceStatusCallback: voiceStatusCallbackUrl,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.ok(updateNumberMock.mock.callCount() > 0);
    assert.ok(exitMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [99])));;
  });
});
