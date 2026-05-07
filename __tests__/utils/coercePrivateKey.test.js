import { faker } from '@faker-js/faker';

const mockFiles = new Map();
const existsSyncMock = jest.fn((path) => mockFiles.has(path));
const readFileSyncMock = jest.fn((path) => {
  if (!mockFiles.has(path)) throw new Error(`ENOENT: ${path}`);
  return mockFiles.get(path);
});

const __moduleMocks = {
  'fs': (() => ({
  existsSync: existsSyncMock,
  readFileSync: readFileSyncMock,
}))(),
};




const { coerceKey } = await loadModule(import.meta.url, '../../src/utils/coerceKey.js', __moduleMocks);

describe('Utils: coerce private key', () => {
  beforeEach(() => {
    mockFiles.clear();
    existsSyncMock.mockClear();
    readFileSyncMock.mockClear();
  });

  test('Will return null if no private key is provided', () => {
    expect(coerceKey('private')(null)).toBeNull();
  });

  test('Will return the private key if it is valid', () => {
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(128)}\n-----BEGIN PRIVATE KEY-----`;
    expect(coerceKey('private')(privateKey)).toBe(privateKey);
  });

  test('Will load the private key from a file if it is valid', () => {
    const testPrivateKeyFile = faker.system.filePath();
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(128)}\n-----BEGIN PRIVATE KEY-----`;
    console.log(testPrivateKeyFile);
    mockFiles.set(testPrivateKeyFile, privateKey);
    expect(coerceKey('private')(testPrivateKeyFile)).toBe(privateKey);
  });

  test('Will return the public key if it is valid', () => {
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(128)}\n-----BEGIN PUBLIC KEY-----`;
    expect(coerceKey('public')(publicKey)).toBe(publicKey);
  });

  test('Will load the public key from a file if it is valid', () => {
    const testpublicKeyFile = faker.system.filePath();
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(128)}\n-----BEGIN PUBLIC KEY-----`;
    console.log(testpublicKeyFile);
    mockFiles.set(testpublicKeyFile, publicKey);
    expect(coerceKey('public')(testpublicKeyFile)).toBe(publicKey);
  });

  test('Will throw an error if the private key file does not exist', () => {
    const testPrivateKeyFile = faker.system.filePath();
    expect(() => coerceKey('private')(testPrivateKeyFile)).toThrow('Key must be a valid key string or a path to a file containing a key');
  });

  test('Will throw an error if the private key file is invalid', () => {
    const testPrivateKeyFile = faker.system.filePath();
    const privateKey = faker.string.alpha(128);
    mockFiles.set(testPrivateKeyFile, privateKey);
    expect(() => coerceKey('private')(testPrivateKeyFile)).toThrow('The key file does not contain a valid key string');
  });
});
