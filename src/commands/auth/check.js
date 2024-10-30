const chalk = require('chalk');
const yargs = require('yargs');
const { dumpCommand } = require('../../ux/dump');
const { validateApiKeyAndSecret, validatePrivateKeyAndAppId } = require('../../utils/validateSDKAuth');
const { dumpAuth } = require('../../ux/dumpAuth');
const { errorNoConfig } = require('../../middleware/config');

exports.command = 'check';

exports.description = 'Checks Vonage credentials';

exports.builder = (yargs) => yargs.options({
  'local': {
    describe: 'Use local configuration',
    type: 'boolean',
    default: false,
  },
})
  .example(
    dumpCommand('$0 auth check'),
    'Check the global configuration',
  )
  .example(
    dumpCommand('$0 auth check --local'),
    'Check the local configuration',
  )
  .epilogue([`By default, the global configuration is checked. Use the ${dumpCommand('--local')} flag to check the local configuration.`].join('\n'));

exports.handler = async (argv) => {
  console.info('Displaying auth information');

  // start with global
  let configFile = `Global credentials found at: ${argv.config.globalConfigFile}`;
  let configExists = argv.config.globalConfigExists;
  let configOk = true;
  let config = argv.config.global;

  // then CLI arguments
  if (argv.config.cli.apiKey
    || argv.config.cli.apiSecret
    || argv.config.cli.appId
    || argv.config.cli.privateKey
  ) {
    console.debug('CLI Arguments found');
    configFile = 'CLI arguments';
    config = argv.config.cli;
    configExists = true;
  }

  // finally local
  if (argv.local) {
    console.debug('Using local configuration');
    configExists = argv.config.localConfigExists;
    configFile = `Local credentials found at: ${argv.config.localConfigFile}`;
    config = argv.config.local;
  }

  if (!configExists) {
    console.debug('No configuration found');
    errorNoConfig(argv.local);
    return;
  }

  const validPrivateKey = config.privateKey && config.privateKey.startsWith('-----BEGIN PRIVATE KEY');

  if (config.privateKey && !validPrivateKey) {
    console.debug('Private key is not a valid private key');
    config.privateKey = 'INVALID PRIVATE KEY';
    configOk = false;
  }

  console.log(configFile);
  console.log('');
  dumpAuth(config, argv.showAll);
  console.log('');

  configOk = await validateApiKeyAndSecret(
    config.apiKey,
    config.apiSecret,
  ) && configOk;

  if (config.appId && config.privateKey && validPrivateKey) {
    configOk = await validatePrivateKeyAndAppId(
      config.apiKey,
      config.apiSecret,
      config.appId,
      config.privateKey,
    ) && configOk;
  } else {
    console.log(`Checking App ID and Private Key: ... ${chalk.dim('skipped')}`);
  }

  if (!configOk) {
    console.error('Configuration is not valid');
    yargs.exit(validPrivateKey ? 5 : 22);
  }
};

