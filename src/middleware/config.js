const { readFileSync, existsSync } = require('fs');
const { Auth } = require('@vonage/auth');
const { Vonage } = require('@vonage/server-sdk');
const { dumpCommand } = require('../ux/dump');
const chalk = require('chalk');
const yargs = require('yargs');

const getSharedConfig = () => {
  const globalConfigPath = `${process.env.HOME}/.vonage`;
  const globalConfigFile = `${globalConfigPath}/config.json`;
  const globalConfigExists = existsSync(globalConfigFile);

  const localConfigPath = process.cwd();
  const localConfigFile = `${localConfigPath}/.vonagerc`;
  const localConfigExists = existsSync(localConfigFile);

  return {
    globalConfigPath: globalConfigPath,
    globalConfigFile: globalConfigFile,
    globalConfigExists: globalConfigExists,

    localConfigPath: localConfigPath,
    localConfigFile: localConfigFile,
    localConfigExists: localConfigExists,
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

const errorNoConfig = (local=false) => {
  console.log(`${chalk.red('error')}: No ${local ? 'local ' :'' }configuration file found`);
  console.log('');
  console.log(`Please run ${dumpCommand('vonage auth set')} to set the configuration`);
  console.log('');
  console.log(`${chalk.yellow('NOTE: ')}You can also provide the configuration via the command line for other commands.`);
  console.log('      use the --help option for more information');
  yargs.exit(2);
};

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
      ...(argv.apiKey ? {apiKey: argv.apiKey} : {}),
      ...(argv.apiSecret ? {apiSecret: argv.apiSecret} : {}),
      ...(argv.privateKey ? {privateKey: argv.privateKey} : {}),
      ...(argv.appId ? {appId: argv.appId} : {}),
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
      apiKey: localConfig['api-key'],
      apiSecret: localConfig['api-secret'],
      privateKey: localConfig['private-key'],
      appId: localConfig['app-id'],
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
      apiKey: globalConfig['api-key'],
      apiSecret: globalConfig['api-secret'],
      privateKey: globalConfig['private-key'],
      appId: globalConfig['app-id'],
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
    SDK: new Vonage(SDKAuth),
  };

  return finalConfig;
};
