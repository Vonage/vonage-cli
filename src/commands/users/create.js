const { makeSDKCall } = require('../../utils/makeSDKCall');
const yargs = require('yargs');
const { appId, privateKey } = require('../../credentialFlags');
const { displayFullUser } = require('../../users/display');
const { coerceUrl } = require('../../utils/coerceUrl');
const { coerceJSON } = require('../../utils/coerceJson');

const userFlags = {
  'name': {
    type: 'string',
    describe: 'Your internal user name. Must be unique. If not supplied a randomly generated name will be used.',
    group: 'User',
  },
  'display-name': {
    type: 'string',
    describe: 'The public facing name of the user',
    group: 'User',
  },
  'image-url': {
    type: 'string',
    describe: 'A URL to an image to associate with the user',
    group: 'User',
    coerce: coerceUrl('image-url'),
  },
  'custom-data': {
    type: 'string',
    describe: 'Custom data (as JSON) to associate with the user',
    group: 'User',
    coerce: coerceJSON('custom-data'),
  },
  'ttl': {
    type: 'number',
    describe: 'Time to leave. After how many seconds an empty user is deleted.',
    group: 'User',
  },

  'pstn-number': {
    type: 'string',
    array: true,
    describe: 'Phone number to associate with the user',
    group: 'pstn',
  },

  'sip-url': {
    type: 'string',
    array: true,
    describe: 'SIP URL to associate with the user',
    group: 'SIP',
  },
  'sip-username': {
    type: 'string',
    array: true,
    describe: 'SIP username to associate with the user',
    group: 'SIP',
    implies: ['sip-url', 'sip-password'],
  },
  'sip-password': {
    type: 'string',
    array: true,
    describe: 'SIP password to associate with the user',
    group: 'SIP',
    implies: ['sip-url', 'sip-username'],
  },

  'websocket-url': {
    type: 'string',
    array: true,
    describe: 'Websocket URL to associate with the user',
    group: 'Websocket',
  },
  'websocket-content-type': {
    type: 'string',
    array: true,
    describe: 'Websocket content type to associate with the user',
    group: 'Websocket',
    implies: ['websocket-url'],
  },
  'websocket-headers': {
    type: 'string',
    array: true,
    describe: 'Websocket headers (input as JSON) to associate with the user',
    group: 'Websocket',
    coerce: coerceJSON('websocket-headers'),
    implies: ['websocket-url'],
  },

  'sms-number': {
    type: 'string',
    array: true,
    describe: 'Phone number that this user can send/receive SMS from',
    group: 'SMS',
  },

  'mms-number': {
    type: 'string',
    array: true,
    describe: 'Phone number that this user can send/receive MMS from',
    group: 'MMS',
  },

  'whats-app-number': {
    type: 'string',
    array: true,
    describe: 'Phone number that this user can send/receive Whats App messages',
    group: 'WhatsApp',
  },

  'viber-number': {
    type: 'string',
    array: true,
    describe: 'Phone number that this user can send/receive Viber messages',
    group: 'Viber',
  },

  'facebook-messenger-id': {
    type: 'string',
    array: true,
    describe: 'Facebook Messenger ID that this user can send/receive messages from',
    group: 'Facebook Messenger',
  },
};

const validateSip = ({sipUrl, sipUsername, sipPassword}) => {
  if (!sipUrl) {
    return true;
  }

  if (!sipUsername
    || !sipPassword
    || sipUsername.length > 0 && sipUsername.length !== sipPassword.length
  ) {
    yargs.exit(2);
    return false;
  }

  return true;
};

const normalizeSip = ({sipUrl, sipUsername, sipPassword}) => sipUrl
  ? sipUrl.reduce(
    (acc, url, index) => [
      ...acc,
      {
        uri: url,
        ...(sipUsername[index] ? {username: sipUsername[index]} : {}),
        ...(sipPassword[index] ? {password: sipPassword[index]} : {}),
      },
    ],
    [],
  )
  : undefined;

const validateWss = ({websocketUrl, websocketHeaders, websocketContentType }) => {
  if (!websocketUrl) {
    return true;
  }

  if (websocketContentType?.length > 0 && websocketContentType.length !==  websocketUrl.length) {
    yargs.exit(2);
    return false;
  }

  if(websocketHeaders?.length > 0 && websocketHeaders.length !== websocketUrl.length) {
    yargs.exit(2);
    return false;
  }

  return true;
};

const normalizeWss = ({websocketUrl, websocketHeaders, websocketContentType }) => websocketUrl
  ? websocketUrl.reduce(
    (acc, url, index) => [
      ...acc,
      {
        url: url,
        ...((websocketContentType || [])[index] ? {contentType: websocketContentType[index]} : {}),
        ...((websocketHeaders || [])[index] ? {headers: websocketHeaders[index]} : {}),
      },
    ],
    [],
  )
  : undefined;

exports.validateSip = validateSip;

exports.normalizeSip = normalizeSip;

exports.validateWss = validateWss;

exports.normalizeWss = normalizeWss;

exports.userFlags = userFlags;

exports.command = 'create';

exports.desc = 'Create a user';

/* istanbul ignore next */
exports.builder = (yargs) => yargs
  .options({
    ...userFlags,
    'app-id': appId,
    'private-key': privateKey,
  });

exports.handler = async (argv) => {
  console.info('Creating user');
  const { SDK } = argv;

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

  console.debug(argv);
  const user = JSON.parse(JSON.stringify({
    name: argv.name,
    displayName: argv.displayName,
    imageUrl: argv.imageUrl,
    properties: {
      customData: argv.customData,
      ttl: argv.ttl,
    },
    channels: {
      sip: normalizeSip(argv),
      websocket: normalizeWss(argv),
      pstn: argv.pstnNumber?.map((number) => ({ number: number })),
      sms: argv.smsNumber?.map((number) => ({ number: number })),
      mms: argv.mmsNumber?.map((number) => ({ number: number })),
      whatsapp: argv.whatsAppNumber?.map((number) => ({ number: number})),
      viber: argv.viberNumber?.map((number) => ({ number: number})),
      messenger: argv.facebookMessengerId?.map((id) => ({ id: id})),
    },
  }));

  const createdUser = await makeSDKCall(
    SDK.users.createUser.bind(SDK.users),
    'Creating User',
    user,
  );

  console.log('');
  displayFullUser(createdUser);
};
