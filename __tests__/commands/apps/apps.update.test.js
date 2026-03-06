import { jest, describe, test, beforeEach, expect } from '@jest/globals';
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

    const getAppMock = jest.fn().mockResolvedValue({ ...app });
    const updateAppMock = jest.fn().mockResolvedValue();
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

    expect(getAppMock).toHaveBeenCalledWith(app.id);
    expect(updateAppMock).toHaveBeenCalledWith({
      ...app,
      name: `${app.name} new`,
    });
  });

  test('Will update application AI', async () => {
    const app = getBasicApplication();
    app.privacy.improveAi = false;

    const getAppMock = jest.fn().mockResolvedValue({ ...app });
    const updateAppMock = jest.fn().mockResolvedValue();
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

    expect(getAppMock).toHaveBeenCalledWith(app.id);
    expect(updateAppMock).toHaveBeenCalledWith({
      ...app,
      privacy: {
        improveAi: true,
      },
    });
  });

  test('Will update application public key', async () => {
    const app = getBasicApplication();

    const newPublicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;
    const getAppMock = jest.fn().mockResolvedValue({ ...app });
    const updateAppMock = jest.fn().mockResolvedValue();
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

    expect(getAppMock).toHaveBeenCalledWith(app.id);
    expect(updateAppMock).toHaveBeenCalledWith({
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
    const getAppMock = jest.fn().mockResolvedValue({ ...app });
    const updateAppMock = jest.fn().mockResolvedValue();
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

    expect(getAppMock).toHaveBeenCalledWith(app.id);
    expect(updateAppMock).toHaveBeenCalledWith({
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

    const getAppMock = jest.fn().mockResolvedValue({ ...app });
    const updateAppMock = jest.fn().mockResolvedValue();
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

    expect(getAppMock).toHaveBeenCalledWith(app.id);
    expect(updateAppMock).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('No changes detected');
  });

  test('Will output JSON when requested', async () => {
    const app = getBasicApplication();

    const newPublicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;
    const getAppMock = jest.fn().mockResolvedValue({ ...app });
    const updateAppMock = jest.fn().mockResolvedValue();
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

    expect(console.log).toHaveBeenCalledTimes(1);

    expect(console.log).toHaveBeenNthCalledWith(
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
    const getAppMock = jest.fn().mockResolvedValue({ ...app });
    const updateAppMock = jest.fn().mockResolvedValue();
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

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenNthCalledWith(
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
