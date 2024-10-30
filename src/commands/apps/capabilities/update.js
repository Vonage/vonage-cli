const yargs = require('yargs');
const { displayApplication } = require('../../../apps/display');
const { writeAppToSDK } = require('../../../apps/writeAppToSDK');
const { loadAppFromSDK } = require('../../../apps/loadAppFromSDK');
const { rtcFlags, updateRTC } = require('../../../apps/rtc');
const { verifyFlags, updateVerify } = require('../../../apps/verify');
const { videoFlags, updateVideo } = require('../../../apps/video');
const { voiceFlags, updateVoice } = require('../../../apps/voice');
const { messageFlags, updateMessages } = require('../../../apps/message');
const { networkFlags, updateNetwork } = require('../../../apps/network');
const { dumpCommand } = require('../../../ux/dump');
const { capabilities } = require('../../../apps/capabilities');
const { apiKey, apiSecret } = require('../../../credentialFlags');
const  camelCase  = require('camelcase');

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

exports.command = 'update <id> <which>';

exports.description = 'Update application capabilities';

exports.builder = (yargs) => yargs
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

exports.handler = async (argv) => {
  const { id, which } = argv;
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
    yargs.exit(1);
    return;
  }

  // Check for required flags (yargs cant nativly do this)
  if (Object.keys(capabilityFlags).length < 1) {
    console.error(`You must provide at least one ${dumpCommand(which + '-*')} flag when updating the ${which} capability`);
    yargs.exit(1);
    return;
  }

  const app = await loadAppFromSDK(argv.SDK, id);
  console.debug(`Loaded application ${app.name} (${app.id})`);

  if (!app.capabilities) {
    app.capabilities = {};
  }

  capabilityUpdateFunctions[which](app, capabilityFlags);

  app.capabilities = clearRemoved(app.capabilities);

  await writeAppToSDK(argv.SDK, app);
  displayApplication(app);
};
