import { jest } from '@jest/globals';
process.env.FORCE_COLOR = 0;
import { mockConsole } from '../helpers.js';
import YAML from 'yaml';
import { faker } from '@faker-js/faker';
import { handler } from '../../src/commands/balance.js';
import { dumpYesNo } from '../../src/ux/dumpYesNo.js';
import { displayCurrency } from '../../src/ux/locale.js';
import { Client } from '@vonage/server-client';

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
