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

const { handler } = await loadModule(import.meta.url, '../../../src/commands/numbers/cancel.js', __moduleMocks);
import { mockConsole } from '../../helpers.js';
import { getTestPhoneNumber } from '../../numbers.js';

describe('Command: vonage numbers cancel', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    confirm.mock.resetCalls();
  });

  test('Will cancel a number', async () => {
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

    assertCalledWith(numbersMock, {
      index: 1,
      size: 1,
      country: testNumber.country,
      pattern: testNumber.msisdn,
      searchPattern: 1,
    });

    assertCalledWith(cancelNumberMock, {
      country: testNumber.country,
      msisdn: testNumber.msisdn,
    });
  });

  test('Will not cancel the number when user declines', async () => {
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

  test('Will not call cancel number when number not found', async () => {
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
    assertCalledWith(exitMock, 44);
  });
});
