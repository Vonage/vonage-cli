import {
  after,
  afterEach,
  before,
  beforeEach,
  describe,
  expect,
  importWithMocks,
  jest,
  loadModule,
  modulePath,
  test,
} from './compat.js';

process.env.FORCE_COLOR = 0;
process.env.LC_ALL = 'en_UK.UTF-8';

globalThis.afterAll = after;
globalThis.afterEach = afterEach;
globalThis.beforeAll = before;
globalThis.beforeEach = beforeEach;
globalThis.describe = describe;
globalThis.expect = expect;
globalThis.esmock = importWithMocks;
globalThis.it = test;
globalThis.jest = jest;
globalThis.loadModule = loadModule;
globalThis.modulePath = modulePath;
globalThis.test = test;
