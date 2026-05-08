import { coerceUrl } from '../../src/utils/coerceUrl.js';

describe('Utils: coerceURL', () => {
  test('Will return null if no URL is provided', () => {
    assert.strictEqual(coerceUrl('some-webhook')(), undefined);
  });

  test('Will return the URL if it is valid', () => {
    const url = 'https://www.example.com/';
    assert.strictEqual(coerceUrl('some-webhook')(url), url);
  });

  test('Will throw an error if the URL is invalid', () => {
    const url = 'not-a-url';
    assert.throws(() => coerceUrl('some-webhook')(url), /Invalid URL for some-webhook: not-a-url/);
  });
});
