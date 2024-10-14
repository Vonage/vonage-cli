process.env.FORCE_COLOR = 0;
const { faker } = require('@faker-js/faker');
const { getBasicApplication, addRTCCapabilities } = require('../../app');
const { Client } = require('@vonage/server-client');

exports.rtcDataSets = [
  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
    );

    const eventUrl = faker.internet.url();

    return {
      label: 'update RTC event URL',
      app: app,
      args: {
        action: 'update',
        which: 'rtc',
        rtcEventUrl: eventUrl,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          rtc: {
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

    return {
      label: 'update RTC event URL and method',
      app: app,
      args: {
        action: 'update',
        which: 'rtc',
        rtcEventUrl: eventUrl,
        rtcEventMethod: 'GET',
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          rtc: {
            webhooks: {
              eventUrl: {
                address: eventUrl,
                httpMethod: 'GET',
              },
            },
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      addRTCCapabilities(getBasicApplication()),
      true,
    );

    app.capabilities.rtc.webhooks.eventUrl.httpMethod = 'POST';

    return {
      label: 'replace RTC event URL method',
      app: app,
      args: {
        action: 'update',
        which: 'rtc',
        rtcEventMethod: 'GET',
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          rtc: {
            signedCallbacks: app.capabilities.rtc.signedCallbacks,
            webhooks: {
              eventUrl: {
                address: app.capabilities.rtc.webhooks.eventUrl.address,
                httpMethod: 'GET',
              },
            },
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      addRTCCapabilities(
        getBasicApplication(),
      ),
      true,
    );

    app.capabilities.rtc.signCallbacks = false;

    return {
      label: 'modify RTC signed signedCallbacks',
      app: app,
      args: {
        action: 'update',
        which: 'rtc',
        rtcSignedEvent: true,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          rtc: {
            signedCallbacks: true,
            webhooks: {
              eventUrl: {
                address: app.capabilities.rtc.webhooks.eventUrl.address,
                httpMethod: app.capabilities.rtc.webhooks.eventUrl.httpMethod,
              },
            },
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      addRTCCapabilities(
        getBasicApplication(),
      ),
      true,
    );

    return {
      label: 'remove rtc url when passing in empty string (__remove__ from coerce function)',
      app: app,
      args: {
        action: 'update',
        which: 'rtc',
        rtcEventUrl: '__REMOVE__',
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          rtc: {
            signedCallbacks: true,
            webhooks: {
              eventUrl: {
                httpMethod: app.capabilities.rtc.webhooks.eventUrl.httpMethod,
              },
            },
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      addRTCCapabilities(
        getBasicApplication(),
      ),
      true,
    );

    return {
      label: 'remove RTC',
      app: app,
      args: {
        action: 'rm',
        which: 'rtc',
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          rtc: undefined,
        },
      },
    };
  })(),
];
