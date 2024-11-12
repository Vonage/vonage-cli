const { faker } = require('@faker-js/faker');
const { EventType } = require('@vonage/conversations');
const conversationEvents = Object.values(EventType);

const states = ['ACTIVE', 'INACTIVE', 'DELETED'];

const getTestConversationForAPI = () => Object.freeze({
  id: `CON-${faker.string.uuid()}`,
  name: `${faker.commerce.productAdjective()}_${faker.commerce.productMaterial()}_${faker.commerce.product()}`,
  displayName: `${faker.commerce.productAdjective()}_${faker.commerce.productMaterial()}_${faker.commerce.product()}`,
  imageUrl: faker.internet.url(),
  state: faker.helpers.shuffle(states)[0],
  timestamp: {
    created: faker.date.recent(),
    updated: faker.date.recent(),
  },
  properties: {
    ttl: faker.number.int(),
  },
  sequenceNumber: faker.number.int(),
  mediaState: {
    earmuff: faker.datatype.boolean(),
    mute: faker.datatype.boolean(),
    playStream: faker.datatype.boolean(),
    recording: faker.datatype.boolean(),
    transcribing: faker.datatype.boolean(),
    tts: faker.datatype.boolean(),
  },
});

const addCLIPropertiesToConversation = () => Object.freeze({
  ...getTestConversationForAPI(),
  numbers: [
    {
      type: 'phone',
      number: faker.phone.number(),
    },
  ],
  properties: {
    ttl: faker.number.int(),
  },
  callback: {
    url: faker.internet.url(),
    method: faker.helpers.shuffle(['GET', 'POST'])[0],
    eventMask: faker.helpers.shuffle(conversationEvents).slice(0, 3),
    params: {
      applicationId: faker.string.uuid(),
      nccoUrl: faker.internet.url(),
    },
  },
});


exports.addCLIPropertiesToConversation = addCLIPropertiesToConversation;
exports.getTestConversationForAPI = getTestConversationForAPI;
