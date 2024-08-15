const { Auth } = require('@vonage/auth');
const { Vonage } = require('@vonage/server-sdk');
const { readFileSync, existsSync } = require('fs');

const configFileName = '.vonagerc';

const globalConfigPath = `${process.env.XDG_CONFIG_HOME || process.env.HOME + '/.config'}/vonage`;
const globalConfigFile = `${globalConfigPath}/${configFileName}`;

const localConfigPath = process.cwd();
const localConfigFile = `${localConfigPath}/${configFileName}`;

const sharedConfig = {
  globalConfigPath,
  globalConfigFile,
  localConfigPath,
  localConfigFile,
};

const decideConfig = (argv, config, localConfigExists, globalConfigExists) => {
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
      source: 'CLI arguments',
    },
  };

  const localConfigExists = existsSync(localConfigFile);
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
      source: 'Local config file',
    };
  }

  const globalConfigExists = existsSync(globalConfigFile);
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
      source: 'Global config file',
    };
  }

  const authConfig = decideConfig(
    argv,
    config,
    localConfigExists,
    globalConfigExists,
  );

  const auth = new Auth(authConfig);

  return {
    ...authConfig,
    config: config,
    Auth: auth,
    SDK: new Vonage(auth),
  };
};
