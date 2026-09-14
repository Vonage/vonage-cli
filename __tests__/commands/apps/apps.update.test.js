import { mock, test } from 'node:test';
import assert from 'node:assert/strict';
import { faker } from '@faker-js/faker';
import { mockConsole } from '../../helpers.js';
import { getBasicApplication } from '../../app.js';
import { Client } from '@vonage/server-client';
import { handler } from '../../../src/commands/apps/update.js';
import yaml from 'yaml';

test('Command: vonage apps update', { concurrency: 1 }, async (ctx) => {

  ctx.beforeEach(() => {
    mockConsole();
  });

  await ctx.test('Will update application name', async () => {
    const app = getBasicApplication();

    const getAppMock = mock.fn(() => Promise.resolve({ ...app }));
    const updateAppMock = mock.fn(() => Promise.resolve());
    const sdkMock = {
      applications: {
        getApplication: getAppMock,
        updateApplication: updateAppMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      name: `${app.name} new`,
    });

    assert.deepStrictEqual(getAppMock.mock.calls[0].arguments, [app.id]);
    assert.deepStrictEqual(updateAppMock.mock.calls[0].arguments, [{
      ...app,
      name: `${app.name} new`,
    }]);
  });

  await ctx.test('Will update application AI', async () => {
    const app = getBasicApplication();
    app.privacy.improveAi = false;

    const getAppMock = mock.fn(() => Promise.resolve({ ...app }));
    const updateAppMock = mock.fn(() => Promise.resolve());
    const sdkMock = {
      applications: {
        getApplication: getAppMock,
        updateApplication: updateAppMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      improveAi: true,
    });

    assert.deepStrictEqual(getAppMock.mock.calls[0].arguments, [app.id]);
    assert.deepStrictEqual(updateAppMock.mock.calls[0].arguments, [{
      ...app,
      privacy: {
        improveAi: true,
      },
    }]);
  });

  await ctx.test('Will update application public key', async () => {
    const app = getBasicApplication();

    const newPublicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;
    const getAppMock = mock.fn(() => Promise.resolve({ ...app }));
    const updateAppMock = mock.fn(() => Promise.resolve());
    const sdkMock = {
      applications: {
        getApplication: getAppMock,
        updateApplication: updateAppMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      publicKeyFile: newPublicKey,
    });

    assert.deepStrictEqual(getAppMock.mock.calls[0].arguments, [app.id]);
    assert.deepStrictEqual(updateAppMock.mock.calls[0].arguments, [{
      ...app,
      keys: {
        publicKey: newPublicKey,
      },
    }]);
  });

  await ctx.test('Will update all application information', async () => {
    const app = getBasicApplication();
    app.privacy.improveAi = false;

    const newPublicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;
    const getAppMock = mock.fn(() => Promise.resolve({ ...app }));
    const updateAppMock = mock.fn(() => Promise.resolve());
    const sdkMock = {
      applications: {
        getApplication: getAppMock,
        updateApplication: updateAppMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      name: `${app.name} new`,
      improveAi: true,
      publicKeyFile: newPublicKey,
    });

    assert.deepStrictEqual(getAppMock.mock.calls[0].arguments, [app.id]);
    assert.deepStrictEqual(updateAppMock.mock.calls[0].arguments, [{
      id: app.id,
      name: `${app.name} new`,
      privacy: {
        improveAi: true,
      },
      keys: {
        publicKey: newPublicKey,
      },
    }]);
  });

  await ctx.test('Will no op when no changes detected', async () => {
    const app = getBasicApplication();

    const getAppMock = mock.fn(() => Promise.resolve({ ...app }));
    const updateAppMock = mock.fn(() => Promise.resolve());
    const sdkMock = {
      applications: {
        getApplication: getAppMock,
        updateApplication: updateAppMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      name: app.name,
      improveAi: app.privacy.improveAi,
      publicKeyFile: app.keys.publicKey,
    });

    assert.deepStrictEqual(getAppMock.mock.calls[0].arguments, [app.id]);
    assert.strictEqual(updateAppMock.mock.callCount(), 0);
    assert.deepStrictEqual(console.log.mock.calls[0].arguments, ['No changes detected']);
  });

  await ctx.test('Will output JSON when requested', async () => {
    const app = getBasicApplication();

    const newPublicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;
    const getAppMock = mock.fn(() => Promise.resolve({ ...app }));
    const updateAppMock = mock.fn(() => Promise.resolve());
    const sdkMock = {
      applications: {
        getApplication: getAppMock,
        updateApplication: updateAppMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      name: `${app.name} new`,
      publicKeyFile: newPublicKey,
      json: true,
    });

    assert.strictEqual(console.log.mock.callCount(), 1);

    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(
        {
          id: app.id,
          name: `${app.name} new`,
          keys: {
            public_key: newPublicKey,
          },
          privacy: {
            improve_ai: app.privacy.improveAi,
          },
        },
        true,
        false,
      ),
      null,
      2,
    )]);
  });

  await ctx.test('Will output YAML when requested', async () => {
    const app = getBasicApplication();

    const newPublicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;
    const getAppMock = mock.fn(() => Promise.resolve({ ...app }));
    const updateAppMock = mock.fn(() => Promise.resolve());
    const sdkMock = {
      applications: {
        getApplication: getAppMock,
        updateApplication: updateAppMock,
      },
    };

    await handler({
      id: app.id,
      SDK: sdkMock,
      name: `${app.name} new`,
      publicKeyFile: newPublicKey,
      yaml: true,
    });

    assert.strictEqual(console.log.mock.callCount(), 1);
    assert.deepStrictEqual(console.log.mock.calls[1 - 1].arguments, [yaml.stringify(
      Client.transformers.snakeCaseObjectKeys(
        {
          id: app.id,
          name: `${app.name} new`,
          keys: {
            public_key: newPublicKey,
          },
          privacy: {
            improve_ai: app.privacy.improveAi,
          },
        },
        true,
      ),
      null,
      2,
    )]);
  });
});
