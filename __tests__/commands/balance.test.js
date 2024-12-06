process.env.FORCE_COLOR = 0;
const { mockConsole } = require('../helpers');
const YAML = require('yaml');
const { faker } = require('@faker-js/faker');
const { handler } = require('../../src/commands/balance');
const { dumpYesNo } = require('../../src/ux/dumpYesNo');
const { displayCurrency } = require('../../src/ux/currency');
const { Client } = require('@vonage/server-client');

describe('Command: vonage balance', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Should output balance', async () => {
    const balance = {
      value: faker.finance.amount(),
      autoReload: faker.datatype.boolean(),
    };

    const balanceMock = jest.fn().mockResolvedValue(balance);

    const sdkMock = {
      accounts: {
        getBalance: balanceMock,
      },
    };

    await handler({SDK: sdkMock});

    expect(balanceMock).toHaveBeenCalled();
    expect(console.log).toHaveBeenNthCalledWith(
      2,
      [
        `Account balance: ${displayCurrency(balance.value)}`,
        `Auto-refill enabled: ${dumpYesNo(balance.autoReload)}`,
      ].join('\n'),
    );
  });

  test('Should output JSON', async () => {
    const balance = {
      value: faker.finance.amount(),
      autoReload: faker.datatype.boolean(),
    };

    const balanceMock = jest.fn().mockResolvedValue(balance);

    const sdkMock = {
      accounts: {
        getBalance: balanceMock,
      },
    };

    await handler({SDK: sdkMock, json: true});

    expect(balanceMock).toHaveBeenCalled();
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      JSON.stringify(
        Client.transformers.snakeCaseObjectKeys(balance, true, false),
        null,
        2,
      ),
    );
  });

  test('Should output YAML', async () => {
    const balance = {
      value: faker.finance.amount(),
      autoReload: faker.datatype.boolean(),
    };

    const balanceMock = jest.fn().mockResolvedValue(balance);

    const sdkMock = {
      accounts: {
        getBalance: balanceMock,
      },
    };

    await handler({SDK: sdkMock, yaml: true});

    expect(balanceMock).toHaveBeenCalled();
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      YAML.stringify(
        Client.transformers.snakeCaseObjectKeys(balance, true, false),
        null,
        2,
      ),
    );
  });

});
