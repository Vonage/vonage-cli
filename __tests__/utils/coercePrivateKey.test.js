const { coercePrivateKey } = require('../../src/utils/coercePrivateKey');
const { faker } = require('@faker-js/faker');
const fs = require('fs');

jest.mock('fs');

describe('Utils: coerce private key', () => {
  test('Will return null if no private key is provided', () => {
    expect(coercePrivateKey(null)).toBeNull();
  });

  test('Will return the private key if it is valid', () => {
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(128)}\n-----BEGIN PRIVATE KEY-----`;
    expect(coercePrivateKey(privateKey)).toBe(privateKey);
  });

  test('Will load the private key from a file if it is valid', () => {
    const testPrivateKeyFile = faker.system.filePath();
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(128)}\n-----BEGIN PRIVATE KEY-----`;
    console.log(testPrivateKeyFile);
    fs.__addFile(testPrivateKeyFile, privateKey);
    expect(coercePrivateKey(testPrivateKeyFile)).toBe(privateKey);
  });

  test('Will throw an error if the private key file does not exist', () => {
    const testPrivateKeyFile = faker.system.filePath();
    expect(() => coercePrivateKey(testPrivateKeyFile)).toThrow('Private key must be a valid key string or a path to a file containing a private key');
  });

  test('Will throw an error if the private key file is invalid', () => {
    const testPrivateKeyFile = faker.system.filePath();
    const privateKey = faker.string.alpha(128);
    fs.__addFile(testPrivateKeyFile, privateKey);
    expect(() => coercePrivateKey(testPrivateKeyFile)).toThrow('The private key file does not contain a valid private key string');
  });

});
