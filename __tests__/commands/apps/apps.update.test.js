import { faker } from '@faker-js/faker';
import { mockConsole } from '../../helpers.js';
import { getBasicApplication } from '../../app.js';
import { Client } from '@vonage/server-client';
import { handler } from '../../../src/commands/apps/update.js';
import yaml from 'yaml';

describe('Command: vonage apps update', () => {
  beforeEach(() => {
    mockConsole();
  });

  test('Will update application name', async () => {
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

    assertCalledWith(getAppMock, app.id);
    assertCalledWith(updateAppMock, {
      ...app,
      name: `${app.name} new`,
    });
  });

  test('Will update application AI', async () => {
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

    assertCalledWith(getAppMock, app.id);
    assertCalledWith(updateAppMock, {
      ...app,
      privacy: {
        improveAi: true,
      },
    });
  });

  test('Will update application public key', async () => {
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

    assertCalledWith(getAppMock, app.id);
    assertCalledWith(updateAppMock, {
      ...app,
      keys: {
        publicKey: newPublicKey,
      },
    });
  });

  test('Will update all application information', async () => {
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

    assertCalledWith(getAppMock, app.id);
    assertCalledWith(updateAppMock, {
      id: app.id,
      name: `${app.name} new`,
      privacy: {
        improveAi: true,
      },
      keys: {
        publicKey: newPublicKey,
      },
    });
  });

  test('Will no op when no changes detected', async () => {
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

    assertCalledWith(getAppMock, app.id);
    assert.strictEqual(updateAppMock.mock.callCount(), 0);
    assertCalledWith(console.log, 'No changes detected');
  });

  test('Will output JSON when requested', async () => {
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

    assertNthCalledWith(console.log, 
      1,
      JSON.stringify(
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
      ),
    );
  });

  test('Will output YAML when requested', async () => {
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
    assertNthCalledWith(console.log, 
      1, yaml.stringify(
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
      ),
    );
  });
});
