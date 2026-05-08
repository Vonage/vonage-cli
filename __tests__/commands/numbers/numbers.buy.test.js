import { faker } from '@faker-js/faker';
import yaml from 'yaml';
import { typeLabels } from '../../../src/numbers/types.js';
import { countryCodes, displayCurrency, buildCountryString } from '../../../src/ux/locale.js';
import { getTestPhoneNumber } from '../../numbers.js';
import { Client } from '@vonage/server-client';

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

const { handler } = await loadModule(import.meta.url, '../../../src/commands/numbers/buy.js', __moduleMocks);
import { mockConsole } from '../../helpers.js';

describe('Command: numbers buy', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
    confirm.mock.resetCalls();
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

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const buyNumberMock = mock.fn();
    buyNumberMock.mock.mockImplementationOnce(() => Promise.resolve({
      errorCode: '200',
      errorStatus: 'success',
    }));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
    });

    assertCalledWith(numbersMock, {
      country: country,
      size: 1,
      searchPattern: 1,
      pattern: testNumber.msisdn,
    });

    assertCalledWith(buyNumberMock, {
      country: country,
      msisdn: testNumber.msisdn,
    });

    assert.strictEqual(exitMock.mock.callCount(), 0);

    assertNthCalledWith(console.log, 2, `Number ${testNumber.msisdn} purchased`);

    assertNthCalledWith(
      console.log,
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

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const buyNumberMock = mock.fn();
    buyNumberMock.mock.mockImplementationOnce(() => Promise.resolve({
      errorCode: '200',
      errorStatus: 'success',
    }));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
      json: true,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.ok(buyNumberMock.mock.callCount() > 0);

    assertNthCalledWith(
      console.log,
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

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const buyNumberMock = mock.fn();
    buyNumberMock.mock.mockImplementationOnce(() => Promise.resolve({
      errorCode: '200',
      errorStatus: 'success',
    }));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
      yaml: true,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.ok(buyNumberMock.mock.callCount() > 0);
    assert.strictEqual(exitMock.mock.callCount(), 0);

    assertNthCalledWith(
      console.log,
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

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const buyNumberMock = mock.fn();

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mock.mockImplementationOnce(() => Promise.resolve(false));

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(buyNumberMock.mock.callCount(), 0);
    assert.strictEqual(exitMock.mock.callCount(), 0);
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

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
      numbers: numbers,
    }));

    const buyNumberMock = mock.fn();
    buyNumberMock.mock.mockImplementationOnce(() => Promise.reject(new Error('SDK Error')));

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mock.mockImplementationOnce(() => Promise.resolve(true));

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.ok(buyNumberMock.mock.callCount() > 0);
    assertCalledWith(exitMock, 99);
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

    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: numbers.length,
    }));

    const buyNumberMock = mock.fn();

    const sdkMock = {
      numbers: {
        getAvailableNumbers: numbersMock,
        buyNumber: buyNumberMock,
      },
    };

    confirm.mock.mockImplementationOnce(() => Promise.resolve(false));

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(buyNumberMock.mock.callCount(), 0);
    assertCalledWith(exitMock, 44);
  });
});
