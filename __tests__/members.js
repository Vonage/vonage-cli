const { faker } = require('@faker-js/faker');
const { getTestConversationForAPI } = require('./conversations');
const { getTestUserForAPI } = require('./users');
const { stateLabels } = require('../src/members/display');

const fromChannels = [
  'app',
  'phone',
  'sms',
  'mms',
  'whatsapp',
  'viber',
  'messanger',
];

const getTestMemberForAPI = () => Object.freeze({
  id: `MEM-${faker.string.uuid()}`,
  conversationId: getTestConversationForAPI().id,
  user: {
    id: getTestUserForAPI().id,
    name: getTestUserForAPI().name,
    displayName: getTestUserForAPI().displayName,
  },
  state: faker.helpers.shuffle(Object.keys(stateLabels))[0],
  timestamp: {
    invited: faker.date.soon().toISOString(),
    joined: faker.date.soon().toISOString(),
    left: faker.date.soon().toISOString(),
  },
  media: {
    audioSettings: {
      muted: faker.datatype.boolean(),
      earmuffed: faker.datatype.boolean(),
      enabled: faker.datatype.boolean(),
    },
    audio: faker.datatype.boolean(),
  },
  knockingId: faker.string.uuid(),
  memberIdInviting: faker.string.uuid(),
  from: faker.string.uuid(),
});

const randomFrom = () => faker.helpers.shuffle(fromChannels).slice(
  faker.helpers.rangeToNumber({ min: 1, max: fromChannels.length }),
).sort().join(',');

const addAppChannelToMember = (member) => Object.freeze({
  ...member,
  channel: {
    type: 'app',
    from: {
      type: randomFrom(),
    },
    to: {
      user: getTestUserForAPI().id,
      type: 'app',
    },
  },
});

const addPhoneChannelToMember = (member) => Object.freeze({
  ...member,
  channel: {
    type: 'phone',
    from: {
      type: randomFrom(),
    },
    to: {
      number: faker.phone.number({ style: 'international' }),
      type: 'phone',
    },
  },
});

const addSMSChannelToMember = (member) => Object.freeze({
  ...member,
  channel: {
    type: 'sms',
    from: {
      type: randomFrom(),
    },
    to: {
      number: faker.phone.number({ style: 'international' }),
      type: 'sms',
    },
  },
});

const addMMSChannelToMember = (member) => Object.freeze({
  ...member,
  channel: {
    type: 'mms',
    from: {
      type: randomFrom(),
    },
    to: {
      number: faker.phone.number({ style: 'international' }),
    },
  },
});

const addWhatsAppChannelToMember = (member) => Object.freeze({
  ...member,
  channel: {
    type: 'whatsapp',
    from: {
      type: randomFrom(),
    },
    to: {
      number: faker.phone.number({ style: 'international' }),
    },
  },
});

const addViberChannelToMember = (member) => Object.freeze({
  ...member,
  channel: {
    type: 'viber',
    from: {
      type: randomFrom(),
    },
    to: {
      id: faker.string.uuid(),
    },
  },
});

const addMessengerChannelToMember = (member) => Object.freeze({
  ...member,
  channel: {
    type: 'messenger',
    from: {
      type: randomFrom(),
    },
    to: {
      id: faker.string.uuid(),
    },
  },
});

exports.getTestMemberForAPI = getTestMemberForAPI;
exports.addAppChannelToMember = addAppChannelToMember;
exports.addPhoneChannelToMember = addPhoneChannelToMember;
exports.addSMSChannelToMember = addSMSChannelToMember;
exports.addMMSChannelToMember = addMMSChannelToMember;
exports.addWhatsAppChannelToMember = addWhatsAppChannelToMember;
exports.addViberChannelToMember = addViberChannelToMember;
exports.addMessengerChannelToMember = addMessengerChannelToMember;

