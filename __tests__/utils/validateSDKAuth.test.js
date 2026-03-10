import { jest, describe, test, beforeEach, expect } from '@jest/globals';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { getCLIConfig, testPrivateKey, testPublicKey } from '../common.js';
import { getBasicApplication } from '../app.js';
import { mockConsole } from '../helpers.js';

const { version } = require('../../package.json');

describe('Utils: Validate SDK Auth', () => {
  let mockGetApplicationPage = jest.fn();
  let mockGetApplication = jest.fn();
  let stop = jest.fn();
  let fail = jest.fn();
  let validatePrivateKeyAndAppId;
  let validateApiKeyAndSecret;
  let spinner;
  let Vonage;

  let VonageClass = jest.fn().mockImplementation(() => {
    return {
      applications: {
        getApplication: mockGetApplication,
        getApplicationPage: mockGetApplicationPage,
      },
    };
  });

  jest.unstable_mockModule('../../src/ux/spinner.js', () => ({
    spinner: jest.fn().mockImplementation(() => ({
      stop,
      fail,
    })),
  }));

  jest.unstable_mockModule('@vonage/server-sdk', () => ({
    Vonage: VonageClass,
  }));

  beforeEach(async () => {
    mockGetApplicationPage = jest.fn();
    mockGetApplication = jest.fn();

    Vonage = (await import('@vonage/server-sdk')).Vonage;
    spinner = (await import('../../src/ux/spinner.js')).spinner;
    const check = await import('../../src/utils/validateSDKAuth.js');
    validateApiKeyAndSecret = check.validateApiKeyAndSecret;
    validatePrivateKeyAndAppId = check.validatePrivateKeyAndAppId;
    mockConsole();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('Will validate private key and app id', async () => {

    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;
    mockGetApplication.mockResolvedValue(application);

    const { apiKey, apiSecret } = getCLIConfig();
    const result = await validatePrivateKeyAndAppId(
      apiKey,
      apiSecret,
      application.id,
      testPrivateKey,
    );

    expect(mockGetApplication).toHaveBeenCalledWith(application.id);
    expect(result).toBe(true);
    expect(Vonage).toHaveBeenCalledWith(
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

    expect(spinner).toHaveBeenCalledWith({ message: 'Checking App ID and Private Key: ...' });
    expect(fail).not.toHaveBeenCalled();
    expect(stop).toHaveBeenCalled();
  });

  test('Will not validate when private key does not match public', async () => {
    const stop = jest.fn();
    const fail = jest.fn();
    spinner.mockReturnValue({ stop, fail });

    const application = getBasicApplication();
    mockGetApplication.mockResolvedValue(application);

    const { apiKey, apiSecret } = getCLIConfig();
    const result = await validatePrivateKeyAndAppId(
      apiKey,
      apiSecret,
      application.id,
      testPrivateKey,
    );

    expect(mockGetApplication).toHaveBeenCalledWith(application.id);
    expect(result).toBe(false);
    expect(Vonage).toHaveBeenCalledWith(
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

    expect(spinner).toHaveBeenCalled();
    expect(fail).not.toHaveBeenCalled();
    expect(stop).toHaveBeenCalled();
  });

  test('Will not validate when application not found', async () => {
    const stop = jest.fn();
    const fail = jest.fn();
    spinner.mockReturnValue({ stop, fail });
    const application = getBasicApplication();
    mockGetApplication.mockRejectedValue({ response: { status: 404 } });
    const { apiKey, apiSecret } = getCLIConfig();

    const result = await validatePrivateKeyAndAppId(
      apiKey,
      apiSecret,
      application.id,
      testPrivateKey,
    );

    expect(mockGetApplication).toHaveBeenCalledWith(application.id);
    expect(result).toBe(false);
    expect(Vonage).toHaveBeenCalledWith(
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

    expect(spinner).toHaveBeenCalled();
    expect(fail).toHaveBeenCalled();
    expect(stop).not.toHaveBeenCalled();
  });

  test('Will validate api key and secret', async () => {
    const stop = jest.fn();
    const fail = jest.fn();
    spinner.mockReturnValue({ stop, fail });

    const application = getBasicApplication();
    mockGetApplicationPage.mockResolvedValue({
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
    expect(mockGetApplicationPage).toHaveBeenCalledWith({ size: 1 });
    expect(Vonage).toHaveBeenCalledWith(
      {
        apiKey: apiKey,
        apiSecret: apiSecret,
      },
      {
        appendUserAgent: `cli/${version}`,
      },
    );

    expect(spinner).toHaveBeenCalledWith({ message: 'Checking API Key Secret: ...' });
    expect(fail).not.toHaveBeenCalled();
    expect(stop).toHaveBeenCalled();
  });

  test('Will not validate api key and secret when call fails', async () => {
    const stop = jest.fn();
    const fail = jest.fn();
    spinner.mockReturnValue({ stop, fail });

    mockGetApplicationPage.mockRejectedValue({ response: { status: 401 } });

    const { apiKey, apiSecret } = getCLIConfig();

    const result = await validateApiKeyAndSecret(apiKey, apiSecret);

    expect(result).toBe(false);
    expect(mockGetApplicationPage).toHaveBeenCalledWith({ size: 1 });
    expect(Vonage).toHaveBeenCalledWith(
      {
        apiKey: apiKey,
        apiSecret: apiSecret,
      },
      {
        appendUserAgent: `cli/${version}`,
      },
    );

    expect(spinner).toHaveBeenCalled();
    expect(fail).toHaveBeenCalled();
    expect(stop).not.toHaveBeenCalled();
  });
});
