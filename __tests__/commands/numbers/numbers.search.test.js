import { faker } from '@faker-js/faker';
import yaml from 'yaml';
import { typeLabels } from '../../../src/numbers/types.js';
import { countryCodes, getCountryName, displayCurrency } from '../../../src/ux/locale.js';
import { getTestPhoneNumber } from '../../numbers.js';
import { Client } from '@vonage/server-client';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const __moduleMocks = {
  'yargs': (() => ({
    default: yargs,
  }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/numbers/search.js', __moduleMocks);
import { mockConsole } from '../../helpers.js';

describe('Command: vonage numbers search', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
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

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

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

    assertCalledWith(numbersMock, {
      country: country,
      index: 1,
      size: 100,
    });

    assertNthCalledWith(
      console.log,
      2,
      `There are 100 numbers available for purchase in ${getCountryName(country)}`,
    );

    assert.strictEqual(console.table.mock.callCount(), 1);
    assertCalledWith(
      console.table,
      numbers.map((number) => ({
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Features': number.features.sort().join(', '),
        'Monthly Cost': displayCurrency(number.cost),
        'Setup Cost': displayCurrency(number.initialPrice),
      }),
      ),
    );
  });

  test('Will not list numbers when there are none', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];
    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({}));

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

    assert.strictEqual(numbersMock.mock.callCount(), 1);

    assertCalledWith(numbersMock, {
      country: country,
      index: 1,
      size: 100,
    });

    assertNthCalledWith(
      console.log,
      2,
      `There are no matching numbers available for purchase in ${getCountryName(country)}`,
    );

    assertNthCalledWith(
      console.log,
      3,
      'Try to broaden your search criteria',
    );

    assert.strictEqual(console.table.mock.callCount(), 0);
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

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

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

    assertCalledWith(
      console.log,
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
    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
    }));

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

    assertCalledWith(console.log, '[]');
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

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

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

    assertCalledWith(
      console.log,
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
    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
    }));

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

    assertCalledWith(console.log, '[]\n');
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

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

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

    assertCalledWith(numbersMock, {
      country: country,
      pattern: pattern,
      searchPattern: 1,
      index: 1,
      size: 100,
    });

    assertNthCalledWith(
      console.log,
      2,
      `There are 10 numbers available for purchase in ${getCountryName(country)} containing ${pattern}`,
    );

    assert.strictEqual(console.table.mock.callCount(), 1);
    assertCalledWith(
      console.table,
      numbers.map((number) => ({
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Features': number.features.sort().join(', '),
        'Monthly Cost': displayCurrency(number.cost),
        'Setup Cost': displayCurrency(number.initialPrice),
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

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

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

    assertCalledWith(numbersMock, {
      country: country,
      pattern: pattern,
      searchPattern: 0,
      index: 1,
      size: 100,
    });

    assertNthCalledWith(
      console.log,
      2,
      `There are 10 numbers available for purchase in ${getCountryName(country)} starting with ${pattern}`,
    );

    assert.strictEqual(console.table.mock.callCount(), 1);
    assertCalledWith(
      console.table,
      numbers.map((number) => ({
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Features': number.features.sort().join(', '),
        'Monthly Cost': displayCurrency(number.cost),
        'Setup Cost': displayCurrency(number.initialPrice),
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

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

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

    assertCalledWith(numbersMock, {
      country: country,
      pattern: pattern,
      searchPattern: 2,
      index: 1,
      size: 100,
    });

    assertNthCalledWith(
      console.log,
      2,
      `There is 1 number available for purchase in ${getCountryName(country)} ending with ${pattern}`,
    );

    assert.strictEqual(console.table.mock.callCount(), 1);
    assertCalledWith(
      console.table,
      numbers.map((number) => ({
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Features': number.features.sort().join(', '),
        'Monthly Cost': displayCurrency(number.cost),
        'Setup Cost': displayCurrency(number.initialPrice),
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

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

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

    assertCalledWith(numbersMock, {
      type: 'mobile-lvn',
      country: country,
      pattern: pattern,
      searchPattern: 2,
      index: 1,
      size: 100,
    });

    assertNthCalledWith(
      console.log,
      2,
      `There is 1 Mobile number available for purchase in ${getCountryName(country)} ending with ${pattern}`,
    );

    assert.strictEqual(console.table.mock.callCount(), 1);
    assertCalledWith(
      console.table,
      numbers.map((number) => ({
        'Number': number.msisdn,
        'Features': number.features.sort().join(', '),
        'Monthly Cost': displayCurrency(number.cost),
        'Setup Cost': displayCurrency(number.initialPrice),
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

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

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

    assertCalledWith(numbersMock, {
      features: 'MMS',
      country: country,
      pattern: pattern,
      searchPattern: 2,
      index: 1,
      size: 100,
    });

    assertNthCalledWith(
      console.log,
      2,
      `There is 1 number available for purchase in ${getCountryName(country)} ending with ${pattern} having the MMS feature`,
    );

    assert.strictEqual(console.table.mock.callCount(), 1);
    assertCalledWith(
      console.table,
      numbers.map((number) => ({
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Features': number.features.sort().join(', '),
        'Monthly Cost': displayCurrency(number.cost),
        'Setup Cost': displayCurrency(number.initialPrice),
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

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

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

    assertCalledWith(numbersMock, {
      features: 'MMS,SMS,VOICE',
      country: country,
      pattern: pattern,
      searchPattern: 2,
      index: 1,
      size: 100,
    });

    assertNthCalledWith(
      console.log,
      2,
      `There is 1 number available for purchase in ${getCountryName(country)} ending with ${pattern} having the MMS, SMS, VOICE features`,
    );

    assert.strictEqual(console.table.mock.callCount(), 1);
    assertCalledWith(
      console.table,
      numbers.map((number) => ({
        'Number': number.msisdn,
        'Type': typeLabels[number.type],
        'Features': number.features.sort().join(', '),
        'Monthly Cost': displayCurrency(number.cost),
        'Setup Cost': displayCurrency(number.initialPrice),
      }),
      ),
    );
  });
});
