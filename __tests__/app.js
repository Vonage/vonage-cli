const { faker } = require('@faker-js/faker');

const getBasicApplication = () => ({
  id: faker.string.uuid(),
  name: `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} ${faker.commerce.product()}`,
  keys: {
    publicKey: `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`,
  },
  privacy: {
    improveAi: faker.datatype.boolean(),
  },
});

const addVoiceCapabilities = (app) => Object.freeze({
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
});

const addMessagesCapabilities = (app) => Object.freeze({
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
      authenticate_inbound_media: true,
    },
  },
});

const addVerifyCapabilities = (app) => Object.freeze({
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
});

const addNetworkCapabilities = (app) => Object.freeze({
  ...app,
  capabilities: {
    ...app.capabilities,
    network_apis: {
      redirect_uri: faker.internet.url(),
      network_application_id:  `${faker.commerce.productAdjective()}_${faker.commerce.productMaterial()}_${faker.commerce.product()}`,
    },
  },
});

const addRTCCapabilities = (app) => Object.freeze({
  ...app,
  capabilities: {
    ...app.capabilities,
    rtc: {
      webhooks: {
        event_url: {
          address: faker.internet.url(),
          http_method: faker.helpers.shuffle(['GET', 'POST'])[0],
        },
      },
      signed_callbacks: true,
    },
  },
});

const addVideoCapabilities = (app) => Object.freeze({
  ...app,
  capabilities: {
    ...app.capabilities,
    video: {
      webhooks: {
        archive_status: {
          address: faker.internet.url(),
          secret: faker.internet.password(),
          active: true,
        },
        connection_created: {
          address: faker.internet.url(),
          secret: faker.internet.password(),
          active: true,
        },
        connection_destroyed: {
          address: faker.internet.url(),
          secret: faker.internet.password(),
          active: true,
        },
        sip_call_created: {
          address: faker.internet.url(),
          secret: faker.internet.password(),
          active: true,
        },
        sip_call_updated: {
          address: faker.internet.url(),
          secret: faker.internet.password(),
          active: true,
        },
        sip_call_destroyed: {
          address: faker.internet.url(),
          secret: faker.internet.password(),
          active: true,
        },
        sip_call_mute_forced: {
          address: faker.internet.url(),
          secret: faker.internet.password(),
          active: true,
        },
        stream_created: {
          address: faker.internet.url(),
          secret: faker.internet.password(),
          active: true,
        },
        stream_destroyed: {
          address: faker.internet.url(),
          secret: faker.internet.password(),
          active: true,
        },
        render_status: {
          address: faker.internet.url(),
          secret: faker.internet.password(),
          active: true,
        },
        broadcast_status: {
          address: faker.internet.url(),
          secret: faker.internet.password(),
          active: true,
        },
        captions_status: {
          address: faker.internet.url(),
          secret: faker.internet.password(),
          active: true,
        },
      },
      storage: {
        server_side_encryption: false,
        end_to_end_encryption: false,
        cloud_storage: false,
      },
      environment_enabled: false,
      environment_id: 1,
    },
  },
});

const addVBCCapabilities = (app) => Object.freeze({
  ...app,
  capabilities: {
    ...app.capabilities,
    vbc: {},
  },
});

module.exports = {
  getTestApp: getBasicApplication,
  addVoiceCapabilities,
  addMessagesCapabilities,
  addVerifyCapabilities,
  addRTCCapabilities,
  addNetworkCapabilities,
  addVBCCapabilities,
  addVideoCapabilities,
  getBasicApplication: getBasicApplication,
};
