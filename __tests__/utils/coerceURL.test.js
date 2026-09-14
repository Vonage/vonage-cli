import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coerceUrl } from '../../src/utils/coerceUrl.js';

test('Utils: coerceURL', async (ctx) => {
  await ctx.test('Will return null if no URL is provided', () => {
    assert.strictEqual(coerceUrl('some-webhook')(), undefined);
  });

  await ctx.test('Will return the URL if it is valid', () => {
    const url = 'https://www.example.com/';
    assert.strictEqual(coerceUrl('some-webhook')(url), url);
  });

  await ctx.test('Will throw an error if the URL is invalid', () => {
    const url = 'not-a-url';
    assert.throws(() => coerceUrl('some-webhook')(url), /Invalid URL for some-webhook: not-a-url/);
  });
});
