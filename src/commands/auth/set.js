const { existsSync, writeFileSync, mkdir } = require('fs');
const { confirm } = require('../../ux/confirm');
const { dumpAuth } = require('../../ux/dumpAuth');

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

exports.command = 'set';

exports.desc = 'Set authentication information';

exports.builder = (yargs) => yargs.options({
  'local': {
    describe: 'Save local configuration only',
    type: 'boolean',
  },
});

exports.handler = async (argv) => {
  console.info('Saving auth information');

  const newAuthInformation = {
    'api-key': argv.apiKey,
    'api-secret': argv.apiSecret,
    'private-key': argv.privateKey,
    'app-id': argv.appId,
  };

  console.debug('New auth information:', newAuthInformation);
  const configPath = argv.local
    ? argv.config.localConfigPath
    : argv.config.globalConfigPath;

  console.debug(`Config path (${argv.local ? 'local' : 'global'}): ${configPath}`);

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
