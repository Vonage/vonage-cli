process.env.FORCE_COLOR = 0;
import { Client } from '@vonage/server-client';
import { mockConsole } from '../helpers.js';
import {
  getGlobalConfig,
  getGlobalFile,
  getLocalConfig,
  getLocalFile,
  getCLIConfig,
} from '../common.js';
import { sep } from 'path';

// Virtual filesystem for tests
const mockFiles = new Map();
const existsSyncMock = mock.fn((path) => mockFiles.has(path));
const readFileSyncMock = mock.fn((path) => {
  if (!mockFiles.has(path)) throw new Error(`ENOENT: no such file: ${path}`);
  return mockFiles.get(path);
});
const homedirMock = mock.fn();
const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const __moduleMocks = {
  'fs': (() => ({
    existsSync: existsSyncMock,
    readFileSync: readFileSyncMock,
  }))(),
  'os': (() => ({ default: { homedir: homedirMock }, EOL: '\n' }))(),
  'yargs': (() => ({ default: yargs }))(),
};

const { setConfig } = await loadModule(import.meta.url, '../../src/middleware/config.js', __moduleMocks);

const oldEnv = process.env;
const oldCwd = process.cwd;

describe('Middeleware: Config', () => {
  beforeEach(() => {
    mockConsole();
    mockFiles.clear();
    existsSyncMock.mock.resetCalls();
    readFileSyncMock.mock.resetCalls();
    homedirMock.mock.resetCalls();
    homedirMock.mock.mockImplementation(() => '/dev/null');
    exitMock.mock.resetCalls();
  });

  afterEach(() => {
    process.env = oldEnv;
    process.cwd = oldCwd;
  });

  test('Will decide to use the global config when local or cli is not set', () => {
    const globalConfig = getGlobalConfig();
    const globalFile = getGlobalFile();

    homedirMock.mock.mockImplementation(() => globalFile.globalConfigPath);

    const derivedConfigPath = `${globalFile.globalConfigPath}${sep}.vonage`;
    const derivedConfigFile = `${derivedConfigPath}${sep}config.json`;

    mockFiles.set(
      derivedConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(globalConfig)),
    );

    const args = setConfig({});

    assert.strictEqual(args.apiKey, globalConfig.apiKey);
    assert.strictEqual(args.apiSecret, globalConfig.apiSecret);
    assert.strictEqual(args.appId, globalConfig.appId);
    assert.strictEqual(args.privateKey, globalConfig.privateKey);
    assert.deepStrictEqual(args.config.global, {
      ...globalConfig,
      source: 'Global Config File',
    });

    assert.strictEqual(args.config.globalConfigPath, derivedConfigPath);
    assert.strictEqual(args.config.globalConfigFile, derivedConfigFile);
    assert.strictEqual(args.config.globalConfigExists, true);
    assert.strictEqual(args.config.localConfigExists, false);

    assert.deepStrictEqual(args.config.local, {});
    assert.deepStrictEqual(args.config.cli, {});
    assert.strictEqual(args.source, 'Global Config File');

    assert.notStrictEqual(args.SDK, undefined);
    assert.notStrictEqual(args.AUTH, undefined);

    assert.strictEqual(args.AUTH.apiKey, globalConfig.apiKey);
    assert.strictEqual(args.AUTH.apiSecret, globalConfig.apiSecret);
    assert.strictEqual(args.AUTH.privateKey, globalConfig.privateKey);
    assert.strictEqual(args.AUTH.applicationId, globalConfig.appId);
  });

  test('Will decide to use the local config when local or cli is not set', () => {
    const localConfig = getLocalConfig();
    const localFile = getLocalFile();

    process.cwd = mock.fn(() => localFile.localConfigPath);
    const derivedConfigFile = `${localFile.localConfigPath}${sep}.vonagerc`;

    mockFiles.set(
      derivedConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(localConfig)),
    );

    const args = setConfig({});

    assert.strictEqual(args.apiKey, localConfig.apiKey);
    assert.strictEqual(args.apiSecret, localConfig.apiSecret);
    assert.strictEqual(args.appId, localConfig.appId);
    assert.strictEqual(args.privateKey, localConfig.privateKey);
    assert.deepStrictEqual(args.config.local, {
      ...localConfig,
      source: 'Local Config File',
    });

    assert.strictEqual(args.config.localConfigPath, localFile.localConfigPath);
    assert.strictEqual(args.config.localConfigFile, derivedConfigFile);
    assert.strictEqual(args.config.globalConfigExists, false);
    assert.strictEqual(args.config.localConfigExists, true);

    assert.deepStrictEqual(args.config.global, {});
    assert.deepStrictEqual(args.config.cli, {});
    assert.strictEqual(args.source, 'Local Config File');
  });

  test('Will decide to use the cli arguments when local or global is not set', () => {
    homedirMock.mock.mockImplementation(() => `${sep}dev${sep}null`);
    process.cwd = mock.fn(() => `${sep}dev${sep}null`);

    const cliConfig = getCLIConfig();
    const args = setConfig(cliConfig, {});

    assert.strictEqual(args.apiKey, cliConfig.apiKey);
    assert.strictEqual(args.apiSecret, cliConfig.apiSecret);
    assert.strictEqual(args.appId, cliConfig.appId);
    assert.strictEqual(args.privateKey, cliConfig.privateKey);

    assert.deepStrictEqual(args.config.cli, {
      ...cliConfig,
      source: 'CLI Arguments',
    });

    assert.strictEqual(args.config.globalConfigExists, false);
    assert.strictEqual(args.config.localConfigExists, false);

    assert.deepStrictEqual(args.config.global, {});
    assert.deepStrictEqual(args.config.local, {});
    assert.strictEqual(args.source, 'CLI Arguments');
  });

  test('Will decide to use the cli arguments over local and global', () => {
    const globalConfig = getGlobalConfig();
    const globalFile = getGlobalFile();

    homedirMock.mock.mockImplementation(() => globalFile.globalConfigPath);
    const derivedGlobalConfigPath = `${globalFile.globalConfigPath}${sep}.vonage`;
    const derivedGlobalConfigFile = `${derivedGlobalConfigPath}${sep}config.json`;

    mockFiles.set(
      derivedGlobalConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(globalConfig)),
    );

    const localConfig = getLocalConfig();
    const localFile = getLocalFile();

    process.cwd = mock.fn(() => localFile.localConfigPath);
    const derivedLocalConfigFile = `${localFile.localConfigPath}${sep}.vonagerc`;

    mockFiles.set(
      derivedLocalConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(localConfig)),
    );

    const cliConfig = getCLIConfig();
    const args = setConfig(cliConfig, {});

    assert.strictEqual(args.apiKey, cliConfig.apiKey);
    assert.strictEqual(args.apiSecret, cliConfig.apiSecret);
    assert.strictEqual(args.appId, cliConfig.appId);
    assert.strictEqual(args.privateKey, cliConfig.privateKey);

    assert.deepStrictEqual(args.config.cli, {
      ...cliConfig,
      source: 'CLI Arguments',
    });

    assert.strictEqual(args.config.globalConfigExists, true);
    assert.strictEqual(args.config.localConfigExists, true);

    assert.deepStrictEqual(args.config.global, {
      ...globalConfig,
      source: 'Global Config File',
    });
    assert.deepStrictEqual(args.config.local, {
      ...localConfig,
      source: 'Local Config File',
    });
    assert.strictEqual(args.source, 'CLI Arguments');
  });

  test('Will decide to use the local file over global file', () => {
    const globalConfig = getGlobalConfig();
    const globalFile = getGlobalFile();

    homedirMock.mock.mockImplementation(() => globalFile.globalConfigPath);
    const derivedGlobalConfigPath = `${globalFile.globalConfigPath}${sep}.vonage`;
    const derivedGlobalConfigFile = `${derivedGlobalConfigPath}${sep}config.json`;

    mockFiles.set(
      derivedGlobalConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(globalConfig)),
    );

    const localConfig = getLocalConfig();
    const localFile = getLocalFile();

    process.cwd = mock.fn(() => localFile.localConfigPath);
    const derivedLocalConfigFile = `${localFile.localConfigPath}${sep}.vonagerc`;

    mockFiles.set(
      derivedLocalConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(localConfig)),
    );

    const args = setConfig({});

    assert.strictEqual(args.apiKey, localConfig.apiKey);
    assert.strictEqual(args.apiSecret, localConfig.apiSecret);
    assert.strictEqual(args.appId, localConfig.appId);
    assert.strictEqual(args.privateKey, localConfig.privateKey);

    assert.deepStrictEqual(args.config.local, {
      ...localConfig,
      source: 'Local Config File',
    });

    assert.strictEqual(args.config.globalConfigExists, true);
    assert.strictEqual(args.config.localConfigExists, true);

    assert.deepStrictEqual(args.config.global, {
      ...globalConfig,
      source: 'Global Config File',
    });
    assert.deepStrictEqual(args.config.local, {
      ...localConfig,
      source: 'Local Config File',
    });
    assert.strictEqual(args.source, 'Local Config File');
  });

  test('Will exit when no config is found', () => {
    setConfig({});
    assertCalledWith(exitMock, 2);
  });
});
