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

  // TODO Progress bar
  const { stop, fail } = spinner({ message: spinnerMessage });
  try {
    let appNumbers = [];
    let totalPages = 1;
    let totalNumbers = 0;
    do {
      console.debug(`Fetching numbers page ${index}`);
      const response = Client.transformers.camelCaseObjectKeys(
        await SDK.numbers.getOwnedNumbers({
          applicationId: appId,
          pattern: msisdn,
          size: size,
          index: index,
        }),
        true,
      );

      console.debug('Get owned numbers response:', response);
      appNumbers = [
        ...appNumbers,
        ...(response.numbers || []),
      ];

      totalNumbers = response.count || 0;
      totalPages = Math.ceil(totalNumbers / size);
      index++;
      console.debug(`Total pages: ${totalPages}`);
    } while(all && index <= totalPages);

    console.debug('Numbers linked to application:', appNumbers);

    stop();

    // The SDK does not transform this response.
    return {
      totalNumbers: totalNumbers,
      numbers: appNumbers,
    };
  } catch (error) {
    fail();
    sdkError(error);
  }
};

exports.loadOwnedNumbersFromSDK = loadOwnedNumbersFromSDK;
