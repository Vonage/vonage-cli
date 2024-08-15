const { existsSync, writeFileSync, mkdir } = require('fs');

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

  const configPath = argv.local
    ? argv.config.localConfigPath
    : argv.config.globalConfigPath;

  console.debug(`Config path (${argv.local ? 'local' : 'global'}): ${configPath}`);

  if (!existsSync(configPath)) {
    console.debug('Creating config directory');
    mkdir(configPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating config directory:', err);
        return;
      }
    });
  }

  const newAuthInformation = {
    'api-key': argv.apiKey,
    'api-secret': argv.apiSecret,
    'private-key': argv.privateKey,
    'app-id': argv.appId,
  };

  console.debug('New auth information:', newAuthInformation);
};
