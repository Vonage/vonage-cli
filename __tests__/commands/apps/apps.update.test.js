const { faker } = require('@faker-js/faker');
const { mockConsole } = require('../../helpers');
const { getBasicApplication } = require('../../app');
const { Client } = require('@vonage/server-client');
const { handler } = require('../../../src/commands/apps/update');
const yaml = require('yaml');

describe('Command: apps update', () => {
  let consoleMock;

  beforeEach(() => {
    consoleMock = mockConsole();
  });

  test('Will update application name', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const getAppMock = jest.fn().mockResolvedValue({...app});
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
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const getAppMock = jest.fn().mockResolvedValue({...app});
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
      improveAi: !app.privacy.improveAi,
    });

    expect(getAppMock).toHaveBeenCalledWith(app.id);
    expect(updateAppMock).toHaveBeenCalledWith({
      ...app,
      privacy: {
        improveAi: !app.privacy.improveAi,
      },
    });
  });

  test('Will update application public key', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const newPublicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;
    const getAppMock = jest.fn().mockResolvedValue({...app});
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
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const newPublicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;
    const getAppMock = jest.fn().mockResolvedValue({...app});
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
      improveAi: !app.privacy.improveAi,
      publicKeyFile: newPublicKey,
    });

    expect(getAppMock).toHaveBeenCalledWith(app.id);
    expect(updateAppMock).toHaveBeenCalledWith({
      id: app.id,
      name: `${app.name} new`,
      privacy: {
        improveAi: !app.privacy.improveAi,
      },
      keys: {
        publicKey: newPublicKey,
      },
    });
  });

  test('Will no op when no changes detected', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const getAppMock = jest.fn().mockResolvedValue({...app});
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
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const newPublicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;
    const getAppMock = jest.fn().mockResolvedValue({...app});
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
      improveAi: !app.privacy.improveAi,
      publicKeyFile: newPublicKey,
      json: true,
    });

    expect(consoleMock.log).toHaveBeenCalledTimes(1);

    expect(consoleMock.log.mock.calls[0][0]).toBe(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(
        {
          id: app.id,
          name: `${app.name} new`,
          keys: {
            public_key: newPublicKey,
          },
          privacy: {
            improve_ai: !app.privacy.improveAi,
          },
        },
        true,
        false,
      ),
      null,
      2,
    ));
  });

  test('Will output YAML when requested', async () => {
    const app = Client.transformers.camelCaseObjectKeys(
      getBasicApplication(),
      true,
      true,
    );

    const newPublicKey = `-----BEGIN PUBLIC KEY-----\n${faker.string.alpha(16)}\n-----END PUBLIC KEY-----`;
    const getAppMock = jest.fn().mockResolvedValue({...app});
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
      improveAi: !app.privacy.improveAi,
      publicKeyFile: newPublicKey,
      yaml: true,
    });

    expect(consoleMock.log).toHaveBeenCalledTimes(1);
    expect(consoleMock.log.mock.calls[0][0]).toBe(yaml.stringify(
      Client.transformers.snakeCaseObjectKeys(
        {
          id: app.id,
          name: `${app.name} new`,
          keys: {
            public_key: newPublicKey,
          },
          privacy: {
            improve_ai: !app.privacy.improveAi,
          },
        },
        true,
      ),
      null,
      2,
    ));
  });
});
