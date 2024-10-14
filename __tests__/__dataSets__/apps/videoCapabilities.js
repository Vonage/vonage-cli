process.env.FORCE_COLOR = 0;
const { faker } = require('@faker-js/faker');
const { getBasicApplication, addVideoCapabilities } = require('../../app');
const { videoWebhooks } = require('../../../src/apps/video');
const { Client } = require('@vonage/server-client');

exports.videoDataSets = [
  ...videoWebhooks.map((webhook) => [
    (() => {
      const app = Client.transformers.camelCaseObjectKeys(
        getBasicApplication(),
        true,
      );

      const newUrl = faker.internet.url();
      const urlFlag = `video${webhook[0].toUpperCase() + webhook.slice(1)}Url`;

      return {
        label: `update ${webhook} URL (without secret)`,
        app: app,
        args: {
          action: 'update',
          which: 'video',
          [urlFlag]: newUrl,
        },
        expected: {
          ...app,
          name: `${app.name}`,
          capabilities: {
            video: {
              webhooks: {
                [webhook]: {
                  address: newUrl,
                  active: true,
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

      const urlFlag = `video${webhook[0].toUpperCase() + webhook.slice(1)}Url`;
      const secretFlag = `video${webhook[0].toUpperCase() + webhook.slice(1)}Secret`;
      const newUrl = faker.internet.url();
      const secret = faker.internet.password();

      return {
        label: `update ${webhook} URL (with secret)`,
        app: app,
        args: {
          action: 'update',
          which: 'video',
          [urlFlag]: newUrl,
          [secretFlag]: secret,
        },
        expected: {
          ...app,
          name: `${app.name}`,
          capabilities: {
            video: {
              webhooks: {
                [webhook]: {
                  address: newUrl,
                  secret: secret,
                  active: true,
                },
              },
            },
          },
        },
      };
    })(),

    (() => {
      const app = Client.transformers.camelCaseObjectKeys(
        addVideoCapabilities(
          getBasicApplication(),
        ),
        true,
      );

      const urlFlag = `video${webhook[0].toUpperCase() + webhook.slice(1)}Url`;
      const secretFlag = `video${webhook[0].toUpperCase() + webhook.slice(1)}Secret`;
      const newUrl = faker.internet.url();
      const secret = faker.internet.password();

      return {
        label: `replace ${webhook}`,
        app: app,
        args: {
          action: 'update',
          which: 'video',
          [urlFlag]: newUrl,
          [secretFlag]: secret,
        },
        expected: {
          ...app,
          name: `${app.name}`,
          capabilities: {
            video: {
              ...app.capabilities.video,
              webhooks: {
                ...app.capabilities.video.webhooks,
                [webhook]: {
                  address: newUrl,
                  secret: secret,
                  active: true,
                },
              },
            },
          },
        },
      };
    })(),
  ]),

  (() => {
    const app = Client.transformers.camelCaseObjectKeys(
      addVideoCapabilities(
        getBasicApplication(),
      ),
      true,
    );

    return {
      label: 'remove Video',
      app: app,
      args: {
        action: 'rm',
        which: 'video',
      },
      expected: {
        ...app,
        name: `${app.name}`,
        capabilities: {
          video: undefined,
        },
      },
    };
  })(),
].flat();
