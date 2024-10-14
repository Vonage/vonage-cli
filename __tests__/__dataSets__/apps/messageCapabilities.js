process.env.FORCE_COLOR = 0;
const { faker } = require('@faker-js/faker');
const { getBasicApplication, addMessagesCapabilities } = require('../../app');
const { Client } = require('@vonage/server-client');

exports.messageDataSets = [
  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
    );

    const inboundUrl = faker.internet.url();
    const statusUrl = faker.internet.url();
    const version = faker.helpers.shuffle(['v1', 'v0.1'])[0];
    const authenticateInboundMedia = faker.datatype.boolean();

    return {
      label: 'update Message capabilities',
      app: app,
      args: {
        action: 'update',
        which: 'messages',
        messagesInboundUrl: inboundUrl,
        messagesStatusUrl: statusUrl,
        messagesVersion: version,
        messagesAuthenticateMedia: authenticateInboundMedia,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          messages: {
            version: version,
            authenticateInboundMedia: authenticateInboundMedia,
            webhooks: {
              inboundUrl: {
                address: inboundUrl,
                httpMethod: 'POST',
              },
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
      addMessagesCapabilities(
        getBasicApplication(),
      ),
      true,
    );

    return {
      label: 'remov urls and remove methods',
      app: app,
      args: {
        action: 'update',
        which: 'messages',
        messagesInboundUrl: '__REMOVE__',
        messagesStatusUrl: '__REMOVE__',
        messagesAuthenticateMedia: app.capabilities.messages.authenticateInboundMedia,
      },
      expected: {
        ...app,
        name: `${app.name}`,
        // this will remove the capability since you cannot have version and
        // authenticateInboundMedia without the webhooks
        capabilities: {
        },
      },
    };
  })(),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      addMessagesCapabilities(
        getBasicApplication(),
      ),
      true,
    );

    return {
      label: 'remove Message',
      app: app,
      args: {
        action: 'rm',
        which: 'messages',
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          messages: undefined,
        },
      },
    };
  })(),
];
