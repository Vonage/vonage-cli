process.env.FORCE_COLOR = 0;
const yargs = require('yargs');
const { confirm } = require('../../../src/ux/confirm');
const { faker } = require('@faker-js/faker');
const { handler } = require('../../../src/commands/numbers/cancel');
const { mockConsole } = require('../../helpers');
const { getTestPhoneNumber } = require('../../numbers');

jest.mock('yargs');
jest.mock('../../../src/ux/confirm');

describe('numbers cancel', () => {
  beforeEach(() => {
    mockConsole();
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
    expect(yargs.exit).toHaveBeenCalledWith(44);
  });

  test('Will handel SDK error', async () => {
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

    const cancelNumberMock = jest.fn().mockRejectedValueOnce(new Error('SDK Error'));

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
    expect(cancelNumberMock).toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(99);
  });
});
