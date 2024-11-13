const { spinner } = require('../ux/spinner');
const { sdkError } = require('../utils/sdkError');

const loadUserFromSDK = async (SDK, userId) => {
  const { stop, fail } = spinner({
    message: 'Fetching user',
  });

  try {
    const user = await SDK.users.getUser(userId);
    stop();
    console.debug('User from API', user);
    return user;
  } catch (error) {
    fail();
    sdkError(error);
  }
};

exports.loadUserFromSDK = loadUserFromSDK;
