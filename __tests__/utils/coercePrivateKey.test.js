import { faker } from '@faker-js/faker';

const mockFiles = new Map();
const existsSyncMock = mock.fn((path) => mockFiles.has(path));
const readFileSyncMock = mock.fn((path) => {
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
    existsSyncMock.mock.resetCalls();
    readFileSyncMock.mock.resetCalls();
  });

  test('Will return null if no private key is provided', () => {
    assert.strictEqual(coerceKey('private')(null), null);
  });

  test('Will return the private key if it is valid', () => {
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(128)}\n-----BEGIN PRIVATE KEY-----`;
    assert.strictEqual(coerceKey('private')(privateKey), privateKey);
  });

  test('Will load the private key from a file if it is valid', () => {
    const testPrivateKeyFile = faker.system.filePath();
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(128)}\n-----BEGIN PRIVATE KEY-----`;
    console.log(testPrivateKeyFile);
    mockFiles.set(testPrivateKeyFile, privateKey);
    assert.strictEqual(coerceKey('private')(testPrivateKeyFile), privateKey);
  });

  test('Will return the public key if it is valid', () => {
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(128)}\n-----BEGIN PUBLIC KEY-----`;
    assert.strictEqual(coerceKey('public')(publicKey), publicKey);
  });

  test('Will load the public key from a file if it is valid', () => {
    const testpublicKeyFile = faker.system.filePath();
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(128)}\n-----BEGIN PUBLIC KEY-----`;
    console.log(testpublicKeyFile);
    mockFiles.set(testpublicKeyFile, publicKey);
    assert.strictEqual(coerceKey('public')(testpublicKeyFile), publicKey);
  });

  test('Will throw an error if the private key file does not exist', () => {
    const testPrivateKeyFile = faker.system.filePath();
    assert.throws(() => coerceKey('private')(testPrivateKeyFile), /Key must be a valid key string or a path to a file containing a key/);
  });

  test('Will throw an error if the private key file is invalid', () => {
    const testPrivateKeyFile = faker.system.filePath();
    const privateKey = faker.string.alpha(128);
    mockFiles.set(testPrivateKeyFile, privateKey);
    assert.throws(() => coerceKey('private')(testPrivateKeyFile), /The key file does not contain a valid key string/);
  });
});
