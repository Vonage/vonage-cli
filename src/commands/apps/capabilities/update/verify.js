import { displayApplication } from '../../../../apps/display.js';
import { makeSDKCall } from '../../../../utils/makeSDKCall.js';
import { verifyFlags, updateVerify } from '../../../../apps/verify.js';
import { dumpCommand } from '../../../../ux/dump.js';
import { apiKey, apiSecret } from '../../../../credentialFlags.js';

export const command = '<id> verify';

export const description = 'Update verify capabilities';

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
    ...verifyFlags,
  })
  .example(
    dumpCommand('vonage apps capabilities update 000[...]000 verify --verify-status-url="https://example.com/verify"'),
    'Update the verify status url',
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

  updateVerify(app, argv);


  await makeSDKCall(
    SDK.applications.updateApplication.bind(SDK.applications),
    `Adding ${which} capability to application ${id}`,
    app,
  );
  displayApplication(app);
};
