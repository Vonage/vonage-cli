process.env.FORCE_COLOR = 0;
import yaml from 'yaml';
import { faker } from '@faker-js/faker';
import { getBasicApplication } from '../../app.js';
import { mockConsole } from '../../helpers.js';
import { Client } from '@vonage/server-client';

const confirmMock = mock.fn();
const writeFileMock = mock.fn();
const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const __moduleMocks = {
  'yargs': (() => ({ default: yargs }))(),
  '../../../src/ux/confirm.js': (() => ({ confirm: confirmMock }))(),
  '../../../src/utils/fs.js': (() => ({ writeFile: writeFileMock }))(),
};






const { handler } = await loadModule(import.meta.url, '../../../src/commands/apps/create.js', __moduleMocks);

describe('Command: vonage apps create', () => {
  beforeEach(() => {
    mockConsole();
    confirmMock.mock.resetCalls();
    writeFileMock.mock.resetCalls();
    exitMock.mock.resetCalls();
  });

  test('Should create app and save private key', async () => {
    const privateKeyFile = faker.system.filePath();
    const app = getBasicApplication();
    app.keys.privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(16)}\n-----END PRIVATE KEY-----`;
    app.keys.publicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        createApplication: appMock,
      },
    };

    writeFileMock.mock.mockImplementation(() => Promise.resolve());

    await handler({
      name: app.name,
      privateKeyFile: privateKeyFile,
      SDK: sdkMock,
    });

    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assertCalledWith(appMock, {
      name: app.name,
      privacy: {
        improveAI: undefined,
      },
      keys: {
        publicKey: undefined,
      },
    });

    assertCalledWith(writeFileMock, 
      privateKeyFile,
      app.keys.privateKey,
    );

    assertNthCalledWith(console.log, 1, 'Application created');

    assertNthCalledWith(console.log, 
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

    const appMock = mock.fn(() => Promise.resolve(app));
    const sdkMock = {
      applications: {
        createApplication: appMock,
      },
    };

    const error = new Error('User declined');
    error.name = 'UserDeclinedError';
    writeFileMock.mock.mockImplementation(() => Promise.reject(error));

    await handler({
      name: app.name,
      privateKeyFile: privateKeyFile,
      publicKeyFile: app.keys.publicKey,
      improveAi: true,
      SDK: sdkMock,
    });

    assertCalledWith(appMock, {
      name: app.name,
      privacy: {
        improveAI: true,
      },
      keys: {
        publicKey: app.keys.publicKey,
      },
    });

    assert.ok(writeFileMock.mock.callCount() > 0);

    assertNthCalledWith(console.log, 5, 'Private key:');
    assertNthCalledWith(console.log, 6, app.keys.privateKey);
  });

  test('Should create app and output json', async () => {
    const app = getBasicApplication();
    app.keys.privateKey = `-----BEGIN PRIVATE KEY-----\n${faker.string.alpha(16)}\n-----END PRIVATE KEY-----`;
    app.keys.publicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;

    const appMock = mock.fn(() => Promise.resolve(app));
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

    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assertCalledWith(appMock, {
      name: app.name,
      privacy: {
        improveAI: undefined,
      },
      keys: {
        publicKey: undefined,
      },
    });

    assert.strictEqual(console.log.mock.callCount(), 1);
    assertNthCalledWith(console.log, 
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

    const appMock = mock.fn(() => Promise.resolve(app));
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

    assert.strictEqual(confirmMock.mock.callCount(), 0);
    assertCalledWith(appMock, {
      name: app.name,
      privacy: {
        improveAI: undefined,
      },
      keys: {
        publicKey: undefined,
      },
    });

    assert.strictEqual(console.log.mock.callCount(), 1);
    assertNthCalledWith(console.log, 
      1,
      yaml.stringify(
        Client.transformers.snakeCaseObjectKeys(app, true),
        null,
        2,
      ),
    );
  });
});

