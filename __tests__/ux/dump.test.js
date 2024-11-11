const { faker } = require('@faker-js/faker');
const { dumpValue, dumpKey } = require('../../src/ux/dump');
const { descriptionList } = require('../../src/ux/descriptionList');
const { dumpYesNo, dumpOnOff, dumpEnabledDisabled } = require('../../src/ux/dumpYesNo');
const { table } = require('../../src/ux/table');
const uxTests = require('../__dataSets__/ux');

describe('UX: dump', () => {
  test.each(uxTests)('Will $label', ({ value, expected }) => {
    expect(dumpValue(value)).toEqual(expected);
  });
});

describe('UX: description list', () => {
  test('Will return a string', () => {
    expect(descriptionList([
      ['term', 'details'],
      ['foo', 'bar'],
    ])).toBe(`${dumpKey('term')}: ${dumpValue('details')}\n${dumpKey('foo')}: ${dumpValue('bar')}`);
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
    const results = table(data).split('\n');
    expect(results).toHaveLength(5);

    expect(results[0]).toBe('id          desc      ');
    expect(results[1]).toBe('----------  ----------');
    expect(results[2]).toBe(`${data[0].id}  ${data[0].desc}`);
    expect(results[3]).toBe(`${data[1].id}  ${data[1].desc}`);
  });
});
