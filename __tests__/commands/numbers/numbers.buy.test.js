process.env.FORCE_COLOR = 0;
const yargs = require('yargs');
const { faker } = require('@faker-js/faker');
const { confirm } = require('../../../src/ux/confirm');
const yaml = require('yaml');
const { handler } = require('../../../src/commands/numbers/buy');
const { typeLabels } = require('../../../src/numbers/types');
const { mockConsole } = require('../../helpers');
const { countryCodes, buildCountryString } = require('../../../src/utils/countries');
const { getTestPhoneNumber } = require('../../numbers');
const { Client } = require('@vonage/server-client');

jest.mock('yargs');
jest.mock('../../../src/ux/confirm');

describe('Command: numbers buy', () => {
  beforeEach(() => {
    mockConsole();
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
      index: 1,
      size: 1,
      searchPattern: 1,
      pattern: testNumber.msisdn,
    });

    expect(buyNumberMock).toHaveBeenCalledWith({
      country: country,
      msisdn: testNumber.msisdn,
    });

    expect(yargs.exit).not.toHaveBeenCalled();

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
        `Monthly Cost: €${testNumber.cost}`,
        `Setup Cost: €${testNumber.initialPrice}`,
        'Linked Application ID: Not linked to any application',
        'Message Outbound HTTP URL: Not Set',
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

    expect(numbersMock).toHaveBeenCalledWith({
      country: country,
      index: 1,
      size: 1,
      searchPattern: 1,
      pattern: testNumber.msisdn,
    });

    expect(buyNumberMock).toHaveBeenCalledWith({
      country: country,
      msisdn: testNumber.msisdn,
    });

    expect(yargs.exit).not.toHaveBeenCalled();

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
    expect(yargs.exit).not.toHaveBeenCalled();
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
    expect(yargs.exit).toHaveBeenCalledWith(99);
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
    expect(yargs.exit).toHaveBeenCalledWith(44);
  });
});
