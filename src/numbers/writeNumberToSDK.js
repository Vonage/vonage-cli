const { spinner } = require('../ux/spinner');
const { sdkError } = require('../utils/sdkError');

// Fake error since the API will not return an API error
// This allows the sdkError function to display the error response
class FakeError extends Error {
  response;

  constructor(message, code) {
    super(message);
    this.response = {
      status: code,
      json: async () => ({ error: message }),
    };
  }
}

exports.writeNumberToSDK = async (SDK, number) => {
  const { stop, fail } = spinner({
    message: 'Saving number information to API',
  });

  try {
    console.info(`Saving number: ${number.msisdn}`);
    const { errorCode, errorCodeLabel } = await SDK.numbers.updateNumber(number);
    stop();
    console.debug(`Result: ${errorCode} ${errorCodeLabel}`);
    if (errorCode !== '200') {
      throw new FakeError(errorCodeLabel, errorCode);
    }

    return true;
  } catch (error) {
    console.debug(error);
    fail();
    sdkError(error);
  }
};
