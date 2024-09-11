const { validatePrivateKeyAndAppId, validateApiKeyAndSecret } = require('../../src/utils/validateSDKAuth');
const { getCLIConfig, testPrivateKey, testPublicKey } = require('../common');
const { getBasicApplication } = require('../apps');
const { Vonage } = require('@vonage/server-sdk');

jest.mock('@vonage/server-sdk');

describe('Utils: Validate SDK Auth', () => {
  test('Will validate private key and app id', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;
    Vonage._mockGetApplication.mockResolvedValue(application);

    const result = await validatePrivateKeyAndAppId(
      testPrivateKey,
      application.id,
    );

    expect(Vonage._mockGetApplication).toHaveBeenCalledWith(application.id);
    expect(result).toBe(true);
    expect(Vonage).toHaveBeenCalledWith({
      privateKey: testPrivateKey,
      applicationId: application.id,
    });
  });

  test('Will not validate when private key does not match public', async () => {
    const application = getBasicApplication();
    Vonage._mockGetApplication.mockResolvedValue(application);

    const result = await validatePrivateKeyAndAppId(
      testPrivateKey,
      application.id,
    );

    expect(Vonage._mockGetApplication).toHaveBeenCalledWith(application.id);
    expect(result).toBe(false);
    expect(Vonage).toHaveBeenCalledWith({
      privateKey: testPrivateKey,
      applicationId: application.id,
    });
  });

  test('Will not validate when application not found', async () => {
    const application = getBasicApplication();
    Vonage._mockGetApplication.mockRejectedValue({response: {status: 404}});

    const result = await validatePrivateKeyAndAppId(
      testPrivateKey,
      application.id,
    );

    expect(Vonage._mockGetApplication).toHaveBeenCalledWith(application.id);
    expect(result).toBe(false);
    expect(Vonage).toHaveBeenCalledWith({
      privateKey: testPrivateKey,
      applicationId: application.id,
    });
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
  });
});
