const { existsSync, writeFileSync, mkdir } = require('fs');
const { confirm } = require('../../ux/confirm');

const createConfigDirectory = async (configPath) => {
  if (existsSync(configPath)) {
    console.debug('Config directory already exists');
    return true;
  }

  console.info(`Creating configuration directory ${configPath}`);

  mkdir(configPath, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating config directory:', err);
      return false;
    }
  });

  return true;
};

const checkOkToWrite = async (configPath) => {
  if (!existsSync(configPath)) {
    return true;
  }

  return confirm('Configuration file already exists. Overwrite?');
};
exports.command = 'set';

exports.desc = 'Set authentication information';

exports.builder = (yargs) => yargs.options({
  'local': {
    describe: 'Save local configuration only',
    type: 'boolean',
  },
}).demandOption(['api-key', 'api-secret', 'private-key', 'app-id']);

exports.handler = async (argv) => {
  console.info('Saving auth information');
  console.debug(JSON.stringify(argv.config, null, 2));

  const configPath = argv.local
    ? argv.config.localConfigPath
    : argv.config.globalConfigPath;

  console.debug(`Config path (${argv.local ? 'local' : 'global'}): ${configPath}`);

  if (!argv.local && !await createConfigDirectory(configPath)) {
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

  const newAuthInformation = {
    'api-key': argv.apiKey,
    'api-secret': argv.apiSecret,
    'private-key': argv.privateKey,
    'app-id': argv.appId,
  };

  console.debug('New auth information:', newAuthInformation);
  writeFileSync(configFile, JSON.stringify(newAuthInformation, null, 2));
  console.log(`Configuration saved to ${configFile}`);
};
