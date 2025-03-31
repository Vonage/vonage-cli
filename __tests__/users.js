const { faker } = require('@faker-js/faker');

const addSIPChannelToUser = (user) => ({
  ...user,
  channels: {
    ...user.channels,
    sip: [
      ...user.channels?.sip || [],
      {
        uri: faker.internet.url({protocol: 'sip'}),
        username: faker.internet.username(),
        password: faker.internet.password(),
      },
    ],
  },
});

const addWebsocketChannelToUser = (user) => ({
  ...user,
  channels: {
    ...user.channels,
    websocket: [
      ...user.channels?.websocket || [],
      {
        uri: faker.internet.url({protocol: 'wss'}),
        contentType: `audio/l16;rate=${faker.helpers.shuffle([8000, 16000, 32000])[0]}`,
        headers: {
          'X-Header': faker.internet.userAgent(),
        },
      },
    ],
  },
});

const addPSTNChannelToUser = (user) => ({
  ...user,
  channels: {
    ...user.channels,
    pstn: [
      ...(user.channels?.pstn || []),
      {
        number: faker.phone.number({style: 'international'}),
      },
    ],
  },
});

const addSMSChannelToUser = (user) => ({
  ...user,
  channels: {
    ...user.channels,
    sms: [
      {
        number: faker.phone.number({style: 'international'}),
      },
    ],
  },
});

const addMMSChannelToUser = (user) => ({
  ...user,
  channels: {
    ...user.channels,
    mms: [
      {
        number: faker.phone.number({style: 'international'}),
      },
    ],
  },
});

const addWhatsAppChannelToUser = (user) => ({
  ...user,
  channels: {
    ...user.channels,
    whatsapp: [
      {
        number: faker.phone.number({style: 'international'}),
      },
    ],
  },
});

const addMessengerChannelToUser = (user) => ({
  ...user,
  channels: {
    ...user.channels,
    messenger: [
      {
        id:faker.internet.username(),
      },
    ],
  },
});

const addViberChannelToUser = (user) => ({
  ...user,
  channels: {
    ...user.channels,
    viber: [
      {
        number: faker.phone.number({style: 'international'}),
      },
    ],
  },
});


const getTestUserForAPI = () => Object.freeze({
  id: `USR-${faker.string.uuid()}`,
  name: faker.internet.username(),
  displayName: faker.person.fullName(),
  imageUrl: faker.internet.url(),
  properties: {
    ttl: faker.number.int(),
  },
  channels: {},
});

exports.getTestUserForAPI = getTestUserForAPI;

exports.addSIPChannelToUser = addSIPChannelToUser;
exports.addWebsocketChannelToUser = addWebsocketChannelToUser;
exports.addPSTNChannelToUser = addPSTNChannelToUser;
exports.addSMSChannelToUser = addSMSChannelToUser;
exports.addMMSChannelToUser = addMMSChannelToUser;
exports.addWhatsAppChannelToUser = addWhatsAppChannelToUser;
exports.addViberChannelToUser = addViberChannelToUser;
exports.addMessengerChannelToUser = addMessengerChannelToUser;

