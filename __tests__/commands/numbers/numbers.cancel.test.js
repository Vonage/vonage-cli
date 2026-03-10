import { jest, describe, test, beforeEach, afterEach, expect } from '@jest/globals';
import { faker } from '@faker-js/faker';

const exitMock = jest.fn();
const yargs = jest.fn().mockImplementation(() => ({ exit: exitMock }));

const confirm = jest.fn();

jest.unstable_mockModule('yargs', () => ({
  default: yargs,
}));

jest.unstable_mockModule('../../../src/ux/confirm.js', () => ({
  confirm,
}));

const { handler } = await import('../../../src/commands/numbers/cancel.js');
import { mockConsole } from '../../helpers.js';
import { getTestPhoneNumber } from '../../numbers.js';

describe('Command: vonage numbers cancel', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Will cancel a number', async () => {
    const testNumber = {
      ...getTestPhoneNumber(),
      appId: faker.datatype.boolean()
        ? faker.string.uuid()
        : undefined,
    };

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: 1,
      numbers: [testNumber],
    });

    const cancelNumberMock = jest.fn();

    confirm.mockResolvedValueOnce(true);

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

    expect(numbersMock).toHaveBeenCalledWith({
      index: 1,
      size: 1,
      country: testNumber.country,
      pattern: testNumber.msisdn,
      searchPattern: 1,
    });

    expect(cancelNumberMock).toHaveBeenCalledWith({
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

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: 1,
      numbers: [testNumber],
    });

    const cancelNumberMock = jest.fn();

    confirm.mockResolvedValueOnce(false);

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

    expect(numbersMock).toHaveBeenCalled();
    expect(cancelNumberMock).not.toHaveBeenCalled();
  });

  test('Will not call cancel number when number not found', async () => {
    const testNumber = {
      ...getTestPhoneNumber(),
      appId: faker.datatype.boolean()
        ? faker.string.uuid()
        : undefined,
    };

    const numbersMock = jest.fn().mockResolvedValueOnce({});

    const cancelNumberMock = jest.fn();

    confirm.mockResolvedValueOnce(true);

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

    expect(numbersMock).toHaveBeenCalled();
    expect(cancelNumberMock).not.toHaveBeenCalled();
    expect(exitMock).toHaveBeenCalledWith(44);
  });
});
