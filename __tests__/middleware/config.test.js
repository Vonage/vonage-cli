process.env.FORCE_COLOR = 0;
const { Client } = require('@vonage/server-client');
const { setConfig } = require('../../src/middleware/config');
const {
  getGlobalConfig,
  getGlobalFile,
  getLocalConfig,
  getLocalFile,
  getCLIConfig,
} = require('../common');
const { mockConsole } = require('../helpers');
const fs = require('fs');
const yargs = require('yargs');

jest.mock('fs');
jest.mock('yargs');

const oldEnv = process.env;
const oldCwd = process.cwd;

describe('Middeleware: Config', () => {
  let consoleMock;

  beforeEach(() => {
    consoleMock = mockConsole();
  });

  afterEach(() => {
    process.env = oldEnv;
    process.cwd = oldCwd;
  });

  test('Will decide to use the global config when local or cli is not set', () => {
    const globalConfig = getGlobalConfig();
    const globalFile = getGlobalFile();

    process.env.HOME = globalFile.globalConfigPath;
    const derivedConfigPath = `${globalFile.globalConfigPath}/.vonage`;
    const derivedConfigFile = `${derivedConfigPath}/config.json`;

    fs.__addFile(
      derivedConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(globalConfig)),
    );

    const args = setConfig({}, {});

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
  });

  test('Will decide to use the local config when local or cli is not set', () => {
    const localConfig = getLocalConfig();
    const localFile = getLocalFile();

    process.cwd = jest.fn(() => localFile.localConfigPath);
    const derivedConfigFile = `${localFile.localConfigPath}/.vonagerc`;

    fs.__addFile(
      derivedConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(localConfig)),
    );

    const args = setConfig({}, {});

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
    process.env.HOME = '/dev/null';
    process.cwd = jest.fn(() => '/dev/null');

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

    process.env.HOME = globalFile.globalConfigPath;
    const derivedGlobalConfigPath = `${globalFile.globalConfigPath}/.vonage`;
    const derivedGlobalConfigFile = `${derivedGlobalConfigPath}/config.json`;

    fs.__addFile(
      derivedGlobalConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(globalConfig)),
    );

    const localConfig = getLocalConfig();
    const localFile = getLocalFile();

    process.cwd = jest.fn(() => localFile.localConfigPath);
    const derivedLocalConfigFile = `${localFile.localConfigPath}/.vonagerc`;

    fs.__addFile(
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

    process.env.HOME = globalFile.globalConfigPath;
    const derivedGlobalConfigPath = `${globalFile.globalConfigPath}/.vonage`;
    const derivedGlobalConfigFile = `${derivedGlobalConfigPath}/config.json`;

    fs.__addFile(
      derivedGlobalConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(globalConfig)),
    );

    const localConfig = getLocalConfig();
    const localFile = getLocalFile();

    process.cwd = jest.fn(() => localFile.localConfigPath);
    const derivedLocalConfigFile = `${localFile.localConfigPath}/.vonagerc`;

    fs.__addFile(
      derivedLocalConfigFile,
      JSON.stringify(Client.transformers.kebabCaseObjectKeys(localConfig)),
    );

    const args = setConfig({}, {});

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
    setConfig({}, yargs);
    expect(consoleMock.error).toHaveBeenCalledWith('error: No configuration file found');
    expect(yargs.exit).toHaveBeenCalledWith(2);
  });
});
