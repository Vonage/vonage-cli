const { spinner } = require('../ux/spinner');
const { sdkError } = require('../utils/sdkError');
const { Client } = require('@vonage/server-client');

const loadLinkedAppNumbersFromSDK = async (SDK, appId) => {
  const { stop: loadStop, fail: loadFail } = spinner({ message: 'Fetching numbers linked to application' });
  try {
    const numbers = await SDK.numbers.getOwnedNumbers({applicationId: appId});
    loadStop();
    // The SDK does not transform this response.
    return Client.transformers.camelCaseObjectKeys(numbers || [], true);
  } catch (error) {
    loadFail();
    sdkError(error);
    return false;
  }
};

exports.loadLinkedAppNumbersFromSDK = loadLinkedAppNumbersFromSDK;
