import YAML from 'yaml';
import { makeSDKCall } from '../../utils/makeSDKCall.js';
import { displayApplication } from '../../apps/display.js';
import { Client } from '@vonage/server-client';
import { apiKey, apiSecret } from '../../credentialFlags.js';
import { json, yaml } from '../../commonFlags.js';
import { dumpCommand } from '../../ux/dump.js';

export const command = 'show <id>';

export const desc = 'Get information for an application';

/* istanbul ignore next */
export const builder = (yargs) => yargs
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

export const handler = async (argv) => {
  console.info(`Show information for application ${argv.id}`);
  const { SDK, id } = argv;

  const app = await makeSDKCall(
    SDK.applications.getApplication.bind(SDK.applications),
    'Fetching Application',
    id,
  );

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
