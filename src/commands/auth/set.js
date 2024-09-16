const yargs = require('yargs');
const { existsSync, writeFileSync, mkdir } = require('fs');
const { confirm } = require('../../ux/confirm');
const { dumpAuth } = require('../../ux/dumpAuth');
const { dumpValidInvalid } = require('../../ux/dumpYesNo');
const { validateApiKeyAndSecret, validatePrivateKeyAndAppId } = require('../../utils/validateSDKAuth');

const createConfigDirectory = (configPath) => new Promise((resolve) => {
  if (existsSync(configPath)) {
    console.debug('Config directory already exists');
    return resolve(true);
  }

  console.info(`Creating configuration directory ${configPath}`);

  mkdir(configPath, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating config directory:', err);
      return resolve(false);
    }
  });

  return resolve(true);
});

const checkOkToWrite = async (configPath) => {
  if (!existsSync(configPath)) {
    console.debug('Config file does not exist ok to write');
    return true;
  }

  console.debug('Config file exists, checking if ok to write');
  const okToWrite = await confirm('Configuration file already exists. Overwrite?');
  console.debug('Ok to write:', okToWrite);

  return okToWrite;
};

const setApiKeyAndSecret = async (apiKey, apiSecret) => {
  if (!apiKey || !apiSecret) {
    console.debug('API Key and Secret are required');
    return {};
  }

  console.log('Checking API Key Secret: ...');
  const valid = await validateApiKeyAndSecret(apiKey, apiSecret);
  console.log(`\rChecking API Key Secret: ${dumpValidInvalid(valid)}`);
  return valid ? { 'api-key': apiKey, 'api-secret': apiSecret } : false;
};

exports.command = 'set';

exports.desc = 'Set authentication information';

exports.builder = (yargs) => yargs.options({
  'local': {
    describe: 'Save local configuration only',
    type: 'boolean',
  },
});

exports.handler = async (argv) => {
  console.log('Saving auth information');

  const apiKeySecret = await setApiKeyAndSecret(
    argv.config.cli.apiKey,
    argv.config.cli.apiSecret,
  );

  if (apiKeySecret === false) {
    console.error('Invalid API Key or Secret');
    yargs.exit(5);
    return;
  }

  console.log(`Checking App ID and Private Key: ${dumpValidInvalid(await validatePrivateKeyAndAppId(config.local.appId, config.local.privateKey), true)}`);

  return;

  const newAuthInformation = {
    'api-key': argv.config.cli.apiKey,
    'api-secret': argv.config.cli.apiSecret,
    'private-key': argv.config.cli.privateKey,
    'app-id': argv.config.cli.appId,
  };

  console.debug('New auth information:', newAuthInformation);
  const configPath = argv.local
    ? argv.config.localConfigPath
    : argv.config.globalConfigPath;

  console.debug(`Config path: ${configPath}`);

  if (!argv.local && await createConfigDirectory(configPath) === false) {
    return;
  }

  const configFile = argv.local
    ? argv.config.localConfigFile
    : argv.config.globalConfigFile;

  if (await checkOkToWrite(configFile) === false) {
    console.info('Configuration not saved');
    return;
  }

  console.debug(`Writing to: ${configFile}`);

  writeFileSync(configFile, JSON.stringify(newAuthInformation, null, 2));
  console.log(`Configuration saved to ${configFile}`);

  console.log('');
  dumpAuth(newAuthInformation);
};
