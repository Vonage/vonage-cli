const yargs = require('yargs');
const { appId, privateKey } = require('../../credentialFlags');
const { makeSDKCall } = require('../../utils/makeSDKCall');
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

/* istanbul ignore next */
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
  const user = await makeSDKCall(
    SDK.users.getUser.bind(SDK.users),
    'Fetching User',
    id,
  );

  const userToUpdate = JSON.parse(JSON.stringify({
    id: user.id,
    name: argv.name ? argv.name : user.name,
    displayName: argv.displayName ? argv.displayName : user.displayName,
    imageUrl: argv.imageUrl ? argv.imageUrl : user.imageUrl,
    properties: {
      customData: argv.customData ? argv.customData : user.properties.customData,
      ttl: argv.ttl ? argv.ttl : user.properties.ttl,
    },
    channels: {
      sip: normalizeSip(argv),
      websocket: normalizeWss(argv),
      pstn: argv.pstnNumber ? argv.pstnNumber?.map((number) => ({ number: number })) : user.channels?.pstn,
      sms: argv.smsNumber ? argv.smsNumber?.map((number) => ({ number: number })) : user.channels?.sms,
      mms: argv.mmsNumber ? argv.mmsNumber?.map((number) => ({ number: number })) : user.channels?.mms,
      whatsapp: argv.whatsAppNumber ? argv.whatsAppNumber?.map((number) => ({ number: number})) : user.channels?.whatsapp,
      viber: argv.viberNumber ? argv.viberNumber?.map((number) => ({ number: number})) : user.channels?.viber,
      messenger: argv.facebookMessengerId ? argv.facebookMessengerId?.map((id) => ({ id: id})) : user.channels?.messenger,
    },
  }));

  console.debug('User to update:', userToUpdate);

  const updatedUser = await makeSDKCall(
    SDK.users.updateUser.bind(SDK.users),
    'Updating User',
    userToUpdate,
  );

  console.log('');
  displayFullUser(updatedUser);
};
