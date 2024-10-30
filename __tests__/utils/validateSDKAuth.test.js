const { validatePrivateKeyAndAppId, validateApiKeyAndSecret } = require('../../src/utils/validateSDKAuth');
const { getCLIConfig, testPrivateKey, testPublicKey } = require('../common');
const { getBasicApplication } = require('../app');
const { Vonage } = require('@vonage/server-sdk');
const { mockConsole } = require('../helpers');
const { spinner } = require('../../src/ux/spinner');

jest.mock('@vonage/server-sdk');
jest.mock('../../src/ux/spinner');

describe('Utils: Validate SDK Auth', () => {
  beforeAll(() => {
    mockConsole();
  });

  test('Will validate private key and app id', async () => {
    const stop = jest.fn();
    const fail = jest.fn();
    spinner.mockReturnValue({stop, fail});

    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;
    Vonage._mockGetApplication.mockResolvedValue(application);

    const { apiKey, apiSecret } = getCLIConfig();
    const result = await validatePrivateKeyAndAppId(
      apiKey,
      apiSecret,
      application.id,
      testPrivateKey,
    );

    expect(Vonage._mockGetApplication).toHaveBeenCalledWith(application.id);
    expect(result).toBe(true);
    expect(Vonage).toHaveBeenCalledWith({
      apiKey: apiKey,
      apiSecret: apiSecret,
      privateKey: testPrivateKey,
      applicationId: application.id,
    });

    expect(spinner).toHaveBeenCalledWith({message: 'Checking App ID and Private Key: ...'});
    expect(fail).not.toHaveBeenCalled();
    expect(stop).toHaveBeenCalled();
  });

  test('Will not validate when private key does not match public', async () => {
    const stop = jest.fn();
    const fail = jest.fn();
    spinner.mockReturnValue({stop, fail});

    const application = getBasicApplication();
    Vonage._mockGetApplication.mockResolvedValue(application);

    const { apiKey, apiSecret } = getCLIConfig();
    const result = await validatePrivateKeyAndAppId(
      apiKey,
      apiSecret,
      application.id,
      testPrivateKey,
    );

    expect(Vonage._mockGetApplication).toHaveBeenCalledWith(application.id);
    expect(result).toBe(false);
    expect(Vonage).toHaveBeenCalledWith({
      apiKey: apiKey,
      apiSecret: apiSecret,
      privateKey: testPrivateKey,
      applicationId: application.id,
    });

    expect(spinner).toHaveBeenCalled();
    expect(fail).toHaveBeenCalled();
    expect(stop).not.toHaveBeenCalled();
  });

  test('Will not validate when application not found', async () => {
    const stop = jest.fn();
    const fail = jest.fn();
    spinner.mockReturnValue({stop, fail});
    const application = getBasicApplication();
    Vonage._mockGetApplication.mockRejectedValue({response: {status: 404}});
    const { apiKey, apiSecret } = getCLIConfig();

    const result = await validatePrivateKeyAndAppId(
      apiKey,
      apiSecret,
      application.id,
      testPrivateKey,
    );

    expect(Vonage._mockGetApplication).toHaveBeenCalledWith(application.id);
    expect(result).toBe(false);
    expect(Vonage).toHaveBeenCalledWith({
      apiKey: apiKey,
      apiSecret: apiSecret,
      privateKey: testPrivateKey,
      applicationId: application.id,
    });

    expect(spinner).toHaveBeenCalled();
    expect(fail).toHaveBeenCalled();
    expect(stop).not.toHaveBeenCalled();
  });

  test('Will validate api key and secret', async () => {
    const stop = jest.fn();
    const fail = jest.fn();
    spinner.mockReturnValue({stop, fail});

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

    expect(spinner).toHaveBeenCalledWith({message: 'Checking API Key Secret: ...'});
    expect(fail).not.toHaveBeenCalled();
    expect(stop).toHaveBeenCalled();
  });

  test('Will not validate api key and secret when call fails', async () => {
    const stop = jest.fn();
    const fail = jest.fn();
    spinner.mockReturnValue({stop, fail});

    Vonage._mockGetApplicationPage.mockRejectedValue({response: {status: 401}});

    const { apiKey, apiSecret } = getCLIConfig();

    const result = await validateApiKeyAndSecret(apiKey, apiSecret);

    expect(result).toBe(false);
    expect(Vonage._mockGetApplicationPage).toHaveBeenCalledWith({size: 1});
    expect(Vonage).toHaveBeenCalledWith({
      apiKey: apiKey,
      apiSecret: apiSecret,
    });

    expect(spinner).toHaveBeenCalled();
    expect(fail).toHaveBeenCalled();
    expect(stop).not.toHaveBeenCalled();
  });
});
