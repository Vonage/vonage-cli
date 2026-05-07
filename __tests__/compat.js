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
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const globalMocks = new Set();
const globalSpies = new Set();

const isAsymmetricMatcher = (value) => (
  Boolean(value)
  && typeof value === 'object'
  && value.__asymmetricMatcher === true
);

const formatName = (template, value) => {
  if (template.includes('%s')) {
    return template.replace(/%s/g, String(value));
  }

  return template.replace(/\$([a-zA-Z0-9_]+)/g, (_, key) => String(value?.[key]));
};

const deepMatch = (actual, expected) => {
  if (isAsymmetricMatcher(expected)) {
    return expected.match(actual);
  }

  if (Array.isArray(expected)) {
    return Array.isArray(actual)
      && actual.length === expected.length
      && expected.every((item, index) => deepMatch(actual[index], item));
  }

  if (expected && typeof expected === 'object') {
    if (!actual || typeof actual !== 'object') {
      return false;
    }

    return Object.entries(expected).every(([key, value]) => deepMatch(actual[key], value));
  }

  return Object.is(actual, expected);
};

const createMockFunction = (implementation = () => undefined) => {
  const state = {
    implementation,
    once: [],
    calls: [],
  };

  const mockFn = function (...args) {
    const currentImplementation = state.once.length ? state.once.shift() : state.implementation;
    state.calls.push(args);
    return currentImplementation.apply(this, args);
  };

  Object.defineProperty(mockFn, 'mock', {
    enumerable: true,
    value: {
      get calls() {
        return state.calls;
      },
    },
  });

  mockFn.mockImplementation = (nextImplementation) => {
    state.implementation = nextImplementation;
    return mockFn;
  };

  mockFn.mockImplementationOnce = (nextImplementation) => {
    state.once.push(nextImplementation);
    return mockFn;
  };

  mockFn.mockReturnValue = (value) => mockFn.mockImplementation(() => value);
  mockFn.mockReturnValueOnce = (value) => mockFn.mockImplementationOnce(() => value);
  mockFn.mockResolvedValue = (value) => mockFn.mockImplementation(() => Promise.resolve(value));
  mockFn.mockResolvedValueOnce = (value) => mockFn.mockImplementationOnce(() => Promise.resolve(value));
  mockFn.mockRejectedValue = (value) => mockFn.mockImplementation(() => Promise.reject(value));
  mockFn.mockRejectedValueOnce = (value) => mockFn.mockImplementationOnce(() => Promise.reject(value));
  mockFn.mockClear = () => {
    state.calls.length = 0;
    return mockFn;
  };
  mockFn.mockReset = () => {
    state.calls.length = 0;
    state.once.length = 0;
    state.implementation = () => undefined;
    return mockFn;
  };
  mockFn.mockName = () => mockFn;

  globalMocks.add(mockFn);

  return mockFn;
};

const spyOn = (object, methodName) => {
  const original = object[methodName];
  const spy = createMockFunction(function (...args) {
    return original.apply(this, args);
  });

  spy.mockRestore = () => {
    object[methodName] = original;
    globalSpies.delete(spy);
    return spy;
  };

  object[methodName] = spy;
  globalSpies.add(spy);
  return spy;
};

const clearAllMocks = () => {
  for (const mockFn of globalMocks) {
    mockFn.mockClear();
  }
};

const restoreAllMocks = () => {
  for (const spy of [...globalSpies]) {
    spy.mockRestore();
  }
};

const createMockFromModule = (specifier) => {
  const module = require(specifier);
  const clone = Array.isArray(module) ? [] : {};

  for (const [key, value] of Object.entries(module)) {
    clone[key] = typeof value === 'function' ? createMockFunction() : value;
  }

  return clone;
};

const jest = {
  clearAllMocks,
  createMockFromModule,
  fn: createMockFunction,
  mock: () => undefined,
  restoreAllMocks,
  retryTimes: () => undefined,
  spyOn,
  useFakeTimers: () => {
    mock.timers.enable({ apis: ['setTimeout', 'setInterval', 'Date'] });
  },
  useRealTimers: () => {
    mock.timers.reset();
  },
  advanceTimersByTime: (time) => {
    mock.timers.tick(time);
  },
};

const getPathValue = (value, path) => String(path)
  .split('.')
  .reduce((current, segment) => current?.[segment], value);

const buildError = (message, isNot) => new assert.AssertionError({
  message: isNot ? `Expected assertion to fail: ${message}` : message,
});

const createExpectation = (received, isNot = false) => {
  const applyAssertion = (condition, message) => {
    if (isNot ? condition : !condition) {
      throw buildError(message, isNot);
    }
  };

  const assertThrownError = (error, expected) => {
    if (!expected) {
      applyAssertion(true, 'Expected throw');
      return;
    }

    if (typeof expected === 'string') {
      applyAssertion(String(error?.message || error).includes(expected), `Expected error message to include "${expected}"`);
      return;
    }

    if (expected instanceof RegExp) {
      applyAssertion(expected.test(String(error?.message || error)), `Expected error message to match ${expected}`);
      return;
    }

    if (typeof expected === 'function') {
      applyAssertion(error instanceof expected, `Expected error to be instance of ${expected.name}`);
    }
  };

  const toThrowMatcher = (expected) => {
    try {
      if (typeof received === 'function') {
        const result = received();
        if (result?.then) {
          return result.then(
            () => applyAssertion(false, 'Expected function or promise to throw'),
            (error) => assertThrownError(error, expected),
          );
        }
      } else {
        return Promise.resolve(received).then(
          () => applyAssertion(false, 'Expected function or promise to throw'),
          (error) => assertThrownError(error, expected),
        );
      }
      applyAssertion(false, 'Expected function or promise to throw');
    } catch (error) {
      assertThrownError(error, expected);
    }
  };

  return {
    get not() {
      return createExpectation(received, !isNot);
    },
    get rejects() {
      return {
        toThrow: toThrowMatcher,
      };
    },
    get resolves() {
      return {
        async toBe(expected) {
          const value = await received;
          return createExpectation(value, isNot).toBe(expected);
        },
      };
    },
    toBe(expected) {
      applyAssertion(Object.is(received, expected), `Expected ${received} to be ${expected}`);
    },
    toEqual(expected) {
      applyAssertion(deepMatch(received, expected), 'Expected values to be deeply equal');
    },
    toStrictEqual(expected) {
      applyAssertion(deepMatch(received, expected), 'Expected values to be strictly equal');
    },
    toBeTruthy() {
      applyAssertion(Boolean(received), 'Expected value to be truthy');
    },
    toBeFalsy() {
      applyAssertion(!received, 'Expected value to be falsy');
    },
    toBeUndefined() {
      applyAssertion(received === undefined, 'Expected value to be undefined');
    },
    toBeNull() {
      applyAssertion(received === null, 'Expected value to be null');
    },
    toBeDefined() {
      applyAssertion(received !== undefined, 'Expected value to be defined');
    },
    toContain(expected) {
      applyAssertion(received.includes(expected), `Expected value to contain ${expected}`);
    },
    toMatchObject(expected) {
      applyAssertion(deepMatch(received, expected), 'Expected object to match');
    },
    toThrow(expected) {
      return toThrowMatcher(expected);
    },
    toHaveBeenCalled() {
      applyAssertion(received?.mock?.calls?.length > 0, 'Expected mock to have been called');
    },
    toHaveBeenCalledTimes(expected) {
      applyAssertion(received?.mock?.calls?.length === expected, `Expected mock to be called ${expected} times`);
    },
    toHaveBeenCalledWith(...expected) {
      applyAssertion(
        received?.mock?.calls?.some((call) => deepMatch(call, expected)),
        'Expected mock to have been called with expected arguments',
      );
    },
    toHaveBeenNthCalledWith(index, ...expected) {
      applyAssertion(
        deepMatch(received?.mock?.calls?.[index - 1], expected),
        `Expected mock call ${index} to match expected arguments`,
      );
    },
    toHaveProperty(path, expected) {
      const value = getPathValue(received, path);
      applyAssertion(
        arguments.length === 1 ? value !== undefined : deepMatch(value, expected),
        `Expected value to have property ${path}`,
      );
    },
  };
};

const expect = (received) => createExpectation(received);

expect.any = (Type) => ({
  __asymmetricMatcher: true,
  match(value) {
    if (Type === Object) {
      return value !== null && typeof value === 'object';
    }

    if (Type === String) {
      return typeof value === 'string';
    }

    if (Type === Number) {
      return typeof value === 'number';
    }

    return value instanceof Type;
  },
});

expect.stringContaining = (value) => ({
  __asymmetricMatcher: true,
  match(actual) {
    return String(actual).includes(value);
  },
});

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

const importWithMocks = async (moduleId, childmocks = {}, globalmocks = {}) => esmock(moduleId, childmocks, globalmocks);

const modulePath = (baseUrl, relativePath) => fileURLToPath(new URL(relativePath, baseUrl));

const normalizeMocks = (baseUrl, mocks) => Object.fromEntries(
  Object.entries(mocks).map(([key, value]) => (
    key.startsWith('.')
      ? [modulePath(baseUrl, key), value]
      : [key, value]
  )),
);

const loadModule = async (baseUrl, relativeModuleId, childmocks = {}, globalmocks = {}) => importWithMocks(
  modulePath(baseUrl, relativeModuleId),
  normalizeMocks(baseUrl, childmocks),
  normalizeMocks(baseUrl, globalmocks),
);

export {
  after,
  afterEach,
  before,
  beforeEach,
  clearAllMocks,
  describe,
  expect,
  importWithMocks,
  jest,
  loadModule,
  modulePath,
  restoreAllMocks,
  test,
};
