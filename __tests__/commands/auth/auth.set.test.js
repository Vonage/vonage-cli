const { confirm } = require('../../../src/ux/confirm');
const fs = require('fs');
const set = require('../../../src/commands/auth/set');
const { getTestMiddlewareArgs, testPublicKey, testPrivateKey } = require('../../common');
const { Vonage } = require('@vonage/server-sdk');
const { getBasicApplication } = require('../../apps');
const { mockConsole } = require('../../helpers');
const yargs = require('yargs');

jest.mock('fs');
jest.mock('../../../src/ux/confirm');
jest.mock('@vonage/server-sdk');
jest.mock('yargs');

const oldProcessStdoutWrite = process.stdout.write;

describe('Command: vonage auth set', () => {
  let consoleMock;

  beforeEach(() => {
    process.stdout.write = jest.fn();
    consoleMock = mockConsole();
  });

  afterAll(() => {
    process.stdout.write = oldProcessStdoutWrite;
  });


  test('Should write to the global config file', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    Vonage._mockGetApplicationPage.mockResolvedValue({response: {status: 200}});
    Vonage._mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs()};

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    fs.__addPath(args.config.globalConfigPath);
    expect(fs.existsSync(args.config.globalConfigPath)).toBe(true);

    await set.handler(args);

    expect(consoleMock.log.mock.calls[0][0]).toBe(`Configuration saved to ${args.config.globalConfigFile}`);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      args.config.globalConfigFile,
      JSON.stringify(
        {
          'api-key': args.config.cli.apiKey,
          'api-secret': args.config.cli.apiSecret,
          'app-id': args.config.cli.appId,
          'private-key': args.config.cli.privateKey,
        },
        null,
        2,
      ),
    );

    expect(fs.existsSync).toHaveBeenCalledWith(args.config.globalConfigPath);
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
  });

  test('Should only write api key and secret', async () => {
    Vonage._mockGetApplicationPage.mockResolvedValue({response: {status: 200}});

    const args = { ...getTestMiddlewareArgs()};

    args.config = {
      ...args.config,
      cli: {
        apiKey: args.config.cli.apiKey,
        apiSecret: args.config.cli.apiSecret,
      },
    };

    fs.__addPath(args.config.globalConfigPath);
    expect(fs.existsSync(args.config.globalConfigPath)).toBe(true);

    await set.handler(args);

    expect(consoleMock.log.mock.calls[0][0]).toBe(`Configuration saved to ${args.config.globalConfigFile}`);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      args.config.globalConfigFile,
      JSON.stringify(
        {
          'api-key': args.config.cli.apiKey,
          'api-secret': args.config.cli.apiSecret,
        },
        null,
        2,
      ),
    );

    expect(fs.existsSync).toHaveBeenCalledWith(args.config.globalConfigPath);
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
  });

  test('Should write to the global config file and create directory', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    Vonage._mockGetApplicationPage.mockResolvedValue({response: {status: 200}});
    Vonage._mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs()};

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await set.handler(args);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      args.config.globalConfigFile,
      JSON.stringify(
        {
          'api-key': args.config.cli.apiKey,
          'api-secret': args.config.cli.apiSecret,
          'app-id': args.config.cli.appId,
          'private-key': args.config.cli.privateKey,
        },
        null,
        2,
      ),
    );

    expect(fs.existsSync).toHaveBeenCalledWith(args.config.globalConfigPath);
    expect(fs.mkdirSync).toHaveBeenCalledWith(
      args.config.globalConfigPath,
      {recursive: true },
    );
    expect(confirm).not.toHaveBeenCalled();
  });

  test('Should write to the local config file', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    Vonage._mockGetApplicationPage.mockResolvedValue({response: {status: 200}});
    Vonage._mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs()};

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await set.handler({
      ...args,
      local: true,
    });

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      args.config.localConfigFile,
      JSON.stringify(
        {
          'api-key': args.config.cli.apiKey,
          'api-secret': args.config.cli.apiSecret,
          'app-id': args.config.cli.appId,
          'private-key': args.config.cli.privateKey,
        },
        null,
        2,
      ),
    );

    expect(fs.existsSync).toHaveBeenCalledWith(args.config.localConfigFile);
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
  });

  test('Should confirm overwriting file then write', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    Vonage._mockGetApplicationPage.mockResolvedValue({response: {status: 200}});
    Vonage._mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs()};

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    fs.__addFile(args.config.localConfigFile, JSON.stringify(args.config.local));
    confirm.mockResolvedValue(true);

    await set.handler({
      ...args,
      local: true,
    });


    expect(confirm).toHaveBeenCalledWith(`Configuration file ${args.config.localConfigFile} already exists. Overwrite?`);
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  test('Should confirm overwriting file and then not write', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    Vonage._mockGetApplicationPage.mockResolvedValue({response: {status: 200}});
    Vonage._mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs()};

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    fs.__addFile(args.config.localConfigFile, JSON.stringify(args.config.local));

    confirm.mockResolvedValue(false);

    await set.handler({
      ...args,
      local: true,
    });

    expect(confirm).toHaveBeenCalled();
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });

  test('Should not write when API Key and Secret validation fails', async () => {
    Vonage._mockGetApplicationPage.mockRejectedValue({response: {status: 401}});

    const args = { ...getTestMiddlewareArgs()};

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    fs.__addPath(args.config.globalConfigPath);
    expect(fs.existsSync(args.config.globalConfigPath)).toBe(true);

    await set.handler(args);

    expect(fs.writeFileSync).not.toHaveBeenCalled();

    expect(fs.existsSync).toHaveBeenCalledWith(args.config.globalConfigPath);
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(5);
  });

  test('Should not write when App Id and Private Key fails', async () => {
    const application = getBasicApplication();

    Vonage._mockGetApplicationPage.mockResolvedValue({response: {status: 200}});
    Vonage._mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs()};

    fs.__addPath(args.config.globalConfigPath);
    expect(fs.existsSync(args.config.globalConfigPath)).toBe(true);

    await set.handler(args);

    expect(fs.writeFileSync).not.toHaveBeenCalled();

    expect(fs.existsSync).toHaveBeenCalledWith(args.config.globalConfigPath);
    expect(fs.mkdirSync).not.toHaveBeenCalled();
    expect(confirm).not.toHaveBeenCalled();
    expect(yargs.exit).toHaveBeenCalledWith(5);
  });

  test('Should handle failure when mkdir fails', async () => {
    const args = getTestMiddlewareArgs();

    fs.mkdir.mockImplementation((path, options, cb) =>
      cb(new Error('Failed to create directory')),
    );

    await set.handler(args);

    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
});
