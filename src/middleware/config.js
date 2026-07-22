import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { readFileSync, existsSync } from 'fs';
import { Auth } from '@vonage/auth';
import { Vonage } from '@vonage/server-sdk';
import { dumpCommand } from '../ux/dump.js';
import { indentLines } from '../ux/indentLines.js';
import path from 'path';
import chalk from 'chalk';
import yargs from 'yargs';
const { version } = require('../../package.json');
import os from 'os';
import {
  GLOBAL_CONFIG_DIR,
  GLOBAL_CONFIG_FILE,
  LOCAL_CONFIG_FILE,
  SETTINGS_FILE,
} from '../utils/config.js';

const y = yargs();

const getSharedConfig = () => {
  const homedir = os.homedir();
  const globalConfigPath = path.join(homedir, GLOBAL_CONFIG_DIR);
  const globalConfigFileName = GLOBAL_CONFIG_FILE;
  const globalConfigFile = path.join(globalConfigPath, globalConfigFileName);
  const globalConfigExists = existsSync(globalConfigFile);

  const localConfigPath = process.cwd();
  const localConfigFileName = LOCAL_CONFIG_FILE;
  const localConfigFile = path.join(localConfigPath, localConfigFileName);
  const localConfigExists = existsSync(localConfigFile);

  const settingsFile = path.join(globalConfigPath, SETTINGS_FILE);
  const settingsFileExists = existsSync(settingsFile);

  return {
    globalConfigPath,
    globalConfigFileName,
    globalConfigFile,
    globalConfigExists,

    localConfigPath,
    localConfigFileName,
    localConfigFile,
    localConfigExists,

    settingsFile,
    settingsFileExists,
  };
};

const normalizeConfig = (raw, source) => ({
  apiKey: raw['apiKey'] || raw['api-key'],
  apiSecret: raw['apiSecret'] || raw['api-secret'],
  privateKey: raw['privateKey'] || raw['private-key'],
  appId: raw['appId'] || raw['app-id'],
  source,
});

const buildCliConfig = (argv) => {
  const keys = ['apiKey', 'apiSecret', 'privateKey', 'appId'];
  return Object.fromEntries(keys.filter((k) => argv[k]).map((k) => [k, argv[k]]));
};

const selectConfigSource = (argv, config) => {
  if ((argv.apiKey && argv.apiSecret) || (argv.privateKey && argv.appId)) {
    console.debug('Using passed in arguments');
    return config.cli;
  }

  if (config.localConfigExists && config.local.source) {
    console.debug('Using local config file');
    return config.local;
  }

  if (config.globalConfigExists && config.global.source) {
    console.debug('Using global config file');
    return config.global;
  }

  return false;
};

const errorNoConfig = (local = false) => {
  console.log(`${chalk.red('error')}: No ${local ? 'local ' : ''}configuration file found`);
  console.log('');
  console.log(`Please run ${dumpCommand('vonage auth set')} to set the configuration`);
  console.log('');
  console.log(`${chalk.yellow('NOTE: ')}You can also provide the configuration via the command line for other commands.`);
  console.log('      use the --help option for more information');
  y.exit(2);
};

const SDKConfig = {
  appendUserAgent: `cli/${version}`,
};

// Used as an array to allow commands to control as needed
export const configLoadingHelp = () => {
  const { localConfigFile, globalConfigFile } = getSharedConfig();
  return [
    'The Vonage CLI will load configuration in the following order:',
    '',
    `1. The command line flags ${dumpCommand('--api-key')} and ${dumpCommand('--api-secret')} or ${dumpCommand('--private-key')} and ${dumpCommand('--app-id')}`,
    '2. A local configuration file in the current working directory',
    indentLines(`(${dumpCommand(localConfigFile)})`),
    `3. A global configuration file in the ${dumpCommand('.vonage')} folder in your home directory`,
    indentLines(`(${dumpCommand(globalConfigFile)})`),
    '',
    `${chalk.yellow('NOTE')}: only the CLI will use these values. The SDK will use the values provided in the SDK initialization.`,
  ];
};

export { getSharedConfig };

export { errorNoConfig };

export const setConfig = (argv) => {
  const sharedConfig = getSharedConfig();
  const {
    globalConfigFile,
    globalConfigExists,
    localConfigFile,
    localConfigExists,
  } = sharedConfig;

  const config = {
    ...sharedConfig,
    local: {},
    global: {},
    cli: buildCliConfig(argv),
  };

  if (Object.entries(config.cli).length) {
    config.cli.source = 'CLI Arguments';
  }

  console.debug(`Local config [${localConfigFile}] exists? ${localConfigExists ? 'Yes' : 'No'}`);
  if (localConfigExists) {
    console.debug('Reading Local Config');
    try {
      const localConfig = JSON.parse(readFileSync(localConfigFile, 'utf8'));
      console.debug('Local Config:', localConfig);
      config.local = normalizeConfig(localConfig, 'Local Config File');
    } catch (err) {
      console.error(`Error reading local config file: ${err.message}`);
    }
  }

  console.debug(`Global Config [${globalConfigFile}] exists? ${globalConfigExists ? 'Yes' : 'No'}`);

  if (globalConfigExists) {
    console.debug('Reading global Config');
    try {
      const fileContents = readFileSync(globalConfigFile, 'utf8');
      console.debug(`Global File Contents: ${fileContents}`);
      const globalConfig = JSON.parse(fileContents);
      console.debug('global Config:', globalConfig);
      config.global = normalizeConfig(globalConfig, 'Global Config File');
    } catch (err) {
      console.error(`Error reading global config file: ${err.message}`);
    }
  }

  const authConfig = selectConfigSource(argv, config);

  if (!authConfig) {
    errorNoConfig();
    return;
  }

  const SDKAuth = new Auth({
    apiKey: authConfig.apiKey,
    apiSecret: authConfig.apiSecret,
    privateKey: authConfig.privateKey,
    applicationId: authConfig.appId,
  });


  const finalConfig = {
    ...authConfig,
    config: config,
    AUTH: SDKAuth,
    SDK: new Vonage(SDKAuth, SDKConfig),
    SDKConfig: SDKConfig,
  };

  return finalConfig;
};

export { SDKConfig };

// Map of APIs to their spec URLs
const apiSpecs = {
  'sms': 'https://developer.vonage.com/api/v1/developer/api/file/sms?format=json&vendorId=vonage',
};

export const APISpecs = apiSpecs;
