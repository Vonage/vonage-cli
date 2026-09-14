import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { faker } from '@faker-js/faker';

test('Utils: coerce private key', async (ctx) => {
  const mockFiles = new Map();
  const existsSyncMock = mock.fn((path) => mockFiles.has(path));
  const readFileSyncMock = mock.fn((path) => {
    if (!mockFiles.has(path)) throw new Error(`ENOENT: ${path}`);
    return mockFiles.get(path);
  });

  ctx.mock.module('fs', {
    namedExports: {
      existsSync: existsSyncMock,
      readFileSync: readFileSyncMock,
    },
  });

  const { coerceKey } = await import('../../src/utils/coerceKey.js');

  ctx.beforeEach(() => {
    mockFiles.clear();
    existsSyncMock.mock.resetCalls();
    readFileSyncMock.mock.resetCalls();
  });

  await ctx.test('Will return null if no private key is provided', () => {
    assert.strictEqual(coerceKey('private')(null), null);
  });

  await ctx.test('Will return the private key if it is valid', () => {
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(128)}\n-----BEGIN PRIVATE KEY-----`;
    assert.strictEqual(coerceKey('private')(privateKey), privateKey);
  });

  await ctx.test('Will load the private key from a file if it is valid', () => {
    const testPrivateKeyFile = faker.system.filePath();
    const privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(128)}\n-----BEGIN PRIVATE KEY-----`;
    mockFiles.set(testPrivateKeyFile, privateKey);
    assert.strictEqual(coerceKey('private')(testPrivateKeyFile), privateKey);
  });

  await ctx.test('Will return the public key if it is valid', () => {
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(128)}\n-----BEGIN PUBLIC KEY-----`;
    assert.strictEqual(coerceKey('public')(publicKey), publicKey);
  });

  await ctx.test('Will load the public key from a file if it is valid', () => {
    const testPublicKeyFile = faker.system.filePath();
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(128)}\n-----BEGIN PUBLIC KEY-----`;
    mockFiles.set(testPublicKeyFile, publicKey);
    assert.strictEqual(coerceKey('public')(testPublicKeyFile), publicKey);
  });

  await ctx.test('Will throw an error if the private key file does not exist', () => {
    const testPrivateKeyFile = faker.system.filePath();
    assert.throws(() => coerceKey('private')(testPrivateKeyFile), /Key must be a valid key string or a path to a file containing a key/);
  });

  await ctx.test('Will throw an error if the private key file is invalid', () => {
    const testPrivateKeyFile = faker.system.filePath();
    const privateKey = faker.string.alpha(128);
    mockFiles.set(testPrivateKeyFile, privateKey);
    assert.throws(() => coerceKey('private')(testPrivateKeyFile), /The key file does not contain a valid key string/);
  });
});
