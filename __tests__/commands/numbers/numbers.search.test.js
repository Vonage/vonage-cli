process.env.FORCE_COLOR = 0;
const { faker } = require('@faker-js/faker');
const yaml = require('yaml');
const { handler } = require('../../../src/commands/numbers/search');
const { typeLabels } = require('../../../src/numbers/types');
const { mockConsole } = require('../../helpers');
const { countryCodes, getCountryName } = require('../../../src/utils/countries');
const { getTestPhoneNumber } = require('../../numbers');
const { Client } = require('@vonage/server-client');

jest.mock('yargs');

describe('Command: vonage numbers search', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will search for numbers', async () => {
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

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

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

    expect(numbersMock).toHaveBeenCalledWith({
      country: country,
      index: 1,
      size: 100,
    });

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      `There are 100 numbers available for purchase in ${getCountryName(country)}`,
    );

    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledWith(
      numbers.map((number) => ({
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Features': number.features.sort().join(', '),
        'Monthly Cost': `€${number.cost}`,
        'Setup Cost': `€${number.initialPrice}`,
      }),
      ),
    );
  });

  test('Will not list numbers when there are none', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const numbersMock = jest.fn().mockResolvedValueOnce({});

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

    expect(numbersMock).toHaveBeenCalledTimes(1);

    expect(numbersMock).toHaveBeenCalledWith({
      country: country,
      index: 1,
      size: 100,
    });

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      `There are no matching numbers available for purchase in ${getCountryName(country)}`,
    );

    expect(console.log).toHaveBeenNthCalledWith(
      3,
      'Try to broaden your search criteria',
    );

    expect(console.table).not.toHaveBeenCalled();
  });

  test('Will output json', async () => {
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

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

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

    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify(
        numbers.map(
          (number) => Client.transformers.snakeCaseObjectKeys(number, true, false),
        ),
        null,
        2,
      ),

    );
  });

  test('Will output empty json', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const numbersMock = jest.fn().mockResolvedValueOnce({
    });

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

    expect(console.log).toHaveBeenCalledWith('[]');
  });

  test('Will output yaml', async () => {
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

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

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

    expect(console.log).toHaveBeenCalledWith(
      yaml.stringify(
        numbers.map(
          (number) => Client.transformers.snakeCaseObjectKeys(number, true, false),
        ),
        null,
        2,
      ),

    );
  });

  test('Will output empty yaml', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const numbersMock = jest.fn().mockResolvedValueOnce({
    });

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

    expect(console.log).toHaveBeenCalledWith('[]\n');
  });

  test('Will search for numbers containing pattern', async () => {
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

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

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

    expect(numbersMock).toHaveBeenCalledWith({
      country: country,
      pattern: pattern,
      searchPattern: 1,
      index: 1,
      size: 100,
    });

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      `There are 10 numbers available for purchase in ${getCountryName(country)} containing ${pattern}`,
    );

    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledWith(
      numbers.map((number) => ({
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Features': number.features.sort().join(', '),
        'Monthly Cost': `€${number.cost}`,
        'Setup Cost': `€${number.initialPrice}`,
      }),
      ),
    );
  });

  test('Will search for numbers starting with pattern', async () => {
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

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

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

    expect(numbersMock).toHaveBeenCalledWith({
      country: country,
      pattern: pattern,
      searchPattern: 0,
      index: 1,
      size: 100,
    });

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      `There are 10 numbers available for purchase in ${getCountryName(country)} starting with ${pattern}`,
    );

    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledWith(
      numbers.map((number) => ({
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Features': number.features.sort().join(', '),
        'Monthly Cost': `€${number.cost}`,
        'Setup Cost': `€${number.initialPrice}`,
      }),
      ),
    );
  });


  test('Will search for numbers ending with pattern', async () => {
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

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

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

    expect(numbersMock).toHaveBeenCalledWith({
      country: country,
      pattern: pattern,
      searchPattern: 2,
      index: 1,
      size: 100,
    });

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      `There is 1 number available for purchase in ${getCountryName(country)} ending with ${pattern}`,
    );

    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledWith(
      numbers.map((number) => ({
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Features': number.features.sort().join(', '),
        'Monthly Cost': `€${number.cost}`,
        'Setup Cost': `€${number.initialPrice}`,
      }),
      ),
    );
  });

  test('Will search for numbers by type', async () => {
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

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

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

    expect(numbersMock).toHaveBeenCalledWith({
      type: 'mobile-lvn',
      country: country,
      pattern: pattern,
      searchPattern: 2,
      index: 1,
      size: 100,
    });

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      `There is 1 Mobile number available for purchase in ${getCountryName(country)} ending with ${pattern}`,
    );

    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledWith(
      numbers.map((number) => ({
        'Number': number.msisdn,
        'Features': number.features.sort().join(', '),
        'Monthly Cost': `€${number.cost}`,
        'Setup Cost': `€${number.initialPrice}`,
      }),
      ),
    );
  });

  test('Will search for numbers having MMS feature', async () => {
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

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

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

    expect(numbersMock).toHaveBeenCalledWith({
      features: 'MMS',
      country: country,
      pattern: pattern,
      searchPattern: 2,
      index: 1,
      size: 100,
    });

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      `There is 1 number available for purchase in ${getCountryName(country)} ending with ${pattern} having the MMS feature`,
    );

    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledWith(
      numbers.map((number) => ({
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Features': number.features.sort().join(', '),
        'Monthly Cost': `€${number.cost}`,
        'Setup Cost': `€${number.initialPrice}`,
      }),
      ),
    );
  });

  test('Will search for numbers having multiple features', async () => {
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

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

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

    expect(numbersMock).toHaveBeenCalledWith({
      features: 'MMS,SMS,VOICE',
      country: country,
      pattern: pattern,
      searchPattern: 2,
      index: 1,
      size: 100,
    });

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      `There is 1 number available for purchase in ${getCountryName(country)} ending with ${pattern} having the MMS, SMS, VOICE features`,
    );

    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledWith(
      numbers.map((number) => ({
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Features': number.features.sort().join(', '),
        'Monthly Cost': `€${number.cost}`,
        'Setup Cost': `€${number.initialPrice}`,
      }),
      ),
    );
  });
});
