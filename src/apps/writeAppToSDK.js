const { spinner } = require('../ux/spinner');
const { sdkError } = require('../utils/sdkError');

exports.writeAppToSDK = async (SDK, app) => {
  const { stop, fail } = spinner({
    message: `${app.id ? 'Updating' : 'Creating'} application`,
  });

  try {
    if (app.id) {
      console.info(`Updating application: ${app.id}`);
      const newApp = await SDK.applications.updateApplication(app);
      stop();
      return newApp;
    }

    console.info('Creating new application');
    const newApp = await SDK.applications.createApplication(app);
    stop();
    return newApp;
  } catch (error) {
    console.debug(error);
    fail();
    sdkError(error);
    return;
  }
};
