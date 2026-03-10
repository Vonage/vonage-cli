import { jest, describe, test, beforeEach, afterEach, expect } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { typeLabels } from '../../../src/numbers/types.js';
import { countryCodes, displayCurrency, buildCountryString } from '../../../src/ux/locale.js';
import { getTestPhoneNumber } from '../../numbers.js';

const exitMock = jest.fn();
const yargs = jest.fn().mockImplementation(() => ({ exit: exitMock }));

jest.unstable_mockModule('yargs', () => ({
  default: yargs,
}));

const { handler } = await import('../../../src/commands/numbers/update.js');
import { mockConsole } from '../../helpers.js';

describe('Command: numbers update', () => {
  beforeEach(() => {
    mockConsole();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Will update number', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };


    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: 1,
      numbers: [testNumber],
    });

    const updateNumberMock = jest.fn().mockResolvedValueOnce({
      errorCode: '200',
      errorStatus: 'success',
    });

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

    expect(numbersMock).toHaveBeenCalledWith({
      country: country,
      index: 1,
      size: 1,
      searchPattern: 1,
      pattern: testNumber.msisdn,
    });

    expect(updateNumberMock).toHaveBeenCalledWith({
      ...testNumber,
      voiceCallbackValue,
      voiceCallbackType,
      voiceStatusCallback: voiceStatusCallbackUrl,
    });

    expect(exitMock).not.toHaveBeenCalled();

    expect(console.log).toHaveBeenNthCalledWith(
      3,
      'Number updated successfully',
    );

    expect(console.log).toHaveBeenNthCalledWith(
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


    const numbersMock = jest.fn().mockResolvedValueOnce();

    const updateNumberMock = jest.fn();

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

    expect(numbersMock).toHaveBeenCalled();
    expect(updateNumberMock).not.toHaveBeenCalled();
    expect(exitMock).toHaveBeenCalledWith(44);
  });

  test('Will handle SDK error', async () => {
    const country = faker.helpers.shuffle(countryCodes)[0];

    const testNumber = {
      ...getTestPhoneNumber(),
      country: country,
      cost: faker.commerce.price(),
      initialPrice: faker.commerce.price(),
    };


    const numbersMock = jest.fn().mockResolvedValueOnce({
      count: 1,
      numbers: [testNumber],
    });

    const updateNumberMock = jest.fn().mockRejectedValueOnce(new Error('SDK error'));

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

    expect(numbersMock).toHaveBeenCalled();
    expect(updateNumberMock).toHaveBeenCalled();
    expect(exitMock).toHaveBeenCalledWith(99);
  });
});
