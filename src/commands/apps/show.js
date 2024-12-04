const YAML = require('yaml');
const { makeSDKCall } = require('../../utils/makeSDKCall');
const { displayApplication } = require('../../apps/display');
const { Client } = require('@vonage/server-client');
const { apiKey, apiSecret } = require('../../credentialFlags');
const { json, yaml } = require('../../commonFlags');
const { dumpCommand } = require('../../ux/dump');

exports.command = 'show <id>';

exports.desc = 'Get information for an application';

/* istanbul ignore next */
exports.builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'The ID of the application to show',
    },
  )
  .options({
    'api-key': apiKey,
    'api-secret': apiSecret,
    'yaml': yaml,
    'json': json,
  })
  .example(
    dumpCommand('vonage apps show 000[...]000'),
    'Show information for application 000[...]000',
  );

exports.handler = async (argv) => {
  console.info(`Show information for application ${argv.id}`);
  const { SDK, id } = argv;

  const app = await makeSDKCall(SDK.applications.getApplication, 'Fetching Application', id);

  if (argv.yaml) {
    console.log(YAML.stringify(
      Client.transformers.snakeCaseObjectKeys(app, true, false),
    ));
    return;
  }

  if (argv.json) {
    console.log(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(app, true, false),
      null,
      2,
    ));
    return;
  }

  displayApplication(app);
};
