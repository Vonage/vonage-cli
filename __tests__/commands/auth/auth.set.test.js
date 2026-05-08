import { getTestMiddlewareArgs, testPublicKey, testPrivateKey } from '../../common.js';
import { getBasicApplication } from '../../app.js';
import { mockConsole } from '../../helpers.js';

const mockGetApplicationPage = mock.fn();
const mockGetApplication = mock.fn();
const createDirectoryMock = mock.fn();
const checkOkToWriteMock = mock.fn();
const writeFileMock = mock.fn();
const writeJSONFileMock = mock.fn();

const exitMock = mock.fn();
const yargs = mock.fn(() => ({ exit: exitMock }));

const __moduleMocks = {
  'yargs': (() => ({
    default: yargs,
  }))(),
  '@vonage/server-sdk': (() => {
    // mock.fn() from node:test cannot be used with `new`.
    // Build a trackable constructor manually.
    const vonageCalls = [];
    let vonageImpl = () => undefined;
    const Vonage = function(...args) {
      vonageCalls.push({ arguments: args });
      return vonageImpl.call(this, ...args);
    };
    Vonage.mock = {
      get calls() { return vonageCalls; },
      callCount() { return vonageCalls.length; },
      resetCalls() { vonageCalls.length = 0; },
      mockImplementation(fn) { vonageImpl = fn; },
    };
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
    mockGetApplicationPage.mock.resetCalls();
    mockGetApplication.mock.resetCalls();
    createDirectoryMock.mock.resetCalls();
    checkOkToWriteMock.mock.resetCalls();
    writeFileMock.mock.resetCalls();
    writeJSONFileMock.mock.resetCalls();
    exitMock.mock.resetCalls();
    Vonage.mock.resetCalls();
    Vonage.mock.mockImplementation(() => ({
      applications: {
        getApplication: mockGetApplication,
        getApplicationPage: mockGetApplicationPage,
      },
    }));
  });

  test('Should write to the global config file', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({ response: { status: 200 } }));
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await set.handler(args);

    assertCalledWith(createDirectoryMock, args.config.globalConfigPath);
    assertCalledWith(
      writeJSONFileMock,
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

    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({ response: { status: 200 } }));
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        apiKey: args.config.cli.apiKey,
        apiSecret: args.config.cli.apiSecret,
      },
    };

    await set.handler(args);

    assertCalledWith(createDirectoryMock, args.config.globalConfigPath);
    assertCalledWith(
      writeJSONFileMock,
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

    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({ response: { status: 200 } }));
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await set.handler({ ...args, local: true });

    assert.strictEqual(createDirectoryMock.mock.callCount(), 0);
    assertCalledWith(
      writeJSONFileMock,
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

    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({ response: { status: 200 } }));
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));
    writeJSONFileMock.mock.mockImplementation(() => Promise.reject(new Error('File write failed')));

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await set.handler(args);

    assert.ok(writeJSONFileMock.mock.callCount() > 0);
    assert.strictEqual(exitMock.mock.callCount(), 0);
  });

  test('Should not write when API Key and Secret validation fails', async () => {
    mockGetApplicationPage.mock.mockImplementation(() => Promise.reject({ response: { status: 401 } }));

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await set.handler(args);

    assert.strictEqual(writeJSONFileMock.mock.callCount(), 0);
    assertCalledWith(exitMock, 5);
  });

  test('Should not write when App Id and Private Key fails', async () => {
    const application = getBasicApplication();

    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({ response: { status: 200 } }));
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await set.handler(args);

    assert.strictEqual(writeJSONFileMock.mock.callCount(), 0);
    assertCalledWith(exitMock, 5);
  });

  test('Should not write when createDirectory fails', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;

    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({ response: { status: 200 } }));
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));
    createDirectoryMock.mock.mockImplementation(() => false);

    const args = { ...getTestMiddlewareArgs() };

    args.config = {
      ...args.config,
      cli: {
        ...args.config.local,
        privateKey: testPrivateKey,
      },
    };

    await set.handler(args);

    assertCalledWith(createDirectoryMock, args.config.globalConfigPath);
    assert.strictEqual(writeJSONFileMock.mock.callCount(), 0);
  });
});
