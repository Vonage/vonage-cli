import { displayApplication } from '../../../../apps/display.js';
import { makeSDKCall } from '../../../../utils/makeSDKCall.js';
import { networkFlags, updateNetwork } from '../../../../apps/network.js';
import { dumpCommand } from '../../../../ux/dump.js';
import { apiKey, apiSecret } from '../../../../credentialFlags.js';

export const command = '<id> network_apis';

export const description = 'Update network APIs capabilities';

export const builder = (yargs) => yargs
  .positional(
    'id',
    {
      type: 'string',
      describe: 'The application ID',
    },
  )
  .options({
    'api-key': apiKey,
    'api-secret': apiSecret,
    ...networkFlags,
  })
  .example(
    dumpCommand('vonage apps capabilities update <id> network_apis [--network-app-id <id>] [--network-redirect-url <url>]'),
    'Update network APIs capability',
  );

export const handler = async (argv) => {
  const { SDK, id, which } = argv;
  console.info(`Modifying ${which} capability on application: ${id}`);

  const app = await makeSDKCall(
    SDK.applications.getApplication.bind(SDK.applications),
    'Fetching Application',
    id,
  );

  console.debug(`Loaded application ${app.name} (${app.id})`);

  updateNetwork(app, argv);

  await makeSDKCall(
    SDK.applications.updateApplication.bind(SDK.applications),
    `Adding ${which} capability to application ${id}`,
    app,
  );
  displayApplication(app);
};
