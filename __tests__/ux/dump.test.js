import { EOL } from 'os';
import { faker } from '@faker-js/faker';
import { dumpValue } from '../../src/ux/dump.js';
import { dumpYesNo, dumpOnOff, dumpEnabledDisabled } from '../../src/ux/dumpYesNo.js';
import { table, defaultBorders } from '../../src/ux/table.js';
import uxTests from '../__dataSets__/ux.js';

describe('UX: dump', () => {
  test.each(uxTests)('Will $label', ({ value, expected }) => {
    assert.deepStrictEqual(dumpValue(value), expected);
  });
});

describe('UX: boolean dump', () => {
  test('Will return Yes or No', () => {
    assert.strictEqual(dumpYesNo(true), '✅ Yes');
    assert.strictEqual(dumpYesNo(false), '❌ No');

    assert.strictEqual(dumpYesNo(true, false), '✅ ');
    assert.strictEqual(dumpYesNo(false, false), '❌ ');
  });

  test('Will return On or Off', () => {
    assert.strictEqual(dumpOnOff(true), 'On');
    assert.strictEqual(dumpOnOff(false), 'Off');
  });

  test('Will return Enabled or Disabled', () => {
    assert.strictEqual(dumpEnabledDisabled(true), '✅ ');
    assert.strictEqual(dumpEnabledDisabled(false), '❌ ');

    assert.strictEqual(dumpEnabledDisabled(true, true), '✅ Enabled');
    assert.strictEqual(dumpEnabledDisabled(false, true), '❌ Disabled');
  });
});

describe('UX: table', () => {
  test('Will return a string', () => {
    const data = [
      {
        id: faker.string.alpha(10),
        desc: faker.string.alpha(10),
      },
      {
        id: faker.string.alpha(10),
        desc: faker.string.alpha(10),
      },
    ];
    const results = table(data);
    assert.strictEqual(results, [
      ' id          desc       ',
      `${defaultBorders.horizontal}`.repeat(24),
      ` ${data[0].id}  ${data[0].desc} `,
      ` ${data[1].id}  ${data[1].desc} `,
    ].join(EOL));
  });
});
