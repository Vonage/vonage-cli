import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { isDeepStrictEqual } from 'node:util';
import { faker } from '@faker-js/faker';

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
import { getTestPhoneNumber } from '../../numbers.js';

test('Command: vonage numbers cancel', { concurrency: 1 }, async (ctx) => {
  for (const [specifier, namedExports] of Object.entries(__moduleMocks)) {
    const moduleOptions = { namedExports: { ...namedExports } };
    if (Object.hasOwn(moduleOptions.namedExports, 'default')) {
      moduleOptions.defaultExport = moduleOptions.namedExports.default;
      delete moduleOptions.namedExports.default;
    }
    ctx.mock.module(specifier, moduleOptions);
  }
  const { handler } = await import('../../../src/commands/numbers/cancel.js');

  ctx.beforeEach(() => {
    mockConsole();
  });

  ctx.afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    confirm.mock.resetCalls();
  });

  await ctx.test('Will cancel a number', async () => {
    const testNumber = {
      ...getTestPhoneNumber(),
      appId: faker.datatype.boolean()
        ? faker.string.uuid()
        : undefined,
    };

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: 1,
      numbers: [testNumber],
    }));

    const cancelNumberMock = mock.fn();

    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
        cancelNumber: cancelNumberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      country: testNumber.country,
      msisdn: testNumber.msisdn,
    });

    assert.deepStrictEqual(JSON.parse(JSON.stringify(numbersMock.mock.calls[0].arguments)), JSON.parse(JSON.stringify([{
      index: 1,
      size: 1,
      country: testNumber.country,
      pattern: testNumber.msisdn,
      searchPattern: 1,
    }])));

    assert.ok(cancelNumberMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [{
      country: testNumber.country,
      msisdn: testNumber.msisdn,
    }])));;
  });

  await ctx.test('Will not cancel the number when user declines', async () => {
    const testNumber = {
      ...getTestPhoneNumber(),
      appId: faker.datatype.boolean()
        ? faker.string.uuid()
        : undefined,
    };

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: 1,
      numbers: [testNumber],
    }));

    const cancelNumberMock = mock.fn();

    confirm.mock.mockImplementationOnce(() => Promise.resolve(false));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
        cancelNumber: cancelNumberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      country: testNumber.country,
      msisdn: testNumber.msisdn,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(cancelNumberMock.mock.callCount(), 0);
  });

  await ctx.test('Will not call cancel number when number not found', async () => {
    const testNumber = {
      ...getTestPhoneNumber(),
      appId: faker.datatype.boolean()
        ? faker.string.uuid()
        : undefined,
    };

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({}));

    const cancelNumberMock = mock.fn();

    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
        cancelNumber: cancelNumberMock,
      },
    };

    await handler({
      SDK: sdkMock,
      country: testNumber.country,
      msisdn: testNumber.msisdn,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(cancelNumberMock.mock.callCount(), 0);
    assert.ok(exitMock.mock.calls.some(({ arguments: callArguments }) => isDeepStrictEqual(callArguments, [44])));;
  });
});
