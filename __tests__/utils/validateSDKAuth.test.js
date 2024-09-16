const { validatePrivateKeyAndAppId, validateApiKeyAndSecret } = require('../../src/utils/validateSDKAuth');
const { getCLIConfig, testPrivateKey, testPublicKey } = require('../common');
const { getBasicApplication } = require('../apps');
const { Vonage } = require('@vonage/server-sdk');
const { mockConsole } = require('../helpers');

jest.mock('@vonage/server-sdk');

const oldProcessStdoutWrite = process.stdout.write;

describe('Utils: Validate SDK Auth', () => {
  beforeEach(() => {
    process.stdout.write = jest.fn();
    mockConsole();
  });

  afterAll(() => {
    process.stdout.write = oldProcessStdoutWrite;
  });

  test('Will validate private key and app id', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;
    Vonage._mockGetApplication.mockResolvedValue(application);

    const result = await validatePrivateKeyAndAppId(
      application.id,
      testPrivateKey,
    );

    expect(Vonage._mockGetApplication).toHaveBeenCalledWith(application.id);
    expect(result).toBe(true);
    expect(Vonage).toHaveBeenCalledWith({
      privateKey: testPrivateKey,
      applicationId: application.id,
    });

    expect(process.stdout.write).toHaveBeenCalledTimes(2);
    expect(process.stdout.write.mock.calls[0][0]).toBe('Checking App ID and Private Key: ...');
    expect(process.stdout.write.mock.calls[1][0]).toBe('\rChecking App ID and Private Key: ✅ Valid');
  });

  test('Will validate private key and app id with no progress', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;
    Vonage._mockGetApplication.mockResolvedValue(application);

    const result = await validatePrivateKeyAndAppId(
      application.id,
      testPrivateKey,
      false,
    );

    expect(Vonage._mockGetApplication).toHaveBeenCalledWith(application.id);
    expect(result).toBe(true);
    expect(Vonage).toHaveBeenCalledWith({
      privateKey: testPrivateKey,
      applicationId: application.id,
    });

    expect(process.stdout.write).not.toHaveBeenCalled();
  });

  test('Will not validate when private key does not match public', async () => {
    const application = getBasicApplication();
    Vonage._mockGetApplication.mockResolvedValue(application);

    const result = await validatePrivateKeyAndAppId(
      application.id,
      testPrivateKey,
    );

    expect(Vonage._mockGetApplication).toHaveBeenCalledWith(application.id);
    expect(result).toBe(false);
    expect(Vonage).toHaveBeenCalledWith({
      privateKey: testPrivateKey,
      applicationId: application.id,
    });

    expect(process.stdout.write).toHaveBeenCalledTimes(2);
    expect(process.stdout.write.mock.calls[0][0]).toBe('Checking App ID and Private Key: ...');
    expect(process.stdout.write.mock.calls[1][0]).toBe('\rChecking App ID and Private Key: ❌ Invalid');
  });

  test('Will not validate when private key does not match public and not report progress', async () => {
    const application = getBasicApplication();
    Vonage._mockGetApplication.mockResolvedValue(application);

    const result = await validatePrivateKeyAndAppId(
      application.id,
      testPrivateKey,
      false,
    );

    expect(Vonage._mockGetApplication).toHaveBeenCalledWith(application.id);
    expect(result).toBe(false);
    expect(Vonage).toHaveBeenCalledWith({
      privateKey: testPrivateKey,
      applicationId: application.id,
    });

    expect(process.stdout.write).not.toHaveBeenCalled();
  });

  test('Will not validate when application not found', async () => {
    const application = getBasicApplication();
    Vonage._mockGetApplication.mockRejectedValue({response: {status: 404}});

    const result = await validatePrivateKeyAndAppId(
      application.id,
      testPrivateKey,
    );

    expect(Vonage._mockGetApplication).toHaveBeenCalledWith(application.id);
    expect(result).toBe(false);
    expect(Vonage).toHaveBeenCalledWith({
      privateKey: testPrivateKey,
      applicationId: application.id,
    });

    expect(process.stdout.write).toHaveBeenCalledTimes(2);
    expect(process.stdout.write.mock.calls[0][0]).toBe('Checking App ID and Private Key: ...');
    expect(process.stdout.write.mock.calls[1][0]).toBe('\rChecking App ID and Private Key: ❌ Invalid');
  });

  test('Will not validate when application not found and not repot progress', async () => {
    const application = getBasicApplication();
    Vonage._mockGetApplication.mockRejectedValue({response: {status: 404}});

    const result = await validatePrivateKeyAndAppId(
      application.id,
      testPrivateKey,
      false,
    );

    expect(Vonage._mockGetApplication).toHaveBeenCalledWith(application.id);
    expect(result).toBe(false);
    expect(Vonage).toHaveBeenCalledWith({
      privateKey: testPrivateKey,
      applicationId: application.id,
    });

    expect(process.stdout.write).not.toHaveBeenCalled();
  });

  test('Will validate api key and secret', async () => {
    const application = getBasicApplication();
    Vonage._mockGetApplicationPage.mockResolvedValue({
      total_items: 1,
      page_size: 1,
      total_pages: 1,
      _embedded: {
        applications: [application],
      },
    });

    const { apiKey, apiSecret } = getCLIConfig();

    const result = await validateApiKeyAndSecret(apiKey, apiSecret);

    expect(result).toBe(true);
    expect(Vonage._mockGetApplicationPage).toHaveBeenCalledWith({size: 1});
    expect(Vonage).toHaveBeenCalledWith({
      apiKey: apiKey,
      apiSecret: apiSecret,
    });

    expect(process.stdout.write).toHaveBeenCalledTimes(2);
    expect(process.stdout.write.mock.calls[0][0]).toBe('Checking API Key Secret: ...');
    expect(process.stdout.write.mock.calls[1][0]).toBe('\rChecking API Key Secret: ✅ Valid');
  });

  test('Will validate api key and secret with no progress', async () => {
    const application = getBasicApplication();
    Vonage._mockGetApplicationPage.mockResolvedValue({
      total_items: 1,
      page_size: 1,
      total_pages: 1,
      _embedded: {
        applications: [application],
      },
    });

    const { apiKey, apiSecret } = getCLIConfig();

    const result = await validateApiKeyAndSecret(apiKey, apiSecret, false);

    expect(result).toBe(true);
    expect(Vonage._mockGetApplicationPage).toHaveBeenCalledWith({size: 1});
    expect(Vonage).toHaveBeenCalledWith({
      apiKey: apiKey,
      apiSecret: apiSecret,
    });

    expect(process.stdout.write).not.toHaveBeenCalled();
  });

  test('Will not validate api key and secret when call fails', async () => {
    Vonage._mockGetApplicationPage.mockRejectedValue({response: {status: 401}});

    const { apiKey, apiSecret } = getCLIConfig();

    const result = await validateApiKeyAndSecret(apiKey, apiSecret);

    expect(result).toBe(false);
    expect(Vonage._mockGetApplicationPage).toHaveBeenCalledWith({size: 1});
    expect(Vonage).toHaveBeenCalledWith({
      apiKey: apiKey,
      apiSecret: apiSecret,
    });

    expect(process.stdout.write).toHaveBeenCalledTimes(2);
    expect(process.stdout.write.mock.calls[0][0]).toBe('Checking API Key Secret: ...');
    expect(process.stdout.write.mock.calls[1][0]).toBe('\rChecking API Key Secret: ❌ Invalid');
  });

  test('Will not validate api key and secret when call fails and will not report progress', async () => {
    Vonage._mockGetApplicationPage.mockRejectedValue({response: {status: 401}});

    const { apiKey, apiSecret } = getCLIConfig();

    const result = await validateApiKeyAndSecret(apiKey, apiSecret, false);

    expect(result).toBe(false);
    expect(Vonage._mockGetApplicationPage).toHaveBeenCalledWith({size: 1});
    expect(Vonage).toHaveBeenCalledWith({
      apiKey: apiKey,
      apiSecret: apiSecret,
    });

    expect(process.stdout.write).not.toHaveBeenCalled();
  });
});
