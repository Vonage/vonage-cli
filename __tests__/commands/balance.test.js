process.env.FORCE_COLOR = 0;
import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { mockConsole } from '../helpers.js';
import YAML from 'yaml';
import { faker } from '@faker-js/faker';
import { handler } from '../../src/commands/balance.js';
import { dumpYesNo } from '../../src/ux/dumpYesNo.js';
import { displayCurrency } from '../../src/ux/locale.js';
import { Client } from '@vonage/server-client';

test('Command: vonage balance', { concurrency: 1 }, async (ctx) => {
  ctx.beforeEach(() => {
    mockConsole();
  });

  await ctx.test('Should output balance', async () => {
    const balance = {
      value: faker.finance.amount(),
      autoReload: faker.datatype.boolean(),
    };

    const balanceMock = mock.fn(() => Promise.resolve(balance));

    const sdkMock = {
      accounts: {
        getBalance: balanceMock,
      },
    };

    await handler({SDK: sdkMock});

    assert.ok(balanceMock.mock.callCount() > 0);
    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `Account balance: ${displayCurrency(balance.value)}`,
      `Auto-refill enabled: ${dumpYesNo(balance.autoReload)}`,
    ].join('\n'), ]);;
  });

  await ctx.test('Should output JSON', async () => {
    const balance = {
      value: faker.finance.amount(),
      autoReload: faker.datatype.boolean(),
    };

    const balanceMock = mock.fn(() => Promise.resolve(balance));

    const sdkMock = {
      accounts: {
        getBalance: balanceMock,
      },
    };

    await handler({SDK: sdkMock, json: true});

    assert.ok(balanceMock.mock.callCount() > 0);
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(balance, true, false),
      null,
      2,
    ), ]);;
  });

  await ctx.test('Should output YAML', async () => {
    const balance = {
      value: faker.finance.amount(),
      autoReload: faker.datatype.boolean(),
    };

    const balanceMock = mock.fn(() => Promise.resolve(balance));

    const sdkMock = {
      accounts: {
        getBalance: balanceMock,
      },
    };

    await handler({SDK: sdkMock, yaml: true});

    assert.ok(balanceMock.mock.callCount() > 0);
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [YAML.stringify(
      Client.transformers.snakeCaseObjectKeys(balance, true, false),
      null,
      2,
    ), ]);;
  });

});
