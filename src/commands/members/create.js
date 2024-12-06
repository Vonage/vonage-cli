const { conversationIdFlag } = require('../../conversations/conversationFlags');
const { displayFullMember } = require('../../members/display');
const { appId, privateKey } = require('../../credentialFlags');
const { yaml, json } = require('../../commonFlags');
const YAML = require('yaml');
const { Client } = require('@vonage/server-client');
const { makeSDKCall } = require('../../utils/makeSDKCall');

exports.command = 'create <conversation-id>';

exports.desc = 'Create a member in a conversation';

exports.builder = (yargs) => yargs
  .positional(
    'conversation-id',
    conversationIdFlag,
  )
  .options({
    'state': {
      describe: 'Member state',
      type: 'string',
      choices: ['joined', 'invited'],
      group: 'Member',
    },
    'user-id': {
      describe: 'User ID of the member',
      type: 'string',
      conflicts: ['user-name'],
      group: 'Member',
    },
    'user-name': {
      describe: 'User name of the member',
      type: 'string',
      conflicts: ['user-id'],
      group: 'Member',
    },

    // Channel flags
    'channel-from-type': {
      array: true,
      describe: 'Which channel types this member accepts messages from (if not set, all are accepted)',
      type: 'string',
      choices: ['app', 'phone', 'sms', 'mms', 'whatsapp', 'viber', 'messenger'],
      group: 'Member Channel',
    },

    // App
    'channel-to-user': {
      describe: 'The user ID of the member that this member can send messages to.',
      type: 'string',
      conflicts: [
        'channel-to-phone',
        'channel-to-sms',
        'channel-to-mms',
        'channel-to-whatsapp',
        'channel-to-viber',
        'channel-to-messenger',
      ],
      group: 'Member Channel',
    },

    // Phone Channel
    'channel-to-phone': {
      describe: 'The phone number of the member that this member can call.',
      type: 'string',
      conflicts: [
        'channel-to-user',
        'channel-to-sms',
        'channel-to-mms',
        'channel-to-whatsapp',
        'channel-to-viber',
        'channel-to-messenger',
      ],
      implies: ['channel-from-phone'],
      group: 'Member Channel',
    },

    'channel-from-phone': {
      describe: 'The phone number of the member that this member accepts calls from.',
      type: 'string',
      conflicts: [
        'channel-to-user',
        'channel-to-sms',
        'channel-to-mms',
        'channel-to-whatsapp',
        'channel-to-viber',
        'channel-to-messenger',
      ],
      group: 'Member Channel',
    },

    // SMS Channel
    'channel-to-sms': {
      describe: 'The phone number of the member that this member can send sms messages to.',
      type: 'string',
      conflicts: [
        'channel-to-user',
        'channel-to-phone',
        'channel-to-mms',
        'channel-to-whatsapp',
        'channel-to-viber',
        'channel-to-messenger',
      ],
      group: 'Member Channel',
    },

    // MMS Channel
    'channel-to-mms': {
      describe: 'The phone number of the member that this member can send mms messages to.',
      type: 'string',
      conflicts: [
        'channel-to-user',
        'channel-to-phone',
        'channel-to-sms',
        'channel-to-whatsapp',
        'channel-to-viber',
        'channel-to-messenger',
      ],
      group: 'Member Channel',
    },

    // WhatsApp Channel
    'channel-to-whatsapp': {
      describe: 'The phone number of the member that this member can send WhatsApp messages to.',
      type: 'string',
      conflicts: [
        'channel-to-user',
        'channel-to-phone',
        'channel-to-sms',
        'channel-to-mms',
        'channel-to-viber',
        'channel-to-messenger',
      ],
      group: 'Member Channel',
    },

    // Viber Channel
    'channel-to-viber': {
      describe: 'The id of the member that this member can send viber messages to.',
      type: 'string',
      conflicts: [
        'channel-to-user',
        'channel-to-phone',
        'channel-to-sms',
        'channel-to-mms',
        'channel-to-whatsapp',
        'channel-to-messenger',
      ],
      group: 'Member Channel',
    },

    // Messenger Channel
    'channel-to-messenger': {
      describe: 'The id of the member that this member can send messenger messages to.',
      type: 'string',
      conflicts: [
        'channel-to-user',
        'channel-to-phone',
        'channel-to-sms',
        'channel-to-mms',
        'channel-to-whatsapp',
        'channel-to-viber',
      ],
      group: 'Member Channel',
    },

    // Audio
    'audio-enabled': {
      describe: 'Audio enabled',
      type: 'boolean',
      group: 'Member Audio',
    },
    'audio-earmuffed': {
      describe: 'Audio earmuffed',
      type: 'boolean',
      group: 'Member Audio',
    },
    'audio-muted': {
      describe: 'Audio muted',
      type: 'boolean',
      group: 'Member Audio',
    },
    'audio': {
      describe: 'Is an audio connection possible',
      type: 'boolean',
      group: 'Member Audio',
    },

    // Invitation
    'knocking-id': {
      describe: 'Knocker ID. A knocker is a pre-member of a conversation who does not exist yet',
      type: 'string',
      group: 'Member',
    },
    'member-id-inviting': {
      describe: 'Member ID of the member that sends the invitation',
      type: 'string',
      group: 'Member',
    },
    'from-member-id': {
      describe: 'Member ID of the member that sends the invitation',
      type: 'string',
      group: 'Member',
    },
    'app-id': appId,
    'private-key': privateKey,
    'yaml': yaml,
    'json': json,
  })
  .demandOption(['state', 'channel-from-type']);


const addChannelToMember = (member, argv) => {
  if (argv.channelToUser) {
    return addUserChannel(member, argv);
  }

  if (argv.channelToPhone) {
    return addPhoneChannel(member, argv);
  }

  if (argv.channelToSms) {
    return addSMSChannel(member, argv);
  }

  if (argv.channelToMms) {
    return addMMSChannel(member, argv);
  }

  if (argv.channelToWhatsapp) {
    return addWhatsAppChannel(member, argv);
  }

  if (argv.channelToViber) {
    return addViberChannel(member, argv);
  }

  if (argv.channelToMessenger) {
    return addMessengerChannel(member, argv);
  }
};

const addUserChannel = (member, argv) => Object.assign(
  member,
  {
    channel: {
      ...member.channel,
      type: 'app',
      to: {
        type: 'app',
        user: argv.channelToUser,

      },
    },
  },
);

const addPhoneChannel = (member, argv) => Object.assign(
  member,
  {
    channel: {
      ...member.channel,
      type: 'phone',
      to: {
        type: 'phone',
        number: argv.channelToPhone,
      },
    },
  },
);

const addSMSChannel = (member, argv) => Object.assign(
  member,
  {
    channel: {
      ...member.channel,
      type: 'sms',
      to: {
        type: 'sms',
        number: argv.channelToSms,
      },
    },
  },
);

const addMMSChannel = (member, argv) => Object.assign(
  member,
  {
    channel: {
      ...member.channel,
      type: 'mms',
      to: {
        number: argv.channelToMms,
      },
    },
  },
);

const addWhatsAppChannel = (member, argv) => Object.assign(
  member,
  {
    channel: {
      ...member.channel,
      type: 'whatsapp',
      to: {
        number: argv.channelToWhatsapp,
      },
    },
  },
);

const addViberChannel = (member, argv) => Object.assign(
  member,
  {
    channel: {
      ...member.channel,
      type: 'viber',
      to: {
        id: argv.channelToViber,
      },
    },
  },
);

const addMessengerChannel = (member, argv) => Object.assign(
  member,
  {
    channel: {
      ...member.channel,
      type: 'messenger',
      to: {
        id: argv.channelToMessenger,
      },
    },
  },
);

exports.handler = async (argv) => {
  console.info('Create member');

  const { SDK, conversationId } = argv;

  await makeSDKCall(
    SDK.conversations.getConversation.bind(SDK.conversations),
    'Fetching conversation',
    conversationId,
  );

  const member = JSON.parse(JSON.stringify(addChannelToMember({
    user: {
      id: argv.userId,
      name: argv.userName,
    },
    state: argv.state,
    channel: {
      from: {
        type: argv.channelFromType?.join(','),
        number: argv.channelFromPhone,
      },
    },
    media: {
      audioSettings: {
        enabled: argv.audioEnabled,
        earmuffed: argv.audioEarmuffed,
        muted: argv.audioMuted,
      },
      audio: argv.audio,
    },
    knockingId: argv.knockingId,
    memberIdInviting: argv.memberIdInviting,
    from: argv.fromMemberId,
  }, argv)));

  console.debug('Creating member', member);
  const createdMember = await makeSDKCall(
    SDK.conversations.createMember.bind(SDK.conversations),
    'Creating member',
    conversationId,
    member,
  );
  console.debug('Member created', createdMember);

  if (argv.json) {
    console.log(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(createdMember, true),
      null,
      2,
    ));
    return;
  }

  if (argv.yaml) {
    console.log(YAML.stringify(
      Client.transformers.snakeCaseObjectKeys(createdMember, true),
      null,
      2,
    ));
    return;
  }

  console.log('');
  displayFullMember(createdMember);
};
