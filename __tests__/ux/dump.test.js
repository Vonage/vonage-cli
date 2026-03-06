import { EOL } from 'os';
import { faker } from '@faker-js/faker';
import { dumpValue } from '../../src/ux/dump.js';
import { dumpYesNo, dumpOnOff, dumpEnabledDisabled } from '../../src/ux/dumpYesNo.js';
import { table, defaultBorders } from '../../src/ux/table.js';
import uxTests from '../__dataSets__/ux.js';

describe('UX: dump', () => {
  test.each(uxTests)('Will $label', ({ value, expected }) => {
    expect(dumpValue(value)).toEqual(expected);
  });
});

describe('UX: boolean dump', () => {
  test('Will return Yes or No', () => {
    expect(dumpYesNo(true)).toBe('✅ Yes');
    expect(dumpYesNo(false)).toBe('❌ No');

    expect(dumpYesNo(true, false)).toBe('✅ ');
    expect(dumpYesNo(false, false)).toBe('❌ ');
  });

  test('Will return On or Off', () => {
    expect(dumpOnOff(true)).toBe('On');
    expect(dumpOnOff(false)).toBe('Off');
  });

  test('Will return Enabled or Disabled', () => {
    expect(dumpEnabledDisabled(true)).toBe('✅ ');
    expect(dumpEnabledDisabled(false)).toBe('❌ ');

    expect(dumpEnabledDisabled(true, true)).toBe('✅ Enabled');
    expect(dumpEnabledDisabled(false, true)).toBe('❌ Disabled');
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
    expect(results).toBe([
      ' id          desc       ',
      `${defaultBorders.horizontal}`.repeat(24),
      ` ${data[0].id}  ${data[0].desc} `,
      ` ${data[1].id}  ${data[1].desc} `,
    ].join(EOL));
  });
});
