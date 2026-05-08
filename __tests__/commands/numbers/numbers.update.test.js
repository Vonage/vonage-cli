import { faker } from '@faker-js/faker';
import { typeLabels } from '../../../src/numbers/types.js';
import { countryCodes, displayCurrency, buildCountryString } from '../../../src/ux/locale.js';
import { getTestPhoneNumber } from '../../numbers.js';

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const __moduleMocks = {
  'yargs': (() => ({
    default: yargs,
  }))(),
};




const { handler } = await loadModule(import.meta.url, '../../../src/commands/numbers/update.js', __moduleMocks);
import { mockConsole } from '../../helpers.js';

describe('Command: numbers update', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    exitMock.mock.resetCalls();
    yargs.mock.resetCalls();
  });

  test('Will update number', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };


    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: 1,
      numbers: [testNumber],
    }));

    const updateNumberMock = mock.fn();
    updateNumberMock.mock.mockImplementationOnce(() => Promise.resolve({
      errorCode: '200',
      errorStatus: 'success',
    }));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateNumberMock,
      },
    };

    const voiceCallbackValue = faker.internet.url();
    const voiceCallbackType = faker.helpers.arrayElements(['app', 'sip', 'tel'])[0];
    const voiceStatusCallbackUrl = faker.internet.url();

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
      voiceCallbackValue,
      voiceCallbackType,
      voiceStatusCallback: voiceStatusCallbackUrl,
    });

    assertCalledWith(numbersMock, {
      country: country,
      index: 1,
      size: 1,
      searchPattern: 1,
      pattern: testNumber.msisdn,
    });

    assertCalledWith(updateNumberMock, {
      ...testNumber,
      voiceCallbackValue,
      voiceCallbackType,
      voiceStatusCallback: voiceStatusCallbackUrl,
    });

    assert.strictEqual(exitMock.mock.callCount(), 0);

    assertNthCalledWith(console.log, 3, 'Number updated successfully');

    assertNthCalledWith(
      console.log,
      5,
      [
        `Number: ${testNumber.msisdn}`,
        `Country: ${buildCountryString(testNumber.country)}`,
        `Type: ${typeLabels[testNumber.type]}`,
        `Features: ${testNumber.features.join(', ')}`,
        `Monthly Cost: ${displayCurrency(testNumber.cost)}`,
        `Setup Cost: ${displayCurrency(testNumber.initialPrice)}`,
        'Linked Application ID: Not linked to any application',
        `Voice Callback: ${voiceCallbackType}`,
        `Voice Callback Value: ${voiceCallbackValue}`,
        `Voice Status Callback: ${voiceStatusCallbackUrl}`,
      ].join('\n'),
    );
  });

  test('Will not update number when not found', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };


    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve(undefined));

    const updateNumberMock = mock.fn();

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateNumberMock,
      },
    };

    const voiceCallbackValue = faker.internet.url();
    const voiceCallbackType = faker.helpers.arrayElements(['app', 'sip', 'tel'])[0];
    const voiceStatusCallbackUrl = faker.internet.url();

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
      voiceCallbackValue,
      voiceCallbackType,
      voiceStatusCallback: voiceStatusCallbackUrl,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.strictEqual(updateNumberMock.mock.callCount(), 0);
    assertCalledWith(exitMock, 44);
  });

  test('Will handle SDK error', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };


    const numbersMock = mock.fn();
    numbersMock.mock.mockImplementationOnce(() => Promise.resolve({
      count: 1,
      numbers: [testNumber],
    }));

    const updateNumberMock = mock.fn();
    updateNumberMock.mock.mockImplementationOnce(() => Promise.reject(new Error('SDK error')));

    const sdkMock = {
      numbers: {
        getOwnedNumbers: numbersMock,
        updateNumber: updateNumberMock,
      },
    };

    const voiceCallbackValue = faker.internet.url();
    const voiceCallbackType = faker.helpers.arrayElements(['app', 'sip', 'tel'])[0];
    const voiceStatusCallbackUrl = faker.internet.url();

    await handler({
      country: country,
      msisdn: testNumber.msisdn,
      SDK: sdkMock,
      voiceCallbackValue,
      voiceCallbackType,
      voiceStatusCallback: voiceStatusCallbackUrl,
    });

    assert.ok(numbersMock.mock.callCount() > 0);
    assert.ok(updateNumberMock.mock.callCount() > 0);
    assertCalledWith(exitMock, 99);
  });
});
