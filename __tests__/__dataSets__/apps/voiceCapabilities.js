process.env.FORCE_COLOR = 0;
const { faker } = require('@faker-js/faker');
const { getBasicApplication, addVoiceCapabilities } = require('../../app');
const { Client } = require('@vonage/server-client');

exports.voiceDataSets = [
  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
    );

    const eventUrl = faker.internet.url();

    return {
      label: 'add voice event url',
      app: app,
      args: {
        action: 'update',
        which: 'voice',
        voiceEventUrl: eventUrl,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          voice: {
            webhooks: {
              eventUrl: {
                address: eventUrl,
                httpMethod: 'POST',
              },
            },
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
    );

    const eventUrl = faker.internet.url();
    const httpMethod = faker.helpers.shuffle(['GET', 'POST'])[0];
    const socketTimeout = faker.number.int({max: 5000, min: 1000});
    const connectTimeout = faker.number.int({max: 1000, min: 300});

    return {
      label: 'add voice event url, method, socket and connection timeout',
      app: app,
      args: {
        action: 'update',
        which: 'voice',
        voiceEventUrl: eventUrl,
        voiceEventHttp: httpMethod,
        voiceEventConnectionTimeout: connectTimeout,
        voiceEventSocketTimeout: socketTimeout,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          voice: {
            webhooks: {
              eventUrl: {
                address: eventUrl,
                httpMethod: httpMethod,
                socketTimeout: socketTimeout,
                connectTimeout: connectTimeout,
              },
            },
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVoiceCapabilities(getBasicApplication()),
      true,
    );

    app.capabilities.voice.webhooks.eventUrl.httpMethod = 'GET';
    const eventUrl = faker.internet.url();
    const socketTimeout = faker.number.int({max: 5000, min: 1000});
    const connectTimeout = faker.number.int({max: 1000, min: 300});

    return {
      label: 'replace voice event url, method, socket and connection timeout',
      app: app,
      args: {
        action: 'update',
        which: 'voice',
        voiceEventUrl: eventUrl,
        voiceEventHttp: 'POST',
        voiceEventConnectionTimeout: connectTimeout,
        voiceEventSocketTimeout: socketTimeout,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          voice: {
            ...app.capabilities.voice,
            webhooks: {
              ...app.capabilities.voice.webhooks,
              eventUrl: {
                address: eventUrl,
                httpMethod: 'POST',
                socketTimeout: socketTimeout,
                connectTimeout: connectTimeout,
              },
            },
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
    );

    const answerUrl = faker.internet.url();

    return {
      label: 'add voice answer url',
      app: app,
      args: {
        action: 'update',
        which: 'voice',
        voiceAnswerUrl: answerUrl,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          voice: {
            webhooks: {
              answerUrl: {
                address: answerUrl,
                httpMethod: 'POST',
              },
            },
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
    );

    const answerUrl = faker.internet.url();
    const httpMethod = faker.helpers.shuffle(['GET', 'POST'])[0];
    const socketTimeout = faker.number.int({max: 5000, min: 1000});
    const connectTimeout = faker.number.int({max: 1000, min: 300});

    return {
      label: 'add voice answer url, method, socket and connection timeout',
      app: app,
      args: {
        action: 'update',
        which: 'voice',
        voiceAnswerUrl: answerUrl,
        voiceAnswerHttp: httpMethod,
        voiceAnswerConnectionTimeout: connectTimeout,
        voiceAnswerSocketTimeout: socketTimeout,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          voice: {
            webhooks: {
              answerUrl: {
                address: answerUrl,
                httpMethod: httpMethod,
                socketTimeout: socketTimeout,
                connectTimeout: connectTimeout,
              },
            },
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVoiceCapabilities(getBasicApplication()),
      true,
    );

    app.capabilities.voice.webhooks.answerUrl.httpMethod = 'GET';
    const answerUrl = faker.internet.url();
    const socketTimeout = faker.number.int({max: 5000, min: 1000});
    const connectTimeout = faker.number.int({max: 1000, min: 300});

    return {
      label: 'replace voice answer url, method, socket and connection timeout',
      app: app,
      args: {
        action: 'update',
        which: 'voice',
        voiceAnswerUrl: answerUrl,
        voiceAnswerHttp: 'POST',
        voiceAnswerConnectionTimeout: connectTimeout,
        voiceAnswerSocketTimeout: socketTimeout,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          voice: {
            ...app.capabilities.voice,
            webhooks: {
              ...app.capabilities.voice.webhooks,
              answerUrl: {
                address: answerUrl,
                httpMethod: 'POST',
                socketTimeout: socketTimeout,
                connectTimeout: connectTimeout,
              },
            },
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
    );

    const fallbackUrl = faker.internet.url();

    return {
      label: 'add voice fallback url',
      app: app,
      args: {
        action: 'update',
        which: 'voice',
        voiceFallbackUrl: fallbackUrl,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          voice: {
            webhooks: {
              fallbackAnswerUrl: {
                address: fallbackUrl,
                httpMethod: 'POST',
              },
            },
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
    );

    const fallbackUrl = faker.internet.url();
    const httpMethod = faker.helpers.shuffle(['GET', 'POST'])[0];
    const socketTimeout = faker.number.int({max: 5000, min: 1000});
    const connectTimeout = faker.number.int({max: 1000, min: 300});

    return {
      label: 'add voice fallbackAnswer url, method, socket and connection timeout',
      app: app,
      args: {
        action: 'update',
        which: 'voice',
        voiceFallbackUrl: fallbackUrl,
        voiceFallbackHttp: httpMethod,
        voiceFallbackConnectionTimeout: connectTimeout,
        voiceFallbackSocketTimeout: socketTimeout,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          voice: {
            webhooks: {
              fallbackAnswerUrl: {
                address: fallbackUrl,
                httpMethod: httpMethod,
                socketTimeout: socketTimeout,
                connectTimeout: connectTimeout,
              },
            },
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVoiceCapabilities(getBasicApplication()),
      true,
    );

    app.capabilities.voice.webhooks.fallbackAnswerUrl.httpMethod = 'GET';
    const fallbackUrl = faker.internet.url();
    const socketTimeout = faker.number.int({max: 5000, min: 1000});
    const connectTimeout = faker.number.int({max: 1000, min: 300});

    return {
      label: 'replace voice fallbackAnswer url, method, socket and connection timeout',
      app: app,
      args: {
        action: 'update',
        which: 'voice',
        voiceFallbackUrl: fallbackUrl,
        voiceFallbackHttp: 'POST',
        voiceFallbackConnectionTimeout: connectTimeout,
        voiceFallbackSocketTimeout: socketTimeout,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          voice: {
            ...app.capabilities.voice,
            webhooks: {
              ...app.capabilities.voice.webhooks,
              fallbackAnswerUrl: {
                address: fallbackUrl,
                httpMethod: 'POST',
                socketTimeout: socketTimeout,
                connectTimeout: connectTimeout,
              },
            },
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVoiceCapabilities(getBasicApplication()),
      true,
    );

    app.capabilities.voice.webhooks.fallbackAnswerUrl.httpMethod = 'GET';

    const signedCallbacks = true;
    const conversationsTtl = faker.number.int({max: 744, min: 1});
    const legPersistenceTime = faker.number.int({max: 31, min: 1});
    const region = faker.helpers.shuffle([
      'na-east',
      'na-west',
      'eu-west',
      'eu-east',
      'apac-sng',
      'apac-australia',
    ])[0];

    return {
      label: 'replace voice fallbackAnswer url, method, socket and connection timeout',
      app: app,
      args: {
        action: 'update',
        which: 'voice',
        voiceSignedCallbacks: signedCallbacks,
        voiceConversationsTtl: conversationsTtl,
        voiceLegPersistenceTime: legPersistenceTime,
        voiceRegion: region,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          voice: {
            ...app.capabilities.voice,
            signedCallbacks: signedCallbacks,
            conversationsTtl: conversationsTtl,
            legPersistenceTime: legPersistenceTime,
            region: region,
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVoiceCapabilities(getBasicApplication()),
      true,
    );

    app.capabilities.voice.webhooks.fallbackAnswerUrl.httpMethod = 'GET';

    return {
      label: 'remove conversationsTtl, legPersistenceTime, region',
      app: app,
      args: {
        action: 'update',
        which: 'voice',
        voiceConversationsTtl: '__REMOVE__',
        voiceLegPersistenceTime: '__REMOVE__',
        voiceRegion: '__REMOVE__',
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          voice: {
            signedCallbacks: app.capabilities.voice.signedCallbacks,
            webhooks: app.capabilities.voice.webhooks,
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVoiceCapabilities(getBasicApplication()),
      true,
    );

    return {
      label: 'remove voice',
      app: app,
      args: {
        action: 'rm',
        which: 'voice',
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {},
      },
    };
  })(),

];
