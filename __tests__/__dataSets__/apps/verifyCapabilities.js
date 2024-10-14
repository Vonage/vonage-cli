process.env.FORCE_COLOR = 0;
const { faker } = require('@faker-js/faker');
const { getBasicApplication, addVerifyCapabilities } = require('../../app');
const { Client } = require('@vonage/server-client');

exports.verifyDataSets = [
  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
    );

    const statusUrl = faker.internet.url();

    return {
      label: 'update Verify capabilities',
      app: app,
      args: {
        action: 'update',
        which: 'verify',
        verifyStatusUrl: statusUrl,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          verify: {
            version: 'v2',
            webhooks: {
              statusUrl: {
                address: statusUrl,
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
      addVerifyCapabilities(
        getBasicApplication(),
      ),
      true,
    );

    const statusUrl = faker.internet.url();

    return {
      label: 'replace Verify capabilities',
      app: app,
      args: {
        action: 'update',
        which: 'verify',
        verifyStatusUrl: statusUrl,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          verify: {
            version: 'v2',
            webhooks: {
              statusUrl: {
                address: statusUrl,
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
      addVerifyCapabilities(
        getBasicApplication(),
      ),
      true,
    );


    return {
      label: 'remove verify when removing status url',
      app: app,
      args: {
        action: 'update',
        which: 'verify',
        verifyStatusUrl: '__REMOVE__',
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {},
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVerifyCapabilities(
        getBasicApplication(),
      ),
      true,
    );

    return {
      label: 'remove Verify',
      app: app,
      args: {
        action: 'rm',
        which: 'verify',
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          verify: undefined,
        },
      },
    };
  })(),
];
