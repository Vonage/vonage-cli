process.env.FORCE_COLOR = 0;
const { faker } = require('@faker-js/faker');
const yaml = require('yaml');
const { handler } = require('../../../src/commands/numbers/list');
const { typeLabels } = require('../../../src/numbers/types');
const { mockConsole } = require('../../helpers');
const { buildCountryString, countryCodes, getCountryName } = require('../../../src/utils/countries');
const { getTestPhoneNumber } = require('../../numbers');
const { Client } = require('@vonage/server-client');

jest.mock('yargs');
describe('Command: numbers list', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will list all numbers', async () => {
    const numbers = Array.from(
      { length: 102 },
      () => {
        const number = {
          ...getTestPhoneNumber(),
          appId: faker.datatype.boolean()
            ? faker.string.uuid()
            : undefined,
        };

        return number;
      },
    );

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers.slice(0, 100),
    })
      .mockResolvedValueOnce({
        count: numbers.length,
        numbers: numbers.slice(100),
      });

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ SDK: sdkMock});

    expect(numbersMock).toHaveBeenCalledTimes(2);

    expect(numbersMock).toHaveBeenCalledWith({
      index: 1,
      size: 100,
    });

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      'There are 102 numbers',
    );

    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledWith(
      numbers.map((number) => ({
        'Country': buildCountryString(number.country),
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Linked Application ID': number.appId || 'Not linked to any application',
        'Features': number.features.sort().join(', '),
      }),
      ),
    );
  });

  test('Will not list numbers when there are none', async () => {
    const numbersMock = jest.fn().mockResolvedValueOnce({});

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({ SDK: sdkMock});

    expect(numbersMock).toHaveBeenCalledTimes(1);

    expect(numbersMock).toHaveBeenCalledWith({
      index: 1,
      size: 100,
    });

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      'You do not have any numbers',
    );

    expect(console.table).not.toHaveBeenCalled();
  });

  test('Will output json', async () => {
    const numbers = Array.from(
      { length: 10 },
      () => {
        const number = {
          ...getTestPhoneNumber(),
          appId: faker.datatype.boolean()
            ? faker.string.uuid()
            : undefined,
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
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({json: true, SDK: sdkMock});

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
    const numbersMock = jest.fn().mockResolvedValueOnce({
    });

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({json: true, SDK: sdkMock});

    expect(console.log).toHaveBeenCalledWith('[]');
  });

  test('Will output yaml', async () => {
    const numbers = Array.from(
      { length: 10 },
      () => {
        const number = {
          ...getTestPhoneNumber(),
          appId: faker.datatype.boolean()
            ? faker.string.uuid()
            : undefined,
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
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({yaml: true, SDK: sdkMock});

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
    const numbersMock = jest.fn().mockResolvedValueOnce({
    });

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({yaml: true, SDK: sdkMock});

    expect(console.log).toHaveBeenCalledWith('[]\n');
  });

  test('Will list all numbers for country', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const numbers = Array.from(
      { length: 10 },
      () => {
        const number = {
          ...getTestPhoneNumber(),
          country: country,
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
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({country: country, SDK: sdkMock});

    expect(numbersMock).toHaveBeenCalledWith({
      country: country,
      index: 1,
      size: 100,
    });

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      `There are 10 numbers in ${getCountryName(country)}`,
    );

    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledWith(
      numbers.map((number) => ({
        'Country': buildCountryString(number.country),
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Linked Application ID': 'Not linked to any application',
        'Features': number.features.sort().join(', '),
      }),
      ),
    );
  });

  test('Will list all numbers containing pattern', async () => {
    const pattern = faker.phone.number({ style: 'international' });

    const numbers = Array.from(
      { length: 10 },
      getTestPhoneNumber,
    );

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({searchPattern: 'contains', pattern: pattern, SDK: sdkMock});

    expect(numbersMock).toHaveBeenCalledWith({
      pattern: pattern,
      searchPattern: 1,
      index: 1,
      size: 100,
    });

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      `There are 10 numbers containing ${pattern}`,
    );

    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledWith(
      numbers.map((number) => ({
        'Country': buildCountryString(number.country),
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Linked Application ID': 'Not linked to any application',
        'Features': number.features.sort().join(', '),
      }),
      ),
    );
  });

  test('Will list all numbers starting with pattern', async () => {
    const pattern = faker.phone.number({ style: 'international' });

    const numbers = Array.from(
      { length: 10 },
      getTestPhoneNumber,
    );

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({searchPattern: 'starts', pattern: pattern, SDK: sdkMock});

    expect(numbersMock).toHaveBeenCalledWith({
      pattern: pattern,
      searchPattern: 0,
      index: 1,
      size: 100,
    });

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      `There are 10 numbers starting with ${pattern}`,
    );

    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledWith(
      numbers.map((number) => ({
        'Country': buildCountryString(number.country),
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Linked Application ID': 'Not linked to any application',
        'Features': number.features.sort().join(', '),
      }),
      ),
    );
  });


  test('Will list all numbers ending with pattern', async () => {
    const pattern = faker.phone.number({ style: 'international' });

    const numbers = Array.from(
      { length: 10 },
      getTestPhoneNumber,
    );

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({searchPattern: 'ends', pattern: pattern, SDK: sdkMock});

    expect(numbersMock).toHaveBeenCalledWith({
      pattern: pattern,
      searchPattern: 2,
      index: 1,
      size: 100,
    });

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      `There are 10 numbers ending with ${pattern}`,
    );

    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledWith(
      numbers.map((number) => ({
        'Country': buildCountryString(number.country),
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Linked Application ID': 'Not linked to any application',
        'Features': number.features.sort().join(', '),
      }),
      ),
    );
  });

  test('Will list the number containg pattern for a country', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const pattern = faker.phone.number({ style: 'international' });

    const numbers = Array.from(
      { length: 1 },
      getTestPhoneNumber,
    );

    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: numbers.length,
      numbers: numbers,
    });

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
      },
    };

    await handler({
      country: country,
      searchPattern: 'contains',
      pattern: pattern,
      SDK: sdkMock,
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
      `There is 1 number in ${getCountryName(country)} containing ${pattern}`,
    );

    expect(console.table).toHaveBeenCalledTimes(1);
    expect(console.table).toHaveBeenCalledWith(
      numbers.map((number) => ({
        'Country': buildCountryString(number.country),
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Linked Application ID': 'Not linked to any application',
        'Features': number.features.sort().join(', '),
      }),
      ),
    );
  });
});
