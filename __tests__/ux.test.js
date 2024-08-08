const { dumpValue } = require('../src/ux/dump');
const uxTests = require('./__dataSets__/ux');

describe('UX tests', () => {
  test.each(uxTests)('Will $label', ({ value, expected }) => {
    expect(dumpValue(value)).toEqual(expected);
  });
});
