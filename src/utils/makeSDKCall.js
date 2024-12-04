const { spinner } = require('../ux/spinner');
const { sdkError } = require('../utils/sdkError');

exports.makeSDKCall = async (sdkFn, message, ...params) => {
  console.debug(`Calling SDK function ${sdkFn.name}`);
  const { stop: loadStop, fail: loadFail } = spinner({ message: message });
  try {
    const result = await sdkFn(...params);
    console.debug('SDK function result', result);
    loadStop();
    return result;
  } catch (error) {
    loadFail();
    sdkError(error);
    return;
  }
};
