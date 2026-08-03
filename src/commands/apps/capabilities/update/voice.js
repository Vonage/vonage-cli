import { displayApplication } from '../../../../apps/display.js';
import { makeSDKCall } from '../../../../utils/makeSDKCall.js';
import { voiceFlags, updateVoice } from '../../../../apps/voice.js';
import { dumpCommand } from '../../../../ux/dump.js';
import { apiKey, apiSecret } from '../../../../credentialFlags.js';

export const command = '<id> voice';

export const description = 'Update voice capabilities';

export const builder = (yargs) => yargs
  .options({
    'api-key': apiKey,
    'api-secret': apiSecret,
    ...voiceFlags,
  })
  .example(
    dumpCommand('vonage apps capabilities update <id> voice [--voice-event-url <url>]'),
    'Update voice capability webhooks',
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

  await updateVoice(app, argv);

  await makeSDKCall(
    SDK.applications.updateApplication.bind(SDK.applications),
    `Adding ${which} capability to application ${id}`,
    app,
  );
  displayApplication(app);
};
