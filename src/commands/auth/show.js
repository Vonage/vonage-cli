import yargs from 'yargs';
import { validateApiKeyAndSecret, validatePrivateKeyAndAppId } from '../../utils/validateSDKAuth.js';
import { dumpCommand } from '../../ux/dump.js';
import { dumpBoolean } from '../../ux/dumpYesNo.js';
import { dumpAuth } from '../../ux/dumpAuth.js';
import { json, yaml as yamlFlag } from '../../commonFlags.js';
import { configLoadingHelp } from '../../middleware/config.js';
import yaml from 'yaml';

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
    group: 'Output:',
  },
  'yaml': yamlFlag,
  'json': json,
};

export const flags = showFlags;

export const command = 'show';

export const description = ['Show configured Vonage API authentication information'].join('\n');

export const builder = (yargs) => yargs.options(showFlags)
  .epilogue([
    '',
    `This will display (and validate) the configured API key, API secret, private key, and application ID the Vonage CLI will use when making calls. The API secret and private key will be redacted (unless using ${dumpCommand('--json')} or ${dumpCommand('--yaml')}). Use the ${dumpCommand('--show-all')} flag to display them. `,
    '',
    ...configLoadingHelp(),

  ].join('\n'));

export const handler = async (argv) => {
  console.info('Displaying auth information');
  const { config } = argv;

  const { localConfigExists, globalConfigExists } = config;

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

  const hasLocalApiKey = localConfigExists
    && config.local.apiKey
      && config.local.apiSecret;

  const hasLocalAppId= localConfigExists
    && config.local.apiKey
      && config.local.apiSecret
      && config.local.privateKey
      && config.local.appId;

  const hasGlobalApiKey = globalConfigExists
    && config.global.apiKey
      && config.global.apiSecret;

  const hasGlobalAppId = globalConfigExists
    && config.global.apiKey
      && config.global.apiSecret
      && config.global.privateKey
      && config.global.appId;

  let configOk = true;

  if (hasLocalApiKey) {
    console.log(`${dumpBoolean({value: localConfigExists, ...dumpOptions})}Local credentials found at: ${config.localConfigFile}`);
    console.log('');
    dumpAuth(config.local, argv.showAll);
    console.log('');

    configOk = await validateApiKeyAndSecret(
      config.local.apiKey,
      config.local.apiSecret,
    ) && configOk;
  }

  if (hasLocalAppId) {
    configOk = await validatePrivateKeyAndAppId(
      config.local.apiKey,
      config.local.apiSecret,
      config.local.appId,
      config.local.privateKey,
    ) && configOk;
  }

  if (hasGlobalApiKey) {
    console.log(`${dumpBoolean({value: globalConfigExists, ...dumpOptions})}Global credentials found at: ${config.globalConfigFile}`);
    console.log('');
    dumpAuth(config.global, argv.showAll);
    console.log('');

    configOk = await validateApiKeyAndSecret(
      config.global.apiKey,
      config.global.apiSecret,
    ) && configOk;

  }

  if (hasGlobalAppId) {
    configOk = await validatePrivateKeyAndAppId(
      config.global.apiKey,
      config.global.apiSecret,
      config.global.appId,
      config.global.privateKey,
    ) && configOk;
  }

  if (!configOk) {
    console.error('Configuration is not valid');
    yargs.exit(5);
    return;
  }
};

