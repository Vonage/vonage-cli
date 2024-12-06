const { Client } = require('@vonage/server-client');
const chalk = require('chalk');
const YAML = require('yaml');
const { writeFile } = require('../../utils/fs');
const { makeSDKCall } = require('../../utils/makeSDKCall');
const { displayApplication } = require('../../apps/display');
const { dumpCommand } = require('../../ux/dump');
const { coerceKey } = require('../../utils/coerceKey');
const { apiKey, apiSecret } = require('../../credentialFlags');
const { json, yaml, force } = require('../../commonFlags');

exports.command = 'create <name>';

exports.desc = 'Create a new application';

/* istanbul ignore next */
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
      implies: 'public-key',
    },
    'improve-ai': {
      describe: 'Allow Vonage to improve AI models by using your data',
      type: 'boolean',
      default: false,
      group: 'Create Application',
    },
    'public-key-file': {
      describe: 'Path to a public key file you want to use for this application',
      type: 'string',
      group: 'Create Application',
      coerce: coerceKey('public'),
    },
    'api-key': apiKey,
    'api-secret': apiSecret,
    'force': force,
    'json': json,
    'yaml': yaml,
  })
  .example(
    dumpCommand('vonage apps create "My New Application"'),
    'Create a new application with the name "My New Application"',
  )
  .example(
    dumpCommand('vonage apps create "My New Application" --public-key=./public.key'),
    'Create a new application with the name "My New Application" and a public key from ./public.key',
  )
  .epilogue([
    `After creating the application, you can use ${dumpCommand('vonage apps capability')} to manage the capabilities.`,
    `${chalk.bold('Note:')} The private key is only shown once and cannot be retrieved later. You will have to use ${dumpCommand('vonage apps update')} to generate a new private key.`,
  ].join('\n'));

exports.handler = async (argv) => {
  console.info('Creating new application');
  let dumpPrivateKey = false;
  const { SDK } = argv;

  const appData = {
    name: argv.name,
    privacy: {
      improveAI: argv.improveAi,
    },
    keys: {
      publicKey: argv.publicKeyFile,
    },
  };

  const newApplication = await makeSDKCall(
    SDK.applications.createApplication.bind(SDK.applications),
    'Creating Application',
    appData,
  );

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
    console.log(YAML.stringify(
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
