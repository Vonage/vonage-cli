const { coerceUrl } = require('../../src/utils/coerceUrl');

describe('Utils: coerceURL', () => {
  test('Will return null if no URL is provided', () => {
    expect(coerceUrl('some-webhook')()).toBeUndefined();
  });

  test('Will return the URL if it is valid', () => {
    const url = 'https://www.example.com/';
    expect(coerceUrl('some-webhook')(url)).toBe(url);
  });

  test('Will throw an error if the URL is invalid', () => {
    const url = 'not-a-url';
    expect(() => coerceUrl('some-webhook')(url)).toThrow('Invalid URL for some-webhook: not-a-url');
  });
});
