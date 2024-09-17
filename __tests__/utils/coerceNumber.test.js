const { coerceNumber } = require('../../src/utils/coerceNumber');

describe('Utils: coerceNumber', () => {
  test('Will coerce a number', () => {
    const coerced = coerceNumber('test')('1');
    expect(coerced).toBe(1);
  });

  test('Will throw an error if the value is not a number', () => {
    expect(() => coerceNumber('test')('a')).toThrow('Invalid number for test: a');
  });

  test('Will throw an error if the value is less than the min', () => {
    expect(() => coerceNumber('test', { min: 2 })('1')).toThrow('Number for test must be at least 2: 1');
  });

  test('Will throw an error if the value is greater than the max', () => {
    expect(() => coerceNumber('test', { max: 2 })('3')).toThrow('Number for test must be at most 2: 3');
  });

  test('Will return undefined if the value is undefined', () => {
    const coerced = coerceNumber('test')(undefined);
    expect(coerced).toBeUndefined();
  });
});
