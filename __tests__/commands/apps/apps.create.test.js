process.env.FORCE_COLOR = 0;
const yaml = require('yaml');
const { faker } = require('@faker-js/faker');
const { handler } = require('../../../src/commands/apps/create');
const { getBasicApplication } = require('../../app');
const { mockConsole } = require('../../helpers');
const fs = require('fs');
const { confirm } = require('../../../src/ux/confirm');
const { Client } = require('@vonage/server-client');

jest.mock('fs');
jest.mock('../../../src/ux/confirm');
jest.mock('yargs');

describe('Command: vonage apps create', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Should create app and save private key', async () => {
    const privateKeyFile = faker.system.filePath();
    const app = getBasicApplication();
    app.keys.privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(16)}\n-----END PRIVATE KEY-----`;
    app.keys.publicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;

    const appMock = jest.fn().mockResolvedValue(app);
    const sdkMock = {
      applications: {
        createApplication: appMock,
      },
    };

    await handler({
      name: app.name,
      privateKeyFile: privateKeyFile,
      SDK: sdkMock,
    });

    expect(confirm).not.toHaveBeenCalled();
    expect(appMock).toHaveBeenCalledWith({
      name: app.name,
      privacy: {
        improveAI: undefined,
      },
      keys: {
        publicKey: undefined,
      },
    });

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      privateKeyFile,
      app.keys.privateKey,
    );

    expect(console.log).toHaveBeenNthCalledWith(1, 'Application created');

    expect(console.log).toHaveBeenNthCalledWith(
      2,
      [
        `Name: ${app.name}`,
        `Application ID: ${app.id}`,
        'Improve AI: Off',
        'Private/Public Key: Set',
      ].join('\n'),
    );
  });

  test('Should create app and dump private key', async () => {
    const privateKeyFile = faker.system.filePath();
    const app = getBasicApplication();
    app.keys.privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(16)}\n-----END PRIVATE KEY-----`;
    app.keys.publicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;

    const appMock = jest.fn().mockResolvedValue(app);
    const sdkMock = {
      applications: {
        createApplication: appMock,
      },
    };

    confirm.mockResolvedValue(false);
    fs.__addFile(privateKeyFile, app.keys.privateKey);
    await handler({
      name: app.name,
      privateKeyFile: privateKeyFile,
      publicKeyFile: app.keys.publicKey,
      improveAi: true,
      SDK: sdkMock,
    });

    expect(confirm).toHaveBeenCalled();
    expect(appMock).toHaveBeenCalledWith({
      name: app.name,
      privacy: {
        improveAI: true,
      },
      keys: {
        publicKey: app.keys.publicKey,
      },
    });

    expect(fs.writeFileSync).not.toHaveBeenCalled();

    expect(console.log).toHaveBeenNthCalledWith(5, 'Private key:');
    expect(console.log).toHaveBeenNthCalledWith(6, app.keys.privateKey);
  });

  test('Should create app and output json', async () => {
    const app = getBasicApplication();
    app.keys.privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(16)}\n-----END PRIVATE KEY-----`;
    app.keys.publicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;

    const appMock = jest.fn().mockResolvedValue(app);
    const sdkMock = {
      applications: {
        createApplication: appMock,
      },
    };

    await handler({
      name: app.name,
      json: true,
      SDK: sdkMock,
    });

    expect(confirm).not.toHaveBeenCalled();
    expect(appMock).toHaveBeenCalledWith({
      name: app.name,
      privacy: {
        improveAI: undefined,
      },
      keys: {
        publicKey: undefined,
      },
    });

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      JSON.stringify(
        Client.transformers.snakeCaseObjectKeys(app, true),
        null,
        2,
      ),
    );
  });

  test('Should create app and output yaml', async () => {
    const app = getBasicApplication();
    app.keys.privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(16)}\n-----END PRIVATE KEY-----`;
    app.keys.publicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;

    const appMock = jest.fn().mockResolvedValue(app);
    const sdkMock = {
      applications: {
        createApplication: appMock,
      },
    };

    await handler({
      name: app.name,
      yaml: true,
      SDK: sdkMock,
    });

    expect(confirm).not.toHaveBeenCalled();
    expect(appMock).toHaveBeenCalledWith({
      name: app.name,
      privacy: {
        improveAI: undefined,
      },
      keys: {
        publicKey: undefined,
      },
    });

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenNthCalledWith(
      1,
      yaml.stringify(
        Client.transformers.snakeCaseObjectKeys(app, true),
        null,
        2,
      ),
    );
  });
});
