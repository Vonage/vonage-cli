const { spinner } = require('../ux/spinner');
const { sdkError } = require('../utils/sdkError');

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
    console.info(`Updating number: ${number.msisdn}`);
    const { errorCode, errorCodeLabel } = await SDK.numbers.updateNumber(number);
    stop();
    console.debug(`Update result: ${errorCode} ${errorCodeLabel}`);
    if (errorCode !== '200') {
      throw new FakeError(errorCodeLabel, errorCode);
    }

    return true;
  } catch (error) {
    console.debug(error);
    fail();
    sdkError(error);
    return false;
  }
};
