const yaml = require('yaml');
const { displayApplication } = require('../../apps/display');
const { makeSDKCall } = require('../../utils/makeSDKCall');
const { coerceKey } = require('../../utils/coerceKey');
const { Client } = require('@vonage/server-client');
const { apiKey, apiSecret } = require('../../credentialFlags');
const { dumpCommand } = require('../../ux/dump');

exports.command = 'update <id>';

exports.desc = 'Create a new application';

/* istanbul ignore next */
exports.builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'The ID of the application to delete',
    },
  ).options({
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
    'api-key': apiKey,
    'api-secret': apiSecret,
  })
  .example(
    dumpCommand('vonage apps update 000[...]000 --name "New Name"'),
    'Update the name of application 000[...]000',
  );

exports.handler = async (argv) => {
  console.info(`Updating application: ${argv.id}`);
  const { SDK, id } = argv;

  const app = await makeSDKCall(
    SDK.applications.getApplication.bind(SDK.applications),
    'Fetching Application',
    id,
  );

  let changed = false;

  if (argv.name !== undefined
    && argv.name !== app.name
  ) {
    console.debug('Updating name');
    app.name = argv.name;
    changed = true;
  }

  if (argv.improveAi !== undefined
    && argv.improveAi !== app.privacy.improveAi
  ) {
    console.debug(`Updating improveAI from ${app.privacy.improveAi} to ${argv.improveAi}`);
    app.privacy.improveAi = argv.improveAi;
    changed = true;
  }

  if (argv.publicKeyFile !== undefined
    && argv.publicKeyFile !== app.keys.publicKey
  ) {
    console.debug('Updating publicKey');
    app.keys.publicKey = argv.publicKeyFile;
    changed = true;
  }

  if (changed) {
    console.debug('Changes detected applying updates');
    await makeSDKCall(
      SDK.applications.updateApplication.bind(SDK.applications),
      'Updating Application',
      app,
    );
  }

  if (argv.json) {
    console.log(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(app, true),
      null,
      2,
    ));
    return;
  }

  if (argv.yaml) {
    console.log(yaml.stringify(
      Client.transformers.snakeCaseObjectKeys(app, true),
    ));
    return;
  }

  if (!changed) {
    console.log('No changes detected');
  }

  console.log('');
  displayApplication(app);
};
