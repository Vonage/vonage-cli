const yaml = require('yaml');
const { loadAppFromSDK } = require('../../apps/loadAppFromSDK');
const { displayApplication } = require('../../apps/display');
const { coerceKey } = require('../../utils/coerceKey');
const { Client } = require('@vonage/server-client');
const { writeAppToSDK } = require('../../apps/writeAppToSDK');
const { apiKey, apiSecret } = require('../../credentialFlags');
const { dumpCommand } = require('../../ux/dump');

exports.command = 'update <id>';

exports.desc = 'Create a new application';

exports.builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'The ID of the application to delete',
    },
  ).options({
    'api-key': apiKey,
    'api-secret': apiSecret,
    'name': {
      describe: 'The name you want to give the application',
      type: 'string',
      group: 'Update Application',
    },
    'improve-ai': {
      describe: 'Allow Vonage to improve AI models by using your data',
      type: 'boolean',
      group: 'Update Application',
    },
    'public-key-file': {
      describe: 'Path to a public key file you want to use for this application',
      type: 'string',
      group: 'Update Application',
      coerce: coerceKey('public'),
    },
  })
  .example(
    dumpCommand('vonage apps update 000[...]000 --name "New Name"'),
    'Update the name of application 000[...]000',
  );

;

exports.handler = async (argv) => {
  console.info(`Updating application: ${argv.id}`);

  const currentApplication = await loadAppFromSDK(argv.SDK, argv.id);
  let changed = false;

  if (argv.name !== undefined
    && argv.name !== currentApplication.name
  ) {
    console.debug('Updating name');
    currentApplication.name = argv.name;
    changed = true;
  }

  if (argv.improveAi !== undefined
    && argv.improveAi !== currentApplication.privacy.improveAi
  ) {
    console.debug('Updating improveAI');
    currentApplication.privacy.improveAi = argv.improveAi;
    changed = true;
  }

  if (argv.publicKeyFile !== undefined
    && argv.publicKeyFile !== currentApplication.keys.publicKey
  ) {
    console.debug('Updating publicKey');
    currentApplication.keys.publicKey = argv.publicKeyFile;
    changed = true;
  }

  if (changed) {
    console.debug('Changes detected applying updates');
    await writeAppToSDK(argv.SDK, currentApplication);
  }

  if (argv.json) {
    console.log(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(currentApplication, true),
      null,
      2,
    ));
    return;
  }

  if (argv.yaml) {
    console.log(yaml.stringify(
      Client.transformers.snakeCaseObjectKeys(currentApplication, true),
    ));
    return;
  }

  if (!changed) {
    console.log('No changes detected');
  }

  console.log('');
  displayApplication(currentApplication);
};
