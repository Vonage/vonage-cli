process.env.NO_COLOR = true;

import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { EOL } from 'os';
import {
  dumpKey,
  dumpValue,
  dumpObject,
  dumpArray,
  dumpCommand,
} from '../../src/ux/dump.js';
import {
  dumpBoolean,
  dumpYesNo,
  dumpOnOff,
  dumpEnabledDisabled,
  dumpValidInvalid,
  dumpOffOrValue,
} from '../../src/ux/dumpYesNo.js';
import { descriptionList } from '../../src/ux/descriptionList.js';
import { indentLines } from '../../src/ux/indentLines.js';
import {
  buildCountryString,
  coerceCountry,
  displayCurrency,
  displayDate,
  getCountryFlag,
  getCountryName,
} from '../../src/ux/locale.js';
import uxTests from '../__dataSets__/ux.js';
import { mockConsole } from '../helpers.js';

test('UX: dump', async (ctx) => {
  ctx.beforeEach(() => {
    mockConsole();
  });

  await test('UX: dump', async (ctx) => {

    for (const { label, value, expected } of uxTests) {
      await ctx.test(`Will ${label}`, () => {
        assert.deepEqual(dumpValue(value), expected);
      });
    }
  });

  await test('UX: boolean dump', async (ctx) => {
    ctx.beforeEach(() => {
      mockConsole();
    });

    process.env.NO_COLOR = true;
    await ctx.test('Will return a custom boolean string', () => {
      assert.strictEqual(
        dumpBoolean({
          value: true,
          trueWord: 'Valid',
          falseWord: 'Invalid',
          includeText: true,
          noEmoji: true,
        }),
        'Valid',
      );
    });

    await ctx.test('Will return Yes or No', () => {
      assert.strictEqual(dumpYesNo(true), '✅ Yes');
      assert.strictEqual(dumpYesNo(false), '❌ No');

      assert.strictEqual(dumpYesNo(true, false), '✅ ');
      assert.strictEqual(dumpYesNo(false, false), '❌ ');
    });

    await ctx.test('Will return On or Off', () => {
      assert.strictEqual(dumpOnOff(true), 'On');
      assert.strictEqual(dumpOnOff(false), 'Off');
    });

    await ctx.test('Will return Enabled or Disabled', () => {
      assert.strictEqual(dumpEnabledDisabled(true), '✅ ');
      assert.strictEqual(dumpEnabledDisabled(false), '❌ ');

      assert.strictEqual(dumpEnabledDisabled(true, true), '✅ Enabled');
      assert.strictEqual(dumpEnabledDisabled(false, true), '❌ Disabled');
    });

    await ctx.test('Will return Valid or Invalid', () => {
      assert.strictEqual(dumpValidInvalid(true), '✅ ');
      assert.strictEqual(dumpValidInvalid(false, true), '❌ Invalid');
    });

    await ctx.test('Will return Off or the provided value', () => {
      assert.strictEqual(dumpOffOrValue(false), 'Off');
      assert.strictEqual(dumpOffOrValue('secret'), 'secret');
    });
  });

  await test('UX: formatting helpers', async (ctx) => {

    await ctx.test('Will format keys and commands', () => {
      assert.strictEqual(dumpKey('api-key'), 'api-key');
      assert.strictEqual(dumpCommand('vonage apps list'), 'vonage apps list');
    });

    await ctx.test('Will format nested objects and arrays', () => {
      assert.strictEqual(
        dumpObject({
          count: 2,
          nested: { name: 'Alice' },
          items: [1, null, { ok: true }],
          missing: null,
          big: 10n,
        }),
        [
          '{',
          '  count: 2',
          '  nested: {',
          '    name: Alice',
          '  }',
          '  items: [',
          '    1',
          '    Not Set',
          '    {',
          '      ok: true',
          '    }',
          '  ]',
          '  missing: Not Set',
          '  big: 10',
          '}',
        ].join(EOL),
      );

      assert.strictEqual(
        dumpArray(['a', 2, null]),
        [
          '[',
          '  a',
          '  2',
          '  Not Set',
          ']',
        ].join(EOL),
      );
    });

    await ctx.test('Will describe nested objects with a custom formatter', () => {
      assert.strictEqual(
        descriptionList(
          {
            meta: {
              tags: ['a', 'b'],
              ttl: 0,
            },
            empty: null,
          },
          {
            detailFormatter: (value, term) => `<${term}:${value}>`,
          },
        ),
        [
          'meta: {',
          'tags: [',
          '  <:a>',
          '  <:b>',
          ']',
          'ttl: <ttl:0>',
          '}',
          'empty: <empty:Not Set>',
        ].join(EOL),
      );
    });

    await ctx.test('Will indent each line in a string', () => {
      assert.strictEqual(indentLines('a\nb', 4), '    a\n    b');
      assert.strictEqual(indentLines('', 4), '');
    });
  });

  await test('UX: locale', async (ctx) => {
    await ctx.test('Will build and validate country values', () => {
      assert.strictEqual(coerceCountry('us'), 'US');
      assert.strictEqual(buildCountryString('US'), `${getCountryFlag('US')}${getCountryName('US')}`);
      assert.throws(() => coerceCountry('not-a-country'), /Invalid country code/);
    });

    await ctx.test('Will format dates and currency safely', () => {
      assert.strictEqual(displayDate(null), null);
      assert.notStrictEqual(displayDate('2024-01-01T00:00:00.000Z'), null);
      assert.strictEqual(displayCurrency('not-a-number'), undefined);
      assert.notStrictEqual(displayCurrency(1.5, 'EUR'), undefined);
    });
  });

  await test('UX: progress', async (ctx) => {
    const oldStderrWrite = process.stderr.write;

    ctx.afterEach(() => {
      process.stderr.write = oldStderrWrite;
    });

    await ctx.test('Will validate progress options', async () => {
      const { progress } = await import('../../src/ux/progress.js');

      assert.throws(() => progress({}), /message is required/);
      assert.throws(() => progress({ message: 'Loading', arrowChar: '->' }), /arrowChar must be a single character/);
      assert.throws(() => progress({ message: 'Loading', completedChar: '==' }), /completedChar must be a single character/);
      assert.throws(() => progress({ message: 'Loading', remainingChar: '..' }), /remainingChar must be a single character/);
      assert.throws(() => progress({ message: 'Loading', openChar: '[[' }), /openChar must be a single character/);
      assert.throws(() => progress({ message: 'Loading', closeChar: ']]' }), /closeChar must be a single character/);
      assert.throws(() => progress({ message: 'This message is too long', columns: 20 }), /message is too long for the terminal width/);
    });

    await ctx.test('Will render progress and finish', async () => {
      process.stderr.write = mock.fn();
      const { progress } = await import('../../src/ux/progress.js');

      const bar = progress({ message: 'Loading', columns: 40 });
      bar.setTotalSteps(4);
      bar.increment();
      bar.finished();

      assert.strictEqual(process.stderr.write.mock.calls[0].arguments[0], 'Loading');
      assert.strictEqual(process.stderr.write.mock.calls[1].arguments[0], '\rLoading [...................] 0/4 0%');
      assert.strictEqual(process.stderr.write.mock.calls[2].arguments[0], '\rLoading [=====>.............] 1/4 25%');
      assert.strictEqual(process.stderr.write.mock.calls[3].arguments[0], '\rLoading [===================] 4/4 100%');
      assert.strictEqual(process.stderr.write.mock.calls[4].arguments[0], '\n');
    });

    await ctx.test('Will hide steps and percentage when requested', async () => {
      process.stderr.write = mock.fn();
      const { progress } = await import('../../src/ux/progress.js');

      const bar = progress({
        message: 'Loading',
        columns: 30,
        showSteps: false,
        showPercentage: false,
      });
      bar.setTotalSteps(2);
      bar.increment();

      assert.ok(process.stderr.write.mock.calls[1].arguments[0].includes('['));
      assert.ok(!process.stderr.write.mock.calls[1].arguments[0].includes('0/2'));
      assert.ok(!process.stderr.write.mock.calls[1].arguments[0].includes('%'));
    });
  });

  await test('UX: truncate', async (ctx) => {
    let terminalWidth;
    ctx.mock.module('../../src/ux/getTerminalWidth.js', {
      namedExports: { getTerminalWidth: () => terminalWidth },
    });

    await ctx.test('Will truncate long messages to the terminal width', async () => {
      terminalWidth = 6;
      const { truncateToTerminal } = await import('../../src/ux/truncateToTerminal.js?truncate');

      assert.strictEqual(truncateToTerminal('abcdef'), 'abcd…');
      assert.strictEqual(truncateToTerminal('abc'), 'abc');
    });

    await ctx.test('Will return an empty string when no characters fit', async () => {
      terminalWidth = 1;
      const { truncateToTerminal } = await import('../../src/ux/truncateToTerminal.js?empty');

      assert.strictEqual(truncateToTerminal('abcdef'), '');
    });
  });
});
