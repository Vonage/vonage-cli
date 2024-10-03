const yargs = require('yargs');
const { Client } = require('@vonage/server-client');
const yaml = require('yaml');
const { writeFile } = require('../../utils/fs');
const { displayApplication } = require('../../apps/display');
const { coerceKey } = require('../../utils/coerceKey');

exports.command = 'create <name>';

exports.desc = 'Create a new application';

exports.builder = (yargs) => yargs
  .positional(
    'name',
    {
      describe: 'The name you want to give the application',
    },
  ).options({
    'private-key-file': {
      describe: 'Path where you want to save the private key file',
      default: process.cwd() + '/private.key',
      type: 'string',
      group: 'Create Application',
    },
    'improve-ai': {
      describe: 'Allow Vonage to improve AI models by using your data',
      type: 'boolean',
      group: 'Create Application',
    },
    'public-key-file': {
      describe: 'Path to a public key file you want to use for this application',
      type: 'string',
      group: 'Create Application',
      coerce: coerceKey('public'),
    },
    // Flags from higher level that do not apply to this command
    'app-name': {
      hidden: true,
    },
    'capability': {
      hidden: true,
    },
    'app-id': {
      hidden: true,
    },
    'private-key': {
      hidden: true,
    },
  });

exports.handler = async (argv) => {
  console.info('Creating new application');
  console.debug('Arguments:', argv);
  let newApplication;
  let dumpPrivateKey = false;

  const appData = {
    name: argv.name,
    privacy: {
      improveAI: argv.improveAi,
    },
    keys: {
      publicKey: argv.publicKeyFile,
    },
  };

  try {
    console.debug('Creating application', appData);
    newApplication = await argv.SDK.applications.createApplication(appData);

  } catch (error) {
    if ([401, 403].includes(error.response?.status)) {
      console.error(error.response.data);
      yargs.exit(5);
      return;
    }

    console.error(`Error creating application: ${error.message}` );
    yargs.exit(99);
    return;
  }

  try {
    if (argv.privateKeyFile) {
      console.debug(`Saving private key to file: ${argv.privateKeyFile}`);
      await writeFile(argv.privateKeyFile, newApplication.keys.privateKey);
    }
  } catch (error) {
    console.error('Error saving private key:', error);
    dumpPrivateKey = true;
  }

  if (argv.json) {
    console.log(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(newApplication, true, false),
      null,
      2,
    ));
    return;
  }

  if (argv.yaml) {
    console.log(yaml.stringify(
      Client.transformers.snakeCaseObjectKeys(newApplication, true, false),
    ));
    return;
  }

  console.log('Application created');
  displayApplication(newApplication);
  if (dumpPrivateKey) {
    console.log('');
    console.log('Private key:');
    console.log(newApplication.keys.privateKey);
  }
};
