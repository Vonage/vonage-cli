const { spinner } = require('../ux/spinner');
const { sdkError } = require('../utils/sdkError');
const { Client } = require('@vonage/server-client');

const loadOwnedNumbersFromSDK = async (
  SDK,
  {
    appId = null,
    msisdn = null,
    message = null,
  },
) => {
  const spinnerMessage = message
    || appId && `Fetching numbers linked to application ${appId}`
    || 'Fetching Owned numbers';

  const { stop, fail } = spinner({ message: spinnerMessage });
  try {
    const numbers = await SDK.numbers.getOwnedNumbers({
      ...(appId ? {applicationId: appId} : {}),
      ...(msisdn ? {pattern: msisdn} : {}),
    });
    stop();
    // The SDK does not transform this response.
    return Client.transformers.camelCaseObjectKeys(numbers || [], true);
  } catch (error) {
    fail();
    sdkError(error);
    return false;
  }
};

exports.loadOwnedNumbersFromSDK = loadOwnedNumbersFromSDK;
