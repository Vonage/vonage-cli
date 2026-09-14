import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coerceNumber } from '../../src/utils/coerceNumber.js';

test('Utils: coerceNumber', async (ctx) => {
  await ctx.test('Will coerce a number', () => {
    const coerced = coerceNumber('test')('1');
    assert.strictEqual(coerced, 1);
  });

  await ctx.test('Will throw an error if the value is not a number', () => {
    assert.throws(() => coerceNumber('test')('a'), /Invalid number for test: a/);
  });

  await ctx.test('Will throw an error if the value is less than the min', () => {
    assert.throws(() => coerceNumber('test', { min: 2 })('1'), /Number for test must be at least 2: 1/);
  });

  await ctx.test('Will throw an error if the value is greater than the max', () => {
    assert.throws(() => coerceNumber('test', { max: 2 })('3'), /Number for test must be at most 2: 3/);
  });

  await ctx.test('Will return undefined if the value is undefined', () => {
    const coerced = coerceNumber('test')(undefined);
    assert.strictEqual(coerced, undefined);
  });
});
