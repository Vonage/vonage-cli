import { jest, describe, test, beforeEach, afterEach, expect } from '@jest/globals';
import { faker } from '@faker-js/faker';
import yaml from 'yaml';
import { typeLabels } from '../../../src/numbers/types.js';
import { countryCodes, displayCurrency, buildCountryString } from '../../../src/ux/locale.js';
import { getTestPhoneNumber } from '../../numbers.js';
import { Client } from '@vonage/server-client';

const exitMock = jest.fn();
const yargs = jest.fn().mockImplementation(() => ({ exit: exitMock }));

const confirm = jest.fn();

jest.unstable_mockModule('yargs', () => ({
  default: yargs,
}));

jest.unstable_mockModule('../../../src/ux/confirm.js', () => ({
  confirm,
}));

const { handler } = await import('../../../src/commands/numbers/buy.js');
import { mockConsole } from '../../helpers.js';

describe('Command: numbers buy', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Will purchase number', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };

    const numbers = [testNumber];

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

    const buyNumberMock = jest.fn().mockResolvedValueOnce({
      errorCode: '200',
      errorStatus: 'success',
    });

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mockResolvedValueOnce(true);

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
    });

    expect(numbersMock).toHaveBeenCalledWith({
      country: country,
      size: 1,
      searchPattern: 1,
      pattern: testNumber.msisdn,
    });

    expect(buyNumberMock).toHaveBeenCalledWith({
      country: country,
      msisdn: testNumber.msisdn,
    });

    expect(exitMock).not.toHaveBeenCalled();

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      `Number ${testNumber.msisdn} purchased`,
    );

    expect(console.log).toHaveBeenNthCalledWith(
      4,
      [
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
      ].join('\n'),
    );
  });

  test('Will purchase number and output JSON', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };

    const numbers = [testNumber];

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

    const buyNumberMock = jest.fn().mockResolvedValueOnce({
      errorCode: '200',
      errorStatus: 'success',
    });

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mockResolvedValueOnce(true);

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
      json: true,
    });

    expect(numbersMock).toHaveBeenCalled();
    expect(buyNumberMock).toHaveBeenCalled();

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      JSON.stringify(
        Client.transformers.snakeCaseObjectKeys(testNumber, true, false),
        null,
        2,
      ),
    );
  });

  test('Will purchase number and output yaml', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };

    const numbers = [testNumber];

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

    const buyNumberMock = jest.fn().mockResolvedValueOnce({
      errorCode: '200',
      errorStatus: 'success',
    });

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mockResolvedValueOnce(true);

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
      yaml: true,
    });

    expect(numbersMock).toHaveBeenCalled();
    expect(buyNumberMock).toHaveBeenCalled();
    expect(exitMock).not.toHaveBeenCalled();

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      yaml.stringify(
        Client.transformers.snakeCaseObjectKeys(testNumber, true, false),
        null,
        2,
      ),
    );
  });

  test('Will not purchase number when user declines', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };

    const numbers = [testNumber];

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

    const buyNumberMock = jest.fn();

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mockResolvedValueOnce(false);

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
    });

    expect(numbersMock).toHaveBeenCalled();
    expect(buyNumberMock).not.toHaveBeenCalled();
    expect(exitMock).not.toHaveBeenCalled();
  });

  test('Will handel SDK error', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };

    const numbers = [testNumber];

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

    const buyNumberMock = jest.fn().mockRejectedValueOnce(new Error('SDK Error'));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mockResolvedValueOnce(true);

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
    });

    expect(numbersMock).toHaveBeenCalled();
    expect(buyNumberMock).toHaveBeenCalled();
    expect(exitMock).toHaveBeenCalledWith(99);
  });

  test('Will not purchase number when not found', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };

    const numbers = [testNumber];

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
    });

    const buyNumberMock = jest.fn();

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mockResolvedValueOnce(false);

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
    });

    expect(numbersMock).toHaveBeenCalled();
    expect(buyNumberMock).not.toHaveBeenCalled();
    expect(exitMock).toHaveBeenCalledWith(44);
  });
});
