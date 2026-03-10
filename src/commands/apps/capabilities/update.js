import yargs from 'yargs';
import { displayApplication } from '../../../apps/display.js';
import { rtcFlags, updateRTC } from '../../../apps/rtc.js';
import { makeSDKCall } from '../../../utils/makeSDKCall.js';
import { verifyFlags, updateVerify } from '../../../apps/verify.js';
import { videoFlags, updateVideo } from '../../../apps/video.js';
import { voiceFlags, updateVoice } from '../../../apps/voice.js';
import { messageFlags, updateMessages } from '../../../apps/message.js';
import { networkFlags, updateNetwork } from '../../../apps/network.js';
import { dumpCommand } from '../../../ux/dump.js';
import { capabilities } from '../../../apps/capabilities.js';
import { apiKey, apiSecret } from '../../../credentialFlags.js';
import camelCase from 'camelcase';

const y = yargs();

const allFlags = {
  ...rtcFlags,
  ...videoFlags,
  ...voiceFlags,
  ...verifyFlags,
  ...messageFlags,
  ...networkFlags,
};

const capabilityUpdateFunctions = {
  'messages': updateMessages,
  'network_apis': updateNetwork,
  'rtc': updateRTC,
  'verify': updateVerify,
  'video': updateVideo,
  'voice': updateVoice,
};

const clearRemoved = (obj) => Object.fromEntries(Object.entries(obj).reduce(
  (acc, [key, value]) => {
    if (value?.constructor.name === 'Object') {
      acc.push([key, clearRemoved(value)]);
      return acc;
    };

    if (value !== '__REMOVE__') {
      acc.push([key, value]);
    }

    return acc;
  },
  [],
));

export const command = 'update <id> <which>';

export const description = 'Update application capabilities';

export const builder = (yargs) => yargs
  .positional(
    'which',
    {
      describe: 'Capability to update',
      choices: capabilities,
    },
  )
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
    ...allFlags,
  })
  .example(
    dumpCommand('vonage apps capabilities update 000[...]000 verify --verify-status-url="https://example.com/verify"'),
    'Update the verify status url',
  );

export const handler = async (argv) => {
  const { SDK, id, which } = argv;
  console.info(`Modifying ${which} capability on application: ${id}`);

  const invalidFlags = [];
  const capabilityFlags = Object.keys(allFlags).reduce(
    (acc, flag) => {
      const flagGroup = flag.split('-')[0];
      const camelFlag = camelCase(flag);

      if (argv[camelFlag]
        && flagGroup !== (which === 'network_apis' ? 'network' : which)
      ) {
        invalidFlags.push(flag);
        console.debug(`Invalid flag for ${argv.which}: ${camelFlag}`);
      }

      if (Object.keys(argv).includes(camelFlag)) {
        acc[camelFlag] = argv[camelFlag];
      }

      return acc;
    },
    {},
  );

  invalidFlags.sort();

  // Check for any invalid flags
  if (invalidFlags.length > 0) {
    console.error(`You cannot use the flag(s) [${invalidFlags.join(', ')}] when updating the ${which} capability`);
    y.exit(1);
    return;
  }

  // Check for required flags (yargs cant nativly do this)
  if (Object.keys(capabilityFlags).length < 1) {
    console.error(`You must provide at least one ${dumpCommand(which + '-*')} flag when updating the ${which} capability`);
    y.exit(1);
    return;
  }

  const app = await makeSDKCall(
    SDK.applications.getApplication.bind(SDK.applications),
    'Fetching Application',
    id,
  );
  console.debug(`Loaded application ${app.name} (${app.id})`);

  if (!app.capabilities) {
    app.capabilities = {};
  }

  capabilityUpdateFunctions[which](app, capabilityFlags);

  app.capabilities = clearRemoved(app.capabilities);

  await makeSDKCall(
    SDK.applications.updateApplication.bind(SDK.applications),
    `Adding ${which} capability to application ${id}`,
    app,
  );
  displayApplication(app);
};
