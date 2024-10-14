process.env.FORCE_COLOR = 0;
const { faker } = require('@faker-js/faker');
const { getBasicApplication, addNetworkCapabilities } = require('../../app');
const { Client } = require('@vonage/server-client');

exports.networkDataSets = [
  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
    );

    const redirectUrl = faker.internet.url();
    const appId = faker.string.uuid();

    return {
      label: 'update network redirect url and network app id',
      app: app,
      args: {
        action: 'update',
        which: 'network_apis',
        networkRedirectUrl: redirectUrl,
        networkAppId: appId,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          networkApis: {
            networkApplicationId: appId,
            redirectUrl: redirectUrl,
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      addNetworkCapabilities(getBasicApplication()),
      true,
    );

    const redirectUrl = faker.internet.url();
    const appId = faker.string.uuid();

    return {
      label: 'replace network redirect url',
      app: app,
      args: {
        action: 'update',
        which: 'network_apis',
        networkRedirectUrl: redirectUrl,
        networkAppId: appId,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          networkApis: {
            networkApplicationId: appId,
            redirectUrl: redirectUrl,
          },
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      addNetworkCapabilities(getBasicApplication()),
      true,
    );

    return {
      label: 'remove network api',
      app: app,
      args: {
        action: 'rm',
        which: 'network_apis',
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {},
      },
    };
  })(),
];
