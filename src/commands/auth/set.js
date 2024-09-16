const yargs = require('yargs');
const { existsSync, writeFileSync, mkdirSync } = require('fs');
const { confirm } = require('../../ux/confirm');
const { dumpAuth } = require('../../ux/dumpAuth');
const { validateApiKeyAndSecret, validatePrivateKeyAndAppId } = require('../../utils/validateSDKAuth');

const createConfigDirectory = (configPath) => {
  if (existsSync(configPath)) {
    console.debug('Config directory already exists');
    return true;
  }

  console.info(`Creating configuration directory ${configPath}`);
  mkdirSync(configPath, { recursive: true });
  return true;
};

const checkOkToWrite = async (configPath) => {
  if (!existsSync(configPath)) {
    console.debug('Config file does not exist ok to write');
    return true;
  }

  console.debug('Config file exists, checking if ok to write');
  const okToWrite = await confirm(`Configuration file ${configPath} already exists. Overwrite?`);
  console.debug('Ok to write:', okToWrite);

  return okToWrite;
};

const setApiKeyAndSecret = async (apiKey, apiSecret) => {
  const valid = await validateApiKeyAndSecret(apiKey, apiSecret);
  return valid ? { 'api-key': apiKey, 'api-secret': apiSecret } : false;
};

const setAppIdAndPrivateKey = async (apiKey, apiSecret, appId, privateKey) => {
  if (!appId || !privateKey) {
    console.debug('App ID and Private Key are required');
    return {};
  }

  const valid = await validatePrivateKeyAndAppId(
    apiKey,
    apiSecret,
    appId,
    privateKey,
  );
  return valid ? { 'app-id': appId, 'private-key': privateKey} : false;
};

exports.command = 'set';

exports.desc = 'Set authentication information';

exports.builder = (yargs) => yargs.options({
  'local': {
    describe: 'Save local configuration only',
    type: 'boolean',
  },
}).demandOption(['api-key', 'api-secret']);

exports.handler = async (argv) => {
  const apiKeySecret = await setApiKeyAndSecret(
    argv.config.cli.apiKey,
    argv.config.cli.apiSecret,
  );

  if (apiKeySecret === false) {
    console.error('Invalid API Key or Secret');
    yargs.exit(5);
    return;
  }

  const appIdPrivateKey = await setAppIdAndPrivateKey(
    argv.config.cli.apiKey,
    argv.config.cli.apiSecret,
    argv.config.cli.appId,
    argv.config.cli.privateKey,
  );

  if (appIdPrivateKey === false) {
    console.error('Invalid App ID or Private Key');
    yargs.exit(5);
    return;
  }

  const newAuthInformation = {
    ...apiKeySecret,
    ...appIdPrivateKey,
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
    console.log('Configuration not saved');
    return;
  }

  console.debug(`Writing to: ${configFile}`);

  writeFileSync(configFile, JSON.stringify(newAuthInformation, null, 2));
  console.log(`Configuration saved to ${configFile}`);

  console.log('');
  dumpAuth(newAuthInformation);
};
