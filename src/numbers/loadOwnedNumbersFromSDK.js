const { spinner } = require('../ux/spinner');
const { sdkError } = require('../utils/sdkError');
const { Client } = require('@vonage/server-client');

const searchPatterns = {
  starts: 0,
  contains: 1,
  ends: 2,
};

const loadOwnedNumbersFromSDK = async (
  SDK,
  {
    appId,
    msisdn,
    message,
    limit,
    country,
    searchPattern,
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
    let ownedNumbers = [];
    let totalPages = 1;
    let totalNumbers = 0;
    do {
      console.debug(`Fetching numbers page ${index}`);
      const response = Client.transformers.camelCaseObjectKeys(
        await SDK.numbers.getOwnedNumbers({
          country: country,
          applicationId: appId,
          searchPattern: searchPatterns[searchPattern],
          pattern: msisdn,
          size: size,
          index: index,
        }),
        true,
      );

      ownedNumbers = [
        ...ownedNumbers,
        ...(response.numbers || []),
      ];

      totalNumbers = response.count || 0;
      limit = limit || totalNumbers;
      totalPages = Math.ceil(totalNumbers / size);
      index++;
      console.debug(`Total pages: ${totalPages}`);
      console.debug(`Total numbers: ${totalNumbers}`);
    } while(all && index <= totalPages && ownedNumbers.length < limit);

    stop();

    // The SDK does not transform this response.
    return {
      totalNumbers: totalNumbers,
      numbers: ownedNumbers.slice(0, limit),
    };
  } catch (error) {
    fail();
    sdkError(error);
  }
};

exports.loadOwnedNumbersFromSDK = loadOwnedNumbersFromSDK;

exports.searchPatterns = searchPatterns;
