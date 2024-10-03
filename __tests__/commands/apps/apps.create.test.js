process.env.FORCE_COLOR = 0;
const yargs = require('yargs');
const yaml = require('yaml');
const { faker } = require('@faker-js/faker');
const { handler } = require('../../../src/commands/apps/create');
const { getBasicApplication } = require('../../app');
const { mockConsole } = require('../../helpers');
const fs = require('fs');
const { confirm } = require('../../../src/ux/confirm');
const { VetchError } = require('@vonage/vetch');
const { Client } = require('@vonage/server-client');

jest.mock('fs');
jest.mock('../../../src/ux/confirm');
jest.mock('yargs');

describe('Command: apps create', () => {
  let consoleMock;

  beforeEach(() => {
    consoleMock = mockConsole();
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

    expect(consoleMock.log.mock.calls[0][0]).toBe('Application created');

    expect(consoleMock.log.mock.calls[1][0]).toEqual([
      `Name: ${app.name}`,
      `Application ID: ${app.id}`,
      'Improve AI: Off',
      'Private/Public Key: Set',
    ].join('\n'));
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

    expect(consoleMock.log.mock.calls[4][0]).toBe('Private key:');
    expect(consoleMock.log.mock.calls[5][0]).toBe(app.keys.privateKey);
  });

  test('Should create app and output json', async () => {
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
      json: true,
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

    expect(consoleMock.log).toHaveBeenCalledTimes(1);
    expect(consoleMock.log.mock.calls[0][0]).toBe(
      JSON.stringify(
        Client.transformers.snakeCaseObjectKeys(app, true),
        null,
        2,
      ),
    );
  });

  test('Should create app and output yaml', async () => {
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
      yaml: true,
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

    expect(consoleMock.log).toHaveBeenCalledTimes(1);
    expect(consoleMock.log.mock.calls[0][0]).toBe(
      yaml.stringify(
        Client.transformers.snakeCaseObjectKeys(app, true),
        null,
        2,
      ),
    );
  });

  test('Should handle error creating application', async () => {
    const privateKeyFile = faker.system.filePath();
    const app = getBasicApplication();
    app.keys.privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(16)}\n-----END PRIVATE KEY-----`;
    app.keys.publicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;

    const appMock = jest.fn().mockRejectedValue(new Error('Test Failing'));
    const sdkMock = {
      applications: {
        createApplication: appMock,
      },
    };

    yargs.exit = jest.fn();
    await handler({
      name: app.name,
      privateKeyFile: privateKeyFile,
      SDK: sdkMock,
    });

    expect(yargs.exit).toHaveBeenCalledWith(99);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  test('Should handle 401 error creating application', async () => {
    const privateKeyFile = faker.system.filePath();
    const app = getBasicApplication();
    app.keys.privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(16)}\n-----END PRIVATE KEY-----`;
    app.keys.publicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;

    const appMock = jest.fn().mockRejectedValue(new VetchError(
      'Test Failing',
      {},
      { status: 401 },
    ));
    const sdkMock = {
      applications: {
        createApplication: appMock,
      },
    };

    yargs.exit = jest.fn();
    await handler({
      name: app.name,
      privateKeyFile: privateKeyFile,
      SDK: sdkMock,
    });

    expect(yargs.exit).toHaveBeenCalledWith(5);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  test('Should handle 403 error creating application', async () => {
    const privateKeyFile = faker.system.filePath();
    const app = getBasicApplication();
    app.keys.privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(16)}\n-----END PRIVATE KEY-----`;
    app.keys.publicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;

    const appMock = jest.fn().mockRejectedValue(new VetchError(
      'Test Failing',
      {},
      { status: 403 },
    ));
    const sdkMock = {
      applications: {
        createApplication: appMock,
      },
    };

    yargs.exit = jest.fn();
    await handler({
      name: app.name,
      privateKeyFile: privateKeyFile,
      SDK: sdkMock,
    });

    expect(yargs.exit).toHaveBeenCalledWith(5);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
});
