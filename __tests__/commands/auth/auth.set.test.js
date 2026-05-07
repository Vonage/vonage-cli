import { getTestMiddlewareArgs, testPublicKey, testPrivateKey } from '../../common.js';
import { getBasicApplication } from '../../app.js';
import { mockConsole } from '../../helpers.js';

const mockGetApplicationPage = jest.fn();
const mockGetApplication = jest.fn();
const createDirectoryMock = jest.fn();
const checkOkToWriteMock = jest.fn();
const writeFileMock = jest.fn();
const writeJSONFileMock = jest.fn();

const exitMock = jest.fn();
const yargs = jest.fn().mockImplementation(() => ({ exit: exitMock }));

const __moduleMocks = {
  'yargs': (() => ({
    default: yargs,
  }))(),
  '@vonage/server-sdk': (() => {
    const Vonage = jest.fn();
    return { Vonage };
  })(),
  '../../../src/utils/fs.js': (() => ({
    createDirectory: createDirectoryMock,
    checkOkToWrite: checkOkToWriteMock,
    writeFile: writeFileMock,
    writeJSONFile: writeJSONFileMock,
  }))(),
};








const set = await loadModule(import.meta.url, '../../../src/commands/auth/set.js', __moduleMocks);
const { Vonage } = __moduleMocks['@vonage/server-sdk'];

describe('Command: vonage auth set', () => {
  beforeEach(() => {
    mockConsole();
    mockGetApplicationPage.mockReset();
    mockGetApplication.mockReset();
    createDirectoryMock.mockReset();
    checkOkToWriteMock.mockReset();
    writeFileMock.mockReset();
    writeJSONFileMock.mockReset();
    exitMock.mockReset();
    Vonage.mockReset();
    Vonage.mockImplementation(() => ({
      applications: {
        getApplication: mockGetApplication,
        getApplicationPage: mockGetApplicationPage,
      },
    }));
  });

  test('Should write to the global config file', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mockResolvedValue({ response: { status: 200 } });
    mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await set.handler(args);

    expect(createDirectoryMock).toHaveBeenCalledWith(args.config.globalConfigPath);
    expect(writeJSONFileMock).toHaveBeenCalledWith(
      args.config.globalConfigFile,
      {
        'api-key': args.config.cli.apiKey,
        'api-secret': args.config.cli.apiSecret,
        'app-id': args.config.cli.appId,
        'private-key': args.config.cli.privateKey,
      },
      `Configuration file ${args.config.globalConfigFile} already exists. Overwrite?`,
    );
  });

  test('Should only write api key and secret', async () => {
    const application = getBasicApplication();

    mockGetApplicationPage.mockResolvedValue({ response: { status: 200 } });
    mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        apiKey: args.config.cli.apiKey,
        apiSecret: args.config.cli.apiSecret,
      },
    };

    await set.handler(args);

    expect(createDirectoryMock).toHaveBeenCalledWith(args.config.globalConfigPath);
    expect(writeJSONFileMock).toHaveBeenCalledWith(
      args.config.globalConfigFile,
      {
        'api-key': args.config.cli.apiKey,
        'api-secret': args.config.cli.apiSecret,
      },
      `Configuration file ${args.config.globalConfigFile} already exists. Overwrite?`,
    );
  });

  test('Should write to the local config file', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mockResolvedValue({ response: { status: 200 } });
    mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await set.handler({ ...args, local: true });

    expect(createDirectoryMock).not.toHaveBeenCalled();
    expect(writeJSONFileMock).toHaveBeenCalledWith(
      args.config.localConfigFile,
      {
        'api-key': args.config.cli.apiKey,
        'api-secret': args.config.cli.apiSecret,
        'app-id': args.config.cli.appId,
        'private-key': args.config.cli.privateKey,
      },
      `Configuration file ${args.config.localConfigFile} already exists. Overwrite?`,
    );
  });

  test('Should handle error when writing config file fails', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mockResolvedValue({ response: { status: 200 } });
    mockGetApplication.mockResolvedValue(application);
    writeJSONFileMock.mockRejectedValue(new Error('File write failed'));

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await set.handler(args);

    expect(writeJSONFileMock).toHaveBeenCalled();
    expect(exitMock).not.toHaveBeenCalled();
  });

  test('Should not write when API Key and Secret validation fails', async () => {
    mockGetApplicationPage.mockRejectedValue({ response: { status: 401 } });

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await set.handler(args);

    expect(writeJSONFileMock).not.toHaveBeenCalled();
    expect(exitMock).toHaveBeenCalledWith(5);
  });

  test('Should not write when App Id and Private Key fails', async () => {
    const application = getBasicApplication();

    mockGetApplicationPage.mockResolvedValue({ response: { status: 200 } });
    mockGetApplication.mockResolvedValue(application);

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await set.handler(args);

    expect(writeJSONFileMock).not.toHaveBeenCalled();
    expect(exitMock).toHaveBeenCalledWith(5);
  });

  test('Should not write when createDirectory fails', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mockResolvedValue({ response: { status: 200 } });
    mockGetApplication.mockResolvedValue(application);
    createDirectoryMock.mockReturnValue(false);

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await set.handler(args);

    expect(createDirectoryMock).toHaveBeenCalledWith(args.config.globalConfigPath);
    expect(writeJSONFileMock).not.toHaveBeenCalled();
  });
});
