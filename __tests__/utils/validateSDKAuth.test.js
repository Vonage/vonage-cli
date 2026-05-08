import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { getCLIConfig, testPrivateKey, testPublicKey } from '../common.js';
import { getBasicApplication } from '../app.js';
import { mockConsole } from '../helpers.js';

const { version } = require('../../package.json');

describe('Utils: Validate SDK Auth', () => {
  let mockGetApplicationPage = mock.fn();
  let mockGetApplication = mock.fn();
  let stop = mock.fn();
  let fail = mock.fn();
  let validatePrivateKeyAndAppId;
  let validateApiKeyAndSecret;
  let spinner;
  let Vonage;

  let VonageClass = mock.fn(() => {
    return {
      applications: {
        getApplication: mockGetApplication,
        getApplicationPage: mockGetApplicationPage,
      },
    };
  });

  const __moduleMocks = {
    '../../src/ux/spinner.js': (() => ({
      spinner: mock.fn(() => ({
        stop,
        fail,
      })),
    }))(),
    '@vonage/server-sdk': (() => ({
      Vonage: VonageClass,
    }))(),
  };

  beforeEach(async () => {
    mockGetApplicationPage = mock.fn();
    mockGetApplication = mock.fn();

    Vonage = (__moduleMocks['@vonage/server-sdk']).Vonage;
    spinner = (__moduleMocks['../../src/ux/spinner.js']).spinner;
    const check = await loadModule(import.meta.url, '../../src/utils/validateSDKAuth.js', __moduleMocks);
    validateApiKeyAndSecret = check.validateApiKeyAndSecret;
    validatePrivateKeyAndAppId = check.validatePrivateKeyAndAppId;
    mockConsole();
  });

  afterAll(() => {
    mockGetApplicationPage.mock.resetCalls();
    mockGetApplication.mock.resetCalls();
    stop.mock.resetCalls();
    fail.mock.resetCalls();
    VonageClass.mock.resetCalls();
    if (spinner) spinner.mock.resetCalls();
  });

  test('Will validate private key and app id', async () => {

    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));

    const { apiKey, apiSecret } = getCLIConfig();
    const result = await validatePrivateKeyAndAppId(
      apiKey,
      apiSecret,
      application.id,
      testPrivateKey,
    );

    assertCalledWith(mockGetApplication, application.id);
    assert.strictEqual(result, true);
    assertCalledWith(
      Vonage,
      {
        apiKey: apiKey,
        apiSecret: apiSecret,
        privateKey: testPrivateKey,
        applicationId: application.id,
      },
      {
        appendUserAgent: `cli/${version}`,
      },
    );

    assertCalledWith(spinner, { message: 'Checking App ID and Private Key: ...' });
    assert.strictEqual(fail.mock.callCount(), 0);
    assert.ok(stop.mock.callCount() > 0);
  });

  test('Will not validate when private key does not match public', async () => {
    const stop = mock.fn();
    const fail = mock.fn();
    spinner.mock.mockImplementation(() => ({ stop, fail }));

    const application = getBasicApplication();
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));

    const { apiKey, apiSecret } = getCLIConfig();
    const result = await validatePrivateKeyAndAppId(
      apiKey,
      apiSecret,
      application.id,
      testPrivateKey,
    );

    assertCalledWith(mockGetApplication, application.id);
    assert.strictEqual(result, false);
    assertCalledWith(
      Vonage,
      {
        apiKey: apiKey,
        apiSecret: apiSecret,
        privateKey: testPrivateKey,
        applicationId: application.id,
      },
      {
        appendUserAgent: `cli/${version}`,
      },
    );

    assert.ok(spinner.mock.callCount() > 0);
    assert.strictEqual(fail.mock.callCount(), 0);
    assert.ok(stop.mock.callCount() > 0);
  });

  test('Will not validate when application not found', async () => {
    const stop = mock.fn();
    const fail = mock.fn();
    spinner.mock.mockImplementation(() => ({ stop, fail }));
    const application = getBasicApplication();
    mockGetApplication.mock.mockImplementation(() => Promise.reject({ response: { status: 404 } }));
    const { apiKey, apiSecret } = getCLIConfig();

    const result = await validatePrivateKeyAndAppId(
      apiKey,
      apiSecret,
      application.id,
      testPrivateKey,
    );

    assertCalledWith(mockGetApplication, application.id);
    assert.strictEqual(result, false);
    assertCalledWith(
      Vonage,
      {
        apiKey: apiKey,
        apiSecret: apiSecret,
        privateKey: testPrivateKey,
        applicationId: application.id,
      },
      {
        appendUserAgent: `cli/${version}`,
      },
    );

    assert.ok(spinner.mock.callCount() > 0);
    assert.ok(fail.mock.callCount() > 0);
    assert.strictEqual(stop.mock.callCount(), 0);
  });

  test('Will validate api key and secret', async () => {
    const stop = mock.fn();
    const fail = mock.fn();
    spinner.mock.mockImplementation(() => ({ stop, fail }));

    const application = getBasicApplication();
    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({
      total_items: 1,
      page_size: 1,
      total_pages: 1,
      _embedded: {
        applications: [application],
      },
    }));

    const { apiKey, apiSecret } = getCLIConfig();

    const result = await validateApiKeyAndSecret(apiKey, apiSecret);

    assert.strictEqual(result, true);
    assertCalledWith(mockGetApplicationPage, { size: 1 });
    assertCalledWith(
      Vonage,
      {
        apiKey: apiKey,
        apiSecret: apiSecret,
      },
      {
        appendUserAgent: `cli/${version}`,
      },
    );

    assertCalledWith(spinner, { message: 'Checking API Key Secret: ...' });
    assert.strictEqual(fail.mock.callCount(), 0);
    assert.ok(stop.mock.callCount() > 0);
  });

  test('Will not validate api key and secret when call fails', async () => {
    const stop = mock.fn();
    const fail = mock.fn();
    spinner.mock.mockImplementation(() => ({ stop, fail }));

    mockGetApplicationPage.mock.mockImplementation(() => Promise.reject({ response: { status: 401 } }));

    const { apiKey, apiSecret } = getCLIConfig();

    const result = await validateApiKeyAndSecret(apiKey, apiSecret);

    assert.strictEqual(result, false);
    assertCalledWith(mockGetApplicationPage, { size: 1 });
    assertCalledWith(
      Vonage,
      {
        apiKey: apiKey,
        apiSecret: apiSecret,
      },
      {
        appendUserAgent: `cli/${version}`,
      },
    );

    assert.ok(spinner.mock.callCount() > 0);
    assert.ok(fail.mock.callCount() > 0);
    assert.strictEqual(stop.mock.callCount(), 0);
  });
});
