process.env.FORCE_COLOR = 0;
const yargs = require('yargs');
const { faker } = require('@faker-js/faker');
const { handler } = require('../../../src/commands/numbers/update');
const { typeLabels } = require('../../../src/numbers/types');
const { mockConsole } = require('../../helpers');
const { countryCodes, buildCountryString } = require('../../../src/utils/countries');
const { getTestPhoneNumber } = require('../../numbers');

jest.mock('yargs');

describe('Command: numbers update', () => {
  beforeEach(() => {
    mockConsole();
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

    expect(yargs.exit).not.toHaveBeenCalled();

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
        `Monthly Cost: €${testNumber.cost}`,
        `Setup Cost: €${testNumber.initialPrice}`,
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
    expect(yargs.exit).toHaveBeenCalledWith(44);
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
    expect(yargs.exit).toHaveBeenCalledWith(99);
  });
});
