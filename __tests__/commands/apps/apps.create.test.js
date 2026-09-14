process.env.FORCE_COLOR = 0;
import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import yaml from 'yaml';
import { faker } from '@faker-js/faker';
import { getBasicApplication } from '../../app.js';
import { mockConsole } from '../../helpers.js';
import { Client } from '@vonage/server-client';

const confirmMock = mock.fn();
const writeFileMock = mock.fn();
const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));






test('Command: vonage apps create', { concurrency: 1 }, async (ctx) => {
  ctx.mock.module('yargs', { defaultExport: yargs });
  ctx.mock.module('../../../src/ux/confirm.js', { namedExports: { confirm: confirmMock } });
  ctx.mock.module('../../../src/utils/fs.js', { namedExports: { writeFile: writeFileMock } });
  const { handler } = await import('../../../src/commands/apps/create.js');
  ctx.beforeEach(() => {
    mockConsole();
    confirmMock.mock.resetCalls();
    writeFileMock.mock.resetCalls();
    exitMock.mock.resetCalls();
  });

  await ctx.test('Should create app and save private key', async () => {
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
    assert.deepStrictEqual(appMock.mock.calls[0].arguments, [{
      name: app.name,
      privacy: {
        improveAI: undefined,
      },
      keys: {
        publicKey: undefined,
      },
    }]);

    assert.deepStrictEqual(writeFileMock.mock.calls[0].arguments, [privateKeyFile, app.keys.privateKey]);

    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, ['Application created']);

    assert.deepStrictEqual(console.log.mock.calls[2 - 1].arguments, [[
      `Name: ${app.name}`,
      `Application ID: ${app.id}`,
      'Improve AI: Off',
      'Private/Public Key: Set',
    ].join('\n')]);
  });

  await ctx.test('Should create app and dump private key', async () => {
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

    assert.deepStrictEqual(appMock.mock.calls[0].arguments, [{
      name: app.name,
      privacy: {
        improveAI: true,
      },
      keys: {
        publicKey: app.keys.publicKey,
      },
    }]);

    assert.ok(writeFileMock.mock.callCount() > 0);

    assert.deepStrictEqual(console.log.mock.calls[5 - 1].arguments, ['Private key:']);
    assert.deepStrictEqual(console.log.mock.calls[6 - 1].arguments, [app.keys.privateKey]);
  });

  await ctx.test('Should create app and output json', async () => {
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
    assert.deepStrictEqual(appMock.mock.calls[0].arguments, [{
      name: app.name,
      privacy: {
        improveAI: undefined,
      },
      keys: {
        publicKey: undefined,
      },
    }]);

    assert.strictEqual(console.log.mock.callCount(), 1);
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(app, true),
      null,
      2,
    )]);
  });

  await ctx.test('Should create app and output yaml', async () => {
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
    assert.deepStrictEqual(appMock.mock.calls[0].arguments, [{
      name: app.name,
      privacy: {
        improveAI: undefined,
      },
      keys: {
        publicKey: undefined,
      },
    }]);

    assert.strictEqual(console.log.mock.callCount(), 1);
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [yaml.stringify(
      Client.transformers.snakeCaseObjectKeys(app, true),
      null,
      2,
    )]);
  });

  await ctx.test('Should create app and dump private key when saving it fails', async () => {
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

    const error = new Error('Disk full');
    writeFileMock.mock.mockImplementation(() => Promise.reject(error));

    await handler({
      name: app.name,
      privateKeyFile,
      SDK: sdkMock,
    });

    assert.deepStrictEqual(writeFileMock.mock.calls[0].arguments, [privateKeyFile, app.keys.privateKey]);
    assert.deepStrictEqual(console.error.mock.calls[0].arguments, ['Error saving private key:', error]);
    assert.deepStrictEqual(console.log.mock.calls[5 - 1].arguments, ['Private key:']);
    assert.deepStrictEqual(console.log.mock.calls[6 - 1].arguments, [app.keys.privateKey]);
  });
});
