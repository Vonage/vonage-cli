const chalk = require('chalk');
const { validateApiKeyAndSecret, validatePrivateKeyAndAppId } = require('../../utils/validateSDKAuth');
const { dumpCommand } = require('../../ux/dump');
const { dumpBoolean } = require('../../ux/dumpYesNo');
const { lineBreak } = require('../../ux/lineBreak');
const { dumpAuth } = require('../../ux/dumpAuth');
const yaml = require('yaml');

const dumpOptions = {
  noEmoji: true,
  includeText: true,
  trueWord: '',
  falseWord: 'No! ',
};

const showFlags = {
  'show-all': {
    describe: 'Shows the non redacted private key and API secret',
    type: 'boolean',
    default: false,
  },
  'yaml': {
    describe: 'Output as YAML',
    type: 'boolean',
    conflicts: 'json',
  },
  'json': {
    describe: 'Output as JSON',
    type: 'boolean',
    conflicts: 'yaml',
  },
};

exports.flags = showFlags;

exports.command = 'auth [command]';

exports.desc = 'Manage authentication information';

exports.builder = (yargs) => yargs.options(showFlags);

exports.handler = async (argv) => {
  console.info('Displaying auth information');
  const { config } = argv;

  const { localConfigExists, globalConfigExists } = config;

  if (!localConfigExists && !globalConfigExists) {
    console.error('No configuration files found.');
    console.log(`Please run ${dumpCommand('vonage auth set')} to set the configuration`);
    console.log('');
    console.log(`${chalk.yellow('NOTE: ')}You can also provide the configuration via the command line for other commands.`);
    console.log('      use the --help option for more information');
    return;
  }

  if (argv.json) {
    console.log(JSON.stringify(
      [
        {
          apiKey: config.local.apiKey,
          apiSecret: config.local.apiSecret,
          privateKey: config.local.privateKey,
          appId: config.local.appId,
        },
        {
          apiKey: config.global.apiKey,
          apiSecret: config.global.apiSecret,
          privateKey: config.global.privateKey,
          appId: config.global.appId,
        },
      ],
      null,
      2,
    ));
    return;
  }

  if (argv.yaml) {
    console.log(yaml.stringify(
      [
        {
          apiKey: config.local.apiKey,
          apiSecret: config.local.apiSecret,
          privateKey: config.local.privateKey,
          appId: config.local.appId,
        },
        {
          apiKey: config.global.apiKey,
          apiSecret: config.global.apiSecret,
          privateKey: config.global.privateKey,
          appId: config.global.appId,
        },
      ],
    ));
    return;
  }

  const hasLocal = localConfigExists
    && (config.local.apiKey
      || config.local.apiSecret
      || config.local.privateKey
      || config.local.appId);

  const hasGlobal = globalConfigExists
    && (config.global.apiKey
      || config.global.apiSecret
      || config.global.privateKey
      || config.global.appId);


  if (hasLocal) {
    console.log(`${dumpBoolean({value: localConfigExists, ...dumpOptions})}Local credentials found at: ${config.localConfigFile}`);
    console.log('');
    dumpAuth(config.local, argv.showAll);
    console.log('');

    await validateApiKeyAndSecret(config.local.apiKey, config.local.apiSecret);
    await validatePrivateKeyAndAppId(config.local.appId, config.local.privateKey);
  }

  if (hasLocal && hasGlobal) {
    lineBreak();
  }

  if (hasGlobal) {
    console.log(`${dumpBoolean({value: globalConfigExists, ...dumpOptions})}Global credentials found at: ${config.globalConfigFile}`);
    console.log('');
    dumpAuth(config.global, argv.showAll);
    console.log('');

    await validateApiKeyAndSecret(config.global.apiKey, config.global.apiSecret);
    await validatePrivateKeyAndAppId(config.global.appId, config.global.privateKey);
  }
};

