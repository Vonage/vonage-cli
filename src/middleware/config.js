const { readFileSync, existsSync } = require('fs');

const globalConfigPath = `${process.env.HOME}/.vonage`;
const globalConfigFile = `${globalConfigPath}/config.json`;
const globalConfigExists = existsSync(globalConfigFile);

const localConfigPath = process.cwd();
const localConfigFile = `${localConfigPath}/.vonagerc`;
const localConfigExists = existsSync(localConfigFile);

const sharedConfig = {
  globalConfigPath: globalConfigPath,
  globalConfigFile: globalConfigFile,
  globalConfigExists: globalConfigExists,

  localConfigPath: localConfigPath,
  localConfigFile: localConfigFile,
  localConfigExists: localConfigExists,
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

  return false;
};

exports.setConfig = async (argv, yargs) => {
  const config = {
    ...sharedConfig,
    local: {},
    global: {},
    cli: {
      apiKey: argv['api-key'],
      apiSecret: argv['api-secret'],
      privateKey: argv['private-key'],
      appId: argv['app-id'],
      source: 'CLI Arguments',
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
      source: 'Local Config File',
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
      source: 'Global Config File',
    };
  }

  const authConfig = decideConfig(argv, config);

  if (!authConfig) {
    console.error('No configuration found. Please provide the necessary information');
    yargs.exit(2);
  }

  const finalConfig = {
    ...authConfig,
    config: config,
  };

  console.debug('Auth Config:', authConfig);
  console.debug('Final Config:', finalConfig);

  return finalConfig;
};
