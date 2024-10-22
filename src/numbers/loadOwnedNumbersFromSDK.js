const { spinner } = require('../ux/spinner');
const { sdkError } = require('../utils/sdkError');
const { Client } = require('@vonage/server-client');

const loadOwnedNumbersFromSDK = async (
  SDK,
  {
    appId,
    msisdn,
    message,
    size = 100,
    index = 1,
    all = false,
  } = {},
) => {
  const spinnerMessage = message
    || appId && `Fetching numbers linked to application ${appId}`
    || 'Fetching Owned numbers';

  const { stop, fail } = spinner({ message: spinnerMessage });
  try {
    let appNumbers = [];
    let totalPages = 1;
    do {
      console.debug(`Fetching numbers page ${index}`);
      const response = Client.transformers.camelCaseObjectKeys(
        await SDK.numbers.getOwnedNumbers({
          applicationId: appId,
          pattern: msisdn,
          size: size,
          index: index,
        }),
      );

      appNumbers = [
        ...appNumbers,
        ...(response.numbers || []).map(({msisdn}) => msisdn),
      ];

      totalPages = Math.ceil(response.count / size);
      index++;
    } while(all && index <= totalPages);

    stop();

    // The SDK does not transform this response.
    return appNumbers;
  } catch (error) {
    fail();
    sdkError(error);
    return false;
  }
};

exports.loadOwnedNumbersFromSDK = loadOwnedNumbersFromSDK;
