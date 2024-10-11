const { spinner } = require('../ux/spinner');
const { sdkError } = require('../utils/sdkError');
const { Client } = require('@vonage/server-client');

exports.loadAppFromSDK = async (SDK, id) => {
  const { stop: loadStop, fail: loadFail } = spinner({ message: 'Fetching application' });
  try {
    const application = await SDK.applications.getApplication(id);
    loadStop();
    // SDK preserves old keys for compatibility
    return Client.transformers.camelCaseObjectKeys(application, true);
  } catch (error) {
    loadFail();
    sdkError(error);
    return;
  }
};
