const yargs = require('yargs');
const { dumpAuth } = require('../../ux/dumpAuth');
const { validateApiKeyAndSecret, validatePrivateKeyAndAppId } = require('../../utils/validateSDKAuth');
const { writeJSONFile, createDirectory } = require('../../utils/fs');

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

  if (!argv.local && createDirectory(configPath) === false) {
    return;
  }

  const configFile = argv.local
    ? argv.config.localConfigFile
    : argv.config.globalConfigFile;

  try {
    await writeJSONFile(
      configFile,
      newAuthInformation,
      `Configuration file ${configFile} already exists. Overwrite?`,
    );

    console.log('');
    dumpAuth(newAuthInformation);
  } catch (error) {
    console.error('Failed to save new configuration', error);
  }
};
