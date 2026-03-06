import { confirm } from '../../ux/confirm.js';
import { makeSDKCall } from '../../utils/makeSDKCall.js';
import { force } from '../../commonFlags.js';
import { apiKey, apiSecret } from '../../credentialFlags.js';
import { dumpCommand } from '../../ux/dump.js';

export const command = 'delete <id>';

export const desc = 'Delete application';

/* istanbul ignore next */
export const builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'The ID of the application to delete',
    },
  ).options({
    'api-key': apiKey,
    'api-secret': apiSecret,
    force: force,
  })
  .example(
    dumpCommand('vonage apps delete 000[...]000'),
    'Delete application with ID 000[...]000',
  );

export const handler = async (argv) => {
  console.info(`Deleting application: ${argv.id}`);

  const { SDK, id } = argv;

  const app = await makeSDKCall(
    SDK.applications.getApplication.bind(SDK.applications),
    'Fetching Application',
    id,
  );

  const okToDelete = await confirm(`Delete application ${app.name} (${app.id})?`);

  if (!okToDelete) {
    return;
  }

  await makeSDKCall(
    SDK.applications.deleteApplication.bind(SDK.applications),
    'Deleting application',
    id,
  );
};
