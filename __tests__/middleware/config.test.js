import { jest, describe, test, beforeEach, afterEach, expect } from '@jest/globals';
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
const existsSyncMock = jest.fn((path) => mockFiles.has(path));
const readFileSyncMock = jest.fn((path) => {
  if (!mockFiles.has(path)) throw new Error(`ENOENT: no such file: ${path}`);
  return mockFiles.get(path);
});
const homedirMock = jest.fn();
const exitMock = jest.fn();
const yargs = jest.fn().mockImplementation(() => ({ exit: exitMock }));

jest.unstable_mockModule('fs', () => ({
  existsSync: existsSyncMock,
  readFileSync: readFileSyncMock,
}));
jest.unstable_mockModule('os', () => ({ default: { homedir: homedirMock }, EOL: '\n' }));
jest.unstable_mockModule('yargs', () => ({ default: yargs }));

const { setConfig } = await import('../../src/middleware/config.js');

const oldEnv = process.env;
const oldCwd = process.cwd;

describe('Middeleware: Config', () => {
  beforeEach(() => {
    mockConsole();
    mockFiles.clear();
    existsSyncMock.mockClear();
    readFileSyncMock.mockClear();
    homedirMock.mockReset();
    homedirMock.mockReturnValue('/dev/null');
    exitMock.mockReset();
  });

  afterEach(() => {
    process.env = oldEnv;
    process.cwd = oldCwd;
  });

  test('Will decide to use the global config when local or cli is not set', () => {
    const globalConfig = getGlobalConfig();
    const globalFile = getGlobalFile();

    homedirMock.mockReturnValue(globalFile.globalConfigPath);

    const derivedConfigPath = `${globalFile.globalConfigPath}${sep}.vonage`;
    const derivedConfigFile = `${derivedConfigPath}${sep}config.json`;

    mockFiles.set(
      derivedConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(globalConfig)),
    );

    const args = setConfig({});

    expect(args.apiKey).toBe(globalConfig.apiKey);
    expect(args.apiSecret).toBe(globalConfig.apiSecret);
    expect(args.appId).toBe(globalConfig.appId);
    expect(args.privateKey).toBe(globalConfig.privateKey);
    expect(args.config.global).toEqual({
      ...globalConfig,
      source: 'Global Config File',
    });

    expect(args.config.globalConfigPath).toBe(derivedConfigPath);
    expect(args.config.globalConfigFile).toBe(derivedConfigFile);
    expect(args.config.globalConfigExists).toBe(true);
    expect(args.config.localConfigExists).toBe(false);

    expect(args.config.local).toEqual({});
    expect(args.config.cli).toEqual({});
    expect(args.source).toBe('Global Config File');

    expect(args.SDK).toBeDefined();
    expect(args.AUTH).toBeDefined();

    expect(args.AUTH.apiKey).toBe(globalConfig.apiKey);
    expect(args.AUTH.apiSecret).toBe(globalConfig.apiSecret);
    expect(args.AUTH.privateKey).toBe(globalConfig.privateKey);
    expect(args.AUTH.applicationId).toBe(globalConfig.appId);
  });

  test('Will decide to use the local config when local or cli is not set', () => {
    const localConfig = getLocalConfig();
    const localFile = getLocalFile();

    process.cwd = jest.fn(() => localFile.localConfigPath);
    const derivedConfigFile = `${localFile.localConfigPath}${sep}.vonagerc`;

    mockFiles.set(
      derivedConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(localConfig)),
    );

    const args = setConfig({});

    expect(args.apiKey).toBe(localConfig.apiKey);
    expect(args.apiSecret).toBe(localConfig.apiSecret);
    expect(args.appId).toBe(localConfig.appId);
    expect(args.privateKey).toBe(localConfig.privateKey);
    expect(args.config.local).toEqual({
      ...localConfig,
      source: 'Local Config File',
    });

    expect(args.config.localConfigPath).toBe(localFile.localConfigPath);
    expect(args.config.localConfigFile).toBe(derivedConfigFile);
    expect(args.config.globalConfigExists).toBe(false);
    expect(args.config.localConfigExists).toBe(true);

    expect(args.config.global).toEqual({});
    expect(args.config.cli).toEqual({});
    expect(args.source).toBe('Local Config File');
  });

  test('Will decide to use the cli arguments when local or global is not set', () => {
    homedirMock.mockReturnValue(`${sep}dev${sep}null`);
    process.cwd = jest.fn(() => `${sep}dev${sep}null`);

    const cliConfig = getCLIConfig();
    const args = setConfig(cliConfig, {});

    expect(args.apiKey).toBe(cliConfig.apiKey);
    expect(args.apiSecret).toBe(cliConfig.apiSecret);
    expect(args.appId).toBe(cliConfig.appId);
    expect(args.privateKey).toBe(cliConfig.privateKey);

    expect(args.config.cli).toEqual({
      ...cliConfig,
      source: 'CLI Arguments',
    });

    expect(args.config.globalConfigExists).toBe(false);
    expect(args.config.localConfigExists).toBe(false);

    expect(args.config.global).toEqual({});
    expect(args.config.local).toEqual({});
    expect(args.source).toBe('CLI Arguments');
  });

  test('Will decide to use the cli arguments over local and global', () => {
    const globalConfig = getGlobalConfig();
    const globalFile = getGlobalFile();

    homedirMock.mockReturnValue(globalFile.globalConfigPath);
    const derivedGlobalConfigPath = `${globalFile.globalConfigPath}${sep}.vonage`;
    const derivedGlobalConfigFile = `${derivedGlobalConfigPath}${sep}config.json`;

    mockFiles.set(
      derivedGlobalConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(globalConfig)),
    );

    const localConfig = getLocalConfig();
    const localFile = getLocalFile();

    process.cwd = jest.fn(() => localFile.localConfigPath);
    const derivedLocalConfigFile = `${localFile.localConfigPath}${sep}.vonagerc`;

    mockFiles.set(
      derivedLocalConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(localConfig)),
    );

    const cliConfig = getCLIConfig();
    const args = setConfig(cliConfig, {});

    expect(args.apiKey).toBe(cliConfig.apiKey);
    expect(args.apiSecret).toBe(cliConfig.apiSecret);
    expect(args.appId).toBe(cliConfig.appId);
    expect(args.privateKey).toBe(cliConfig.privateKey);

    expect(args.config.cli).toEqual({
      ...cliConfig,
      source: 'CLI Arguments',
    });

    expect(args.config.globalConfigExists).toBe(true);
    expect(args.config.localConfigExists).toBe(true);

    expect(args.config.global).toEqual({
      ...globalConfig,
      source: 'Global Config File',
    });
    expect(args.config.local).toEqual({
      ...localConfig,
      source: 'Local Config File',
    });
    expect(args.source).toBe('CLI Arguments');
  });

  test('Will decide to use the local file over global file', () => {
    const globalConfig = getGlobalConfig();
    const globalFile = getGlobalFile();

    homedirMock.mockReturnValue(globalFile.globalConfigPath);
    const derivedGlobalConfigPath = `${globalFile.globalConfigPath}${sep}.vonage`;
    const derivedGlobalConfigFile = `${derivedGlobalConfigPath}${sep}config.json`;

    mockFiles.set(
      derivedGlobalConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(globalConfig)),
    );

    const localConfig = getLocalConfig();
    const localFile = getLocalFile();

    process.cwd = jest.fn(() => localFile.localConfigPath);
    const derivedLocalConfigFile = `${localFile.localConfigPath}${sep}.vonagerc`;

    mockFiles.set(
      derivedLocalConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(localConfig)),
    );

    const args = setConfig({});

    expect(args.apiKey).toBe(localConfig.apiKey);
    expect(args.apiSecret).toBe(localConfig.apiSecret);
    expect(args.appId).toBe(localConfig.appId);
    expect(args.privateKey).toBe(localConfig.privateKey);

    expect(args.config.local).toEqual({
      ...localConfig,
      source: 'Local Config File',
    });

    expect(args.config.globalConfigExists).toBe(true);
    expect(args.config.localConfigExists).toBe(true);

    expect(args.config.global).toEqual({
      ...globalConfig,
      source: 'Global Config File',
    });
    expect(args.config.local).toEqual({
      ...localConfig,
      source: 'Local Config File',
    });
    expect(args.source).toBe('Local Config File');
  });

  test('Will exit when no config is found', () => {
    setConfig({});
    expect(exitMock).toHaveBeenCalledWith(2);
  });
});

