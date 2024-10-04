const { spinner } = require('../ux/spinner');
const { sdkError } = require('../utils/sdkError');

exports.loadAppFromSDK = async (SDK, id) => {
  const { stop: loadStop, fail: loadFail } = spinner({ message: 'Fetching application' });
  try {
    const application = await SDK.applications.getApplication(id);
    loadStop();
    return application;
  } catch (error) {
    loadFail();
    sdkError(error);
    return;
  }
};
