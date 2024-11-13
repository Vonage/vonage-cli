const { spinner } = require('../../ux/spinner');
const yargs = require('yargs');
const { appId, privateKey } = require('../../credentialFlags');
const { sdkError } = require('../../utils/sdkError');
const { loadUserFromSDK } = require('../../users/loadUserFromSDK');
const { displayFullUser } = require('../../users/display');
const {
  userFlags,
  validateSip,
  validateWss,
  normalizeSip,
  normalizeWss,
} = require('./create');

exports.command = 'update <id>';

exports.desc = 'Update a user';

exports.builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'User ID',
      type: 'string',
    },
  )
  .options({
    ...userFlags,
    'app-id': appId,
    'private-key': privateKey,
  });

exports.handler = async (argv) => {
  console.info('Updating user');

  if (!validateSip(argv)) {
    console.error('Invalid SIP configuration');
    yargs.exit(2);
    return;
  }

  if (!validateWss(argv)) {
    console.error('Invalid Websocket configuration');
    yargs.exit(2);
    return;
  }

  const { SDK, id } = argv;
  const user = await loadUserFromSDK(SDK, id);
  if (!user) {
    console.error('No user found');
    return;
  }

  const { stop, fail } = spinner({
    message: 'Updating user',
  });

  let updatedUser;
  try {
    const userToUpdate = {
      ...user,
      name: argv.name,
      displayName: argv.displayName,
      imageUrl: argv.imageUrl,
      properties: {
        ...(user.properties || {}),
        customData: argv.customData,
        ttl: argv.ttl,
      },
      channels: {
        ...(user.channels || {}),
        sip: normalizeSip(argv),
        websocket: normalizeWss(argv),
        pstn: argv.pstnNumber.map((number) => ({ number: number })),
        sms: argv.smsNumber.map((number) => ({ number: number })),
        mms: argv.mmsNumber.map((number) => ({ number: number })),
        whatsapp: argv.whatsAppNumber.map((number) => ({ number: number})),
        viber: argv.viberNumber.map((number) => ({ number: number})),
        messenger: argv.facebookMessengerId.map((id) => ({ id: id})),
      },
    };

    console.debug('Updating user', userToUpdate);
    updatedUser = await SDK.users.updateUser(userToUpdate);
    console.debug('User updated', updatedUser);
    stop();
  } catch (error) {
    fail();
    sdkError(error);
    return;
  }

  console.log('');
  displayFullUser(updatedUser);
};
