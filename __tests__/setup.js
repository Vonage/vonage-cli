import assert from 'node:assert/strict';
import {
  after,
  afterEach,
  before,
  beforeEach,
  describe as nodeDescribe,
  mock,
  test as nodeTest,
} from 'node:test';
import esmock from 'esmock';
import { fileURLToPath } from 'node:url';

process.env.FORCE_COLOR = 0;
process.env.LC_ALL = 'en_UK.UTF-8';

// ---------------------------------------------------------------------------
// Module loading helper (backed by esmock)
// ---------------------------------------------------------------------------

const modulePath = (baseUrl, relativePath) => fileURLToPath(new URL(relativePath, baseUrl));

const normalizeMocks = (baseUrl, mocks) => Object.fromEntries(
  Object.entries(mocks).map(([key, value]) => (
    key.startsWith('.')
      ? [modulePath(baseUrl, key), value]
      : [key, value]
  )),
);

const loadModule = async (baseUrl, relativeModuleId, childmocks = {}, globalmocks = {}) => {
  const normalizedChildMocks = normalizeMocks(baseUrl, childmocks);
  return esmock(
    modulePath(baseUrl, relativeModuleId),
    normalizedChildMocks,
    {
      ...normalizedChildMocks,
      ...normalizeMocks(baseUrl, globalmocks),
    },
  );
};

// ---------------------------------------------------------------------------
// Mock-assertion helpers
// Complement node:assert for common "was this mock called?" patterns.
// ---------------------------------------------------------------------------

/**
 * Assert that `fn` was called at least once with the given arguments
 * (deep-equality check, matching any call).
 */
const assertCalledWith = (fn, ...expected) => {
  const calls = fn.mock.calls.map((c) => c.arguments);
  const matched = calls.some((args) => {
    try {
      assert.deepStrictEqual(args, expected);
      return true;
    } catch {
      return false;
    }
  });
  assert.ok(
    matched,
    `Expected mock to have been called with ${JSON.stringify(expected)}, actual calls: ${JSON.stringify(calls)}`,
  );
};

/**
 * Assert that `fn` was never called with the given arguments.
 */
const assertNotCalledWith = (fn, ...expected) => {
  const calls = fn.mock.calls.map((c) => c.arguments);
  const matched = calls.some((args) => {
    try {
      assert.deepStrictEqual(args, expected);
      return true;
    } catch {
      return false;
    }
  });
  assert.ok(
    !matched,
    `Expected mock NOT to have been called with ${JSON.stringify(expected)}`,
  );
};

/**
 * Assert that the nth call (1-based) to `fn` used the given arguments.
 */
const assertNthCalledWith = (fn, n, ...expected) => {
  const call = fn.mock.calls[n - 1];
  assert.ok(call, `Expected mock to have been called at least ${n} time(s), got ${fn.mock.callCount()}`);
  assert.deepStrictEqual(call.arguments, expected);
};

// ---------------------------------------------------------------------------
// test / describe wrappers that add .each() support
// ---------------------------------------------------------------------------

const formatName = (template, value) => {
  if (template.includes('%s')) {
    return template.replace(/%s/g, String(value));
  }
  return template.replace(/\$([a-zA-Z0-9_]+)/g, (_, key) => String(value?.[key]));
};

const wrapEach = (runner) => (cases) => (name, callback) => {
  for (const testCase of cases) {
    runner(formatName(name, testCase), () => callback(testCase));
  }
};

const test = Object.assign(
  (name, callback) => nodeTest(name, callback),
  {
    each: wrapEach((name, callback) => nodeTest(name, callback)),
  },
);

const describe = Object.assign(
  (name, callback) => nodeDescribe(name, callback),
  {
    each: wrapEach((name, callback) => nodeDescribe(name, callback)),
  },
);

// ---------------------------------------------------------------------------
// Globals
// ---------------------------------------------------------------------------

globalThis.afterAll = after;
globalThis.afterEach = afterEach;
globalThis.beforeAll = before;
globalThis.beforeEach = beforeEach;
globalThis.describe = describe;
globalThis.it = test;
globalThis.loadModule = loadModule;
globalThis.modulePath = modulePath;
globalThis.test = test;
globalThis.mock = mock;
globalThis.assert = assert;
globalThis.assertCalledWith = assertCalledWith;
globalThis.assertNthCalledWith = assertNthCalledWith;
globalThis.assertNotCalledWith = assertNotCalledWith;
