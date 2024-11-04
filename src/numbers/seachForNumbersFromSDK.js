const { spinner } = require('../ux/spinner');
const { sdkError } = require('../utils/sdkError');
const { Client } = require('@vonage/server-client');
const { searchPatterns } = require('./loadOwnedNumbersFromSDK');

const searchForNumbersFromSDK = async (
  SDK,
  {
    type,
    pattern,
    country,
    features,
    searchPattern,
    size = 100,
    index = 1,
  } = {},
) => {
  const { stop, fail } = spinner({ message: 'Searching for numbers' });
  try {
    console.debug(`Fetching numbers page ${index}`);
    const response = Client.transformers.camelCaseObjectKeys(
      await SDK.numbers.getAvailableNumbers({
        type: type,
        country: country,
        searchPattern: searchPatterns[searchPattern],
        features: Array.isArray(features) ? features.join(',')  : features,
        pattern: pattern,
        size: size,
        index: index,
      }),
      true,
    );

    stop();
    const foundNumbers = response.numbers || [];
    const totalNumbers = response.count || 0;
    console.debug(`Total found numbers: ${totalNumbers}`);

    return {
      totalNumbers: totalNumbers,
      numbers: foundNumbers,
    };
  } catch (error) {
    fail();
    sdkError(error);
  }
};

exports.searchForNumbersFromSDK = searchForNumbersFromSDK;

