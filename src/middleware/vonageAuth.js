const { Auth } = require('@vonage/auth');
const { Vonage } = require('@vonage/server-sdk');
const { readFileSync, existsSync } = require('fs');

const configFileName = '.vonagerc';

const globalConfigPath = `${process.env.XDG_CONFIG_HOME || process.env.HOME + '/.config'}/vonage`;
const globalConfigFile = `${globalConfigPath}/${configFileName}`;
const globalConfigExists = existsSync(globalConfigFile);

const localConfigPath = process.cwd();
const localConfigFile = `${localConfigPath}/${configFileName}`;
const localConfigExists = existsSync(localConfigFile);

const sharedConfig = {
  globalConfigPath: globalConfigPath,
  globalConfigFile: globalConfigFile,

  localConfigPath: localConfigPath,
  localConfigFile: localConfigFile,
};

const decideConfig = (argv, config) => {
  if ((argv.apiKey && argv.apiSecret) || (argv.privateKey && argv.appId)) {
    console.debug('Using passed in arguments');
    return config.cli;
  }

  if (localConfigExists) {
    console.debug('Using local config file');
    return config.local;
  }

  if (globalConfigExists) {
    console.debug('Using global config file');
    return config.global;
  }

  throw new Error('No configuration found');
};

exports.getVonageAuth = async (argv) => {
  const config = {
    ...sharedConfig,
    local: {},
    global: {},
    cli: {
      apiKey: argv['api-key'],
      apiSecret: argv['api-secret'],
      privateKey: argv['private-key'],
      appId: argv['app-id'],
    },
  };

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
    };
  }

  console.debug(`Global Config [${localConfigFile}] exists? ${localConfigExists ? 'Yes' : 'No'}`);

  if (globalConfigExists) {
    console.debug('Reading global Config');
    const globalConfig = JSON.parse(readFileSync(globalConfigFile, 'utf8'));
    console.debug('global Config:', globalConfig);
    config.global = {
      apiKey: globalConfig['api-key'],
      apiSecret: globalConfig['api-secret'],
      privateKey: globalConfig['private-key'],
      appId: globalConfig['app-id'],
    };
  }

  const authConfig = decideConfig(argv, config);

  const auth = new Auth(authConfig);

  return {
    ...authConfig,
    config: config,
    Auth: auth,
    SDK: new Vonage(auth),
  };
};
