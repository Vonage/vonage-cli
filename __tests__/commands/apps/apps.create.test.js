import { jest, describe, test, beforeEach, expect } from '@jest/globals';
process.env.FORCE_COLOR = 0;
import yaml from 'yaml';
import { faker } from '@faker-js/faker';
import { getBasicApplication } from '../../app.js';
import { mockConsole } from '../../helpers.js';
import { Client } from '@vonage/server-client';

const confirmMock = jest.fn();
const writeFileMock = jest.fn();
const yargs = { exit: jest.fn() };

jest.unstable_mockModule('yargs', () => ({ default: yargs }));
jest.unstable_mockModule('../../../src/ux/confirm.js', () => ({ confirm: confirmMock }));
jest.unstable_mockModule('../../../src/utils/fs.js', () => ({ writeFile: writeFileMock }));

const { handler } = await import('../../../src/commands/apps/create.js');

describe('Command: vonage apps create', () => {
  beforeEach(() => {
    mockConsole();
    confirmMock.mockReset();
    writeFileMock.mockReset();
    yargs.exit.mockReset();
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

    writeFileMock.mockResolvedValue();

    await handler({
      name: app.name,
      privateKeyFile: privateKeyFile,
      SDK: sdkMock,
    });

    expect(confirmMock).not.toHaveBeenCalled();
    expect(appMock).toHaveBeenCalledWith({
      name: app.name,
      privacy: {
        improveAI: undefined,
      },
      keys: {
        publicKey: undefined,
      },
    });

    expect(writeFileMock).toHaveBeenCalledWith(
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

    const error = new Error('User declined');
    error.name = 'UserDeclinedError';
    writeFileMock.mockRejectedValue(error);

    await handler({
      name: app.name,
      privateKeyFile: privateKeyFile,
      publicKeyFile: app.keys.publicKey,
      improveAi: true,
      SDK: sdkMock,
    });

    expect(appMock).toHaveBeenCalledWith({
      name: app.name,
      privacy: {
        improveAI: true,
      },
      keys: {
        publicKey: app.keys.publicKey,
      },
    });

    expect(writeFileMock).toHaveBeenCalled();

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

    expect(confirmMock).not.toHaveBeenCalled();
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

    expect(confirmMock).not.toHaveBeenCalled();
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

