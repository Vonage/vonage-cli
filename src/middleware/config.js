const { readFileSync, existsSync } = require('fs');
const { Auth } = require('@vonage/auth');
const { Vonage } = require('@vonage/server-sdk');
const { dumpCommand } = require('../ux/dump');
const { indentLines } = require('../ux/indentLines');
const path = require('path');
const chalk = require('chalk');
const yargs = require('yargs');
const { version } = require('../../package.json');
const os = require('os');

const getSharedConfig = () => {
  const homedir = os.homedir();
  const globalConfigPath = path.join(homedir, '.vonage');
  const globalConfigFileName = 'config.json';
  const globalConfigFile = path.join(globalConfigPath, globalConfigFileName);
  const globalConfigExists = existsSync(globalConfigFile);

  const localConfigPath = process.cwd();
  const localConfigFileName = '.vonagerc';
  const localConfigFile = path.join(localConfigPath, localConfigFileName);
  const localConfigExists = existsSync(localConfigFile);

  const settingsFile = path.join(globalConfigPath, 'settings.json');
  const settingsFileExists = existsSync(settingsFile);

  return {
    globalConfigPath: globalConfigPath,
    globalConfigFileName: globalConfigFileName,
    globalConfigFile: globalConfigFile,
    globalConfigExists: globalConfigExists,

    localConfigPath: localConfigPath,
    localConfigFileName: localConfigFileName,
    localConfigFile: localConfigFile,
    localConfigExists: localConfigExists,

    settingsFile: settingsFile,
    settingsFileExists: settingsFileExists,
  };
};

const decideConfig = (argv, config) => {
  if ((argv.apiKey && argv.apiSecret) || (argv.privateKey && argv.appId)) {
    console.debug('Using passed in arguments');
    return config.cli;
  }

  if (config.localConfigExists) {
    console.debug('Using local config file');
    return config.local;
  }

  if (config.globalConfigExists) {
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
  yargs.exit(2);
};

const SDKConfig = {
  appendUserAgent: `cli/${version}`,
};

// Used as an array to allow commands to control as needed
exports.configLoadingHelp = () => {
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

exports.getSharedConfig = getSharedConfig;

exports.errorNoConfig = errorNoConfig;

exports.setConfig = (argv) => {
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
    cli: {
      ...(argv.apiKey ? { apiKey: argv.apiKey } : {}),
      ...(argv.apiSecret ? { apiSecret: argv.apiSecret } : {}),
      ...(argv.privateKey ? { privateKey: argv.privateKey } : {}),
      ...(argv.appId ? { appId: argv.appId } : {}),
    },
  };

  if (Object.entries(config.cli).length) {
    config.cli.source = 'CLI Arguments';
  }

  console.debug(`Local config [${localConfigFile}] exists? ${localConfigExists ? 'Yes' : 'No'}`);
  if (localConfigExists) {
    console.debug('Reading Local Config');
    const localConfig = JSON.parse(readFileSync(localConfigFile, 'utf8'));
    console.debug('Local Config:', localConfig);
    config.local = {
      apiKey: localConfig['apiKey'] || localConfig['api-key'],
      apiSecret: localConfig['apiSecret'] || localConfig['api-secret'],
      privateKey: localConfig['privateKey'] || localConfig['private-key'],
      appId: localConfig['appId'] || localConfig['app-id'],
      source: 'Local Config File',
    };
  }

  console.debug(`Global Config [${globalConfigFile}] exists? ${globalConfigExists ? 'Yes' : 'No'}`);

  if (globalConfigExists) {
    console.debug('Reading global Config');
    const fileContents = readFileSync(globalConfigFile, 'utf8');
    console.debug(`Global File Contents: ${fileContents}`);
    const globalConfig = JSON.parse(fileContents);
    console.debug('global Config:', globalConfig);
    config.global = {
      apiKey: globalConfig['apiKey'] || globalConfig['api-key'],
      apiSecret: globalConfig['apiSecret'] || globalConfig['api-secret'],
      privateKey: globalConfig['privateKey'] || globalConfig['private-key'],
      appId: globalConfig['appId'] || globalConfig['app-id'],
      source: 'Global Config File',
    };
  }

  const authConfig = decideConfig(argv, config);

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

exports.SDKConfig = SDKConfig;

// Map of APIs to their spec URLs
const apiSpecs = {
  'sms': 'https://developer.vonage.com/api/v1/developer/api/file/sms?format=json&vendorId=vonage',
};
exports.APISpecs = apiSpecs;
