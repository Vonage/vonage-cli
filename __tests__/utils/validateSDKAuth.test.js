import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { getCLIConfig, testPrivateKey, testPublicKey } from '../common.js';
import { getBasicApplication } from '../app.js';
import { mockConsole } from '../helpers.js';

const { version } = require('../../package.json');

test('Utils: Validate SDK Auth', { concurrency: 1 }, async (ctx) => {
  const mockGetApplicationPage = mock.fn();
  const mockGetApplication = mock.fn();
  const stop = mock.fn();
  const fail = mock.fn();
  const spinner = mock.fn(() => ({ stop, fail }));
  const Vonage = mock.fn(function Vonage() {
    return {
      applications: {
        getApplication: mockGetApplication,
        getApplicationPage: mockGetApplicationPage,
      },
    };
  });

  ctx.mock.module('../../src/ux/spinner.js', { namedExports: { spinner } });
  ctx.mock.module('@vonage/server-sdk', { namedExports: { Vonage } });
  const { validatePrivateKeyAndAppId, validateApiKeyAndSecret } = await import('../../src/utils/validateSDKAuth.js');

  ctx.beforeEach(() => {
    mockGetApplicationPage.mock.resetCalls();
    mockGetApplication.mock.resetCalls();
    stop.mock.resetCalls();
    fail.mock.resetCalls();
    spinner.mock.resetCalls();
    spinner.mock.mockImplementation(() => ({ stop, fail }));
    Vonage.mock.resetCalls();
    mockConsole();
  });

  await ctx.test('Will validate private key and app id', async () => {
    const application = getBasicApplication();
    application.keys.publicKey = testPublicKey;
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));

    const { apiKey, apiSecret } = getCLIConfig();
    const result = await validatePrivateKeyAndAppId(apiKey, apiSecret, application.id, testPrivateKey);

    assert.deepStrictEqual(mockGetApplication.mock.calls[0].arguments, [application.id]);
    assert.strictEqual(result, true);
    assert.deepStrictEqual(Vonage.mock.calls[0].arguments, [{
      apiKey,
      apiSecret,
      privateKey: testPrivateKey,
      applicationId: application.id,
    },
    { appendUserAgent: `cli/${version}` }]);
    assert.deepStrictEqual(spinner.mock.calls[0].arguments, [{ message: 'Checking App ID and Private Key: ...' }]);
    assert.strictEqual(fail.mock.calls.length, 0);
    assert.ok(stop.mock.calls.length > 0);
  });

  await ctx.test('Will not validate when private key does not match public', async () => {
    const localStop = mock.fn();
    const localFail = mock.fn();
    spinner.mock.mockImplementation(() => ({ stop: localStop, fail: localFail }));

    const application = getBasicApplication();
    mockGetApplication.mock.mockImplementation(() => Promise.resolve(application));
    const { apiKey, apiSecret } = getCLIConfig();
    const result = await validatePrivateKeyAndAppId(apiKey, apiSecret, application.id, testPrivateKey);

    assert.deepStrictEqual(mockGetApplication.mock.calls[0].arguments, [application.id]);
    assert.strictEqual(result, false);
    assert.deepStrictEqual(Vonage.mock.calls[0].arguments, [{
      apiKey,
      apiSecret,
      privateKey: testPrivateKey,
      applicationId: application.id,
    },
    { appendUserAgent: `cli/${version}` }]);
    assert.ok(spinner.mock.calls.length > 0);
    assert.strictEqual(localFail.mock.calls.length, 0);
    assert.ok(localStop.mock.calls.length > 0);
  });

  await ctx.test('Will not validate when application not found', async () => {
    const localStop = mock.fn();
    const localFail = mock.fn();
    spinner.mock.mockImplementation(() => ({ stop: localStop, fail: localFail }));
    const application = getBasicApplication();
    mockGetApplication.mock.mockImplementation(() => Promise.reject({ response: { status: 404 } }));
    const { apiKey, apiSecret } = getCLIConfig();

    const result = await validatePrivateKeyAndAppId(apiKey, apiSecret, application.id, testPrivateKey);

    assert.deepStrictEqual(mockGetApplication.mock.calls[0].arguments, [application.id]);
    assert.strictEqual(result, false);
    assert.deepStrictEqual(Vonage.mock.calls[0].arguments, [{
      apiKey,
      apiSecret,
      privateKey: testPrivateKey,
      applicationId: application.id,
    },
    { appendUserAgent: `cli/${version}` }]);
    assert.ok(spinner.mock.calls.length > 0);
    assert.ok(localFail.mock.calls.length > 0);
    assert.strictEqual(localStop.mock.calls.length, 0);
  });

  await ctx.test('Will validate api key and secret', async () => {
    const localStop = mock.fn();
    const localFail = mock.fn();
    spinner.mock.mockImplementation(() => ({ stop: localStop, fail: localFail }));
    const application = getBasicApplication();
    mockGetApplicationPage.mock.mockImplementation(() => Promise.resolve({
      total_items: 1,
      page_size: 1,
      total_pages: 1,
      _embedded: { applications: [application] },
    }));
    const { apiKey, apiSecret } = getCLIConfig();

    const result = await validateApiKeyAndSecret(apiKey, apiSecret);

    assert.strictEqual(result, true);
    assert.deepStrictEqual(mockGetApplicationPage.mock.calls[0].arguments, [{ size: 1 }]);
    assert.deepStrictEqual(Vonage.mock.calls[0].arguments, [{ apiKey, apiSecret }, { appendUserAgent: `cli/${version}` }]);
    assert.deepStrictEqual(spinner.mock.calls[0].arguments, [{ message: 'Checking API Key Secret: ...' }]);
    assert.strictEqual(localFail.mock.calls.length, 0);
    assert.ok(localStop.mock.calls.length > 0);
  });

  await ctx.test('Will not validate api key and secret when call fails', async () => {
    const localStop = mock.fn();
    const localFail = mock.fn();
    spinner.mock.mockImplementation(() => ({ stop: localStop, fail: localFail }));
    mockGetApplicationPage.mock.mockImplementation(() => Promise.reject({ response: { status: 401 } }));
    const { apiKey, apiSecret } = getCLIConfig();

    const result = await validateApiKeyAndSecret(apiKey, apiSecret);

    assert.strictEqual(result, false);
    assert.deepStrictEqual(mockGetApplicationPage.mock.calls[0].arguments, [{ size: 1 }]);
    assert.deepStrictEqual(Vonage.mock.calls[0].arguments, [{ apiKey, apiSecret }, { appendUserAgent: `cli/${version}` }]);
    assert.ok(spinner.mock.calls.length > 0);
    assert.ok(localFail.mock.calls.length > 0);
    assert.strictEqual(localStop.mock.calls.length, 0);
  });
});
