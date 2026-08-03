import { displayApplication } from '../../../../apps/display.js';
import { rtcFlags, updateRTC } from '../../../../apps/rtc.js';
import { makeSDKCall } from '../../../../utils/makeSDKCall.js';
import { dumpCommand } from '../../../../ux/dump.js';
import { apiKey, apiSecret } from '../../../../credentialFlags.js';

export const command = '<id> rtc';

export const description = 'Update rtc capabilities';

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
    ...rtcFlags,
  })
  .example(
    dumpCommand('vonage apps capabilities update <id> rtc [--rtc-event-url <url>] [--rtc-event-method <method>]'),
    'Update RTC capability',
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

  updateRTC(app, argv);

  await makeSDKCall(
    SDK.applications.updateApplication.bind(SDK.applications),
    `Adding ${which} capability to application ${id}`,
    app,
  );
  displayApplication(app);
};
