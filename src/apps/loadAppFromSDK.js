const { spinner } = require('../ux/spinner');
const { sdkError } = require('../utils/sdkError');
const { Client } = require('@vonage/server-client');

exports.loadAppFromSDK = async (SDK, id) => {
  console.info(`Loading application ${id} through API`);
  const { stop: loadStop, fail: loadFail } = spinner({ message: 'Fetching application' });
  try {
    const application = await SDK.applications.getApplication(id);
    console.debug('Application loaded', application);
    loadStop();
    // SDK preserves old keys for compatibility
    return Client.transformers.camelCaseObjectKeys(application, true);
  } catch (error) {
    loadFail();
    sdkError(error);
    return;
  }
};
