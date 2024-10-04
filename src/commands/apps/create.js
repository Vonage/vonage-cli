const { Client } = require('@vonage/server-client');
const yaml = require('yaml');
const { writeAppToSDK } = require('../../apps/writeAppToSDK');
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

  const newApplication = await writeAppToSDK(argv.SDK, appData);

  // writeAppToSDK should exit the process but there might be a delay and we
  // don't want to have any other errors get thrown
  if (!newApplication) {
    return;
  }

  try {
    if (argv.privateKeyFile) {
      process.stderr.write('Saving private key ...');
      await writeFile(argv.privateKeyFile, newApplication.keys.privateKey);
      process.stderr.write('\rSaving private key ... Done!\n');
    }
  } catch (error) {
    process.stderr.write('\rSaving private key ... Failed\n');
    console.error('Error saving private key:', error);
    dumpPrivateKey = true;
  }

  if (argv.json) {
    console.log(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(newApplication, true),
      null,
      2,
    ));
    return;
  }

  if (argv.yaml) {
    console.log(yaml.stringify(
      Client.transformers.snakeCaseObjectKeys(newApplication, true),
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
