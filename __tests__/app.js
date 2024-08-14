const { faker } = require('@faker-js/faker');

const addVoiceCapabilities = (app) => {
  return {
    ...app,
    capabilities: {
      ...app.capabilities,
      voice: {
        webhooks: {
          event_url: {
            address: faker.internet.url(),
            http_method: faker.helpers.shuffle(['GET', 'POST'])[0],
            socket_timeout: faker.number.int({max: 5000, min: 1000}),
            connect_timeout: faker.number.int({max: 1000, min: 300}),
          },
          answer_url: {
            address: faker.internet.url(),
            http_method: faker.helpers.shuffle(['GET', 'POST'])[0],
            socket_timeout: faker.number.int({max: 5000, min: 1000}),
            connect_timeout: faker.number.int({max: 1000, min: 300}),
          },
          fallback_answer_url: {
            address: faker.internet.url(),
            http_method: faker.helpers.shuffle(['GET', 'POST'])[0],
            socket_timeout: faker.number.int({max: 5000, min: 1000}),
            connect_timeout: faker.number.int({max: 1000, min: 300}),
          },
        },
        signed_callbacks: true,
        conversations_ttl: faker.number.int({max: 744, min: 1}),
        leg_persistence_time: faker.number.int({max: 31, min: 1}),
        region: faker.helpers.shuffle([
          'na-east',
          'na-west',
          'eu-west',
          'eu-east',
          'apac-sng',
          'apac-australia',
        ])[0],
      },
    },
  };
};

const addMessagesCapabilities = (app) => {
  return {
    ...app,
    capabilities: {
      ...app.capabilities,
      messages: {
        webhooks: {
          inbound_url: {
            address: faker.internet.url(),
            http_method: 'POST',
          },
          status_url: {
            address: faker.internet.url(),
            http_method: 'POST',
          },
        },
        version: faker.helpers.shuffle(['v1', 'v0.1'])[0],
        'authenticate_inbound_media': true,
      },
    },
  };
};

const addVerifyCapabilities = (app) => {
  return {
    ...app,
    capabilities: {
      ...app.capabilities,
      verify: {
        webhooks: {
          status_url: {
            address: faker.internet.url(),
            http_method: 'POST',
          },
        },
        version: 'v2',
      },
    },
  };
};

const addMeetingsCapabilities = (app) => {
  return {
    ...app,
    capabilities: {
      ...app.capabilities,
      meetings: {
        webhooks: {
          room_changed: {
            address: faker.internet.url(),
            http_method: 'POST',
          },
          session_changed: {
            address: faker.internet.url(),
            http_method: 'POST',
          },
          recording_changed: {
            address: faker.internet.url(),
            http_method: 'POST',
          },
        },
      },
    },
  };
};

const getTestApp = () =>{
  const key = `-----BEGIN PUBLIC KEY-----${faker.string.alpha(10)}-----END PUBLIC KEY-----`;
  return {
    id: faker.string.uuid(),
    name: faker.science.chemicalElement().name,
    keys: {
      public_key: key,
    },
    privacy: {
      improve_ai: true,
    },
  };
};

module.exports = {
  getTestApp,
  addVoiceCapabilities,
  addMessagesCapabilities,
  addVerifyCapabilities,
  addMeetingsCapabilities,
};
