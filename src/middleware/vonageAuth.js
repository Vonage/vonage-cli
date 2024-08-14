const { Auth } = require('@vonage/auth');
const { Vonage } = require('@vonage/server-sdk');
const rc = require('rc');

exports.getVonageAuth = async (argv) => {
  // Use any of the args passed in
  if ((argv.apiKey && argv.apiSecret) || (argv.privateKey && argv.appId)) {
    console.info('CLI Config - Using passed in arguments');
    const auth = new Auth({
      apiKey: argv['api-key'],
      apiSecret: argv['api-secret'],
      privateKey: argv['private-key'],
      applicationId: argv['app-id'],
    });
    return {
      apiKey: argv['api-key'],
      apiSecret: argv['api-secret'],
      privateKey: argv['private-key'],
      appId: argv['app-id'],
      Auth: auth,
      SDK: new Vonage(auth),
    };
  }

  // TODO: Find global config
  // Check XDG_CONFIG_HOME and the windows one (rc will not this)

  // TODO Find nexmo cli config

  const authConfig = rc('vonage',{});
  if (!authConfig.config
    && !authConfig.API_KEY
    && !authConfig.API_SECRET
    && !authConfig.PRIVATE_KEY
    && !authConfig.APP_ID
  ) {
    console.debug('CLI Config - No configuration file found');
    return {};

  }

  console.debug('CLI Config - Configuration found:', authConfig);
  const normalConfig = Object.fromEntries(
    Object.entries(authConfig).map(
      ([key, value]) => [
        key.toUpperCase().replace(/-/g, '_'),
        value,
      ]),
  );

  console.info(authConfig.config
    ? `Using configuration from vonage config file at ${authConfig.config}`
    : 'Using configuration from environment variables',
  );
  const auth = new Auth({
    apiKey: normalConfig.API_KEY,
    apiSecret: normalConfig.API_SECRET,
    privateKey: normalConfig.PRIVATE_KEY,
    applicationId: normalConfig.APP_ID,
  });

  return {
    apiKey: normalConfig.API_KEY,
    apiSecret: normalConfig.API_SECRET,
    privateKey: normalConfig.PRIVATE_KEY,
    appId: normalConfig.APP_ID,
    Auth: auth,
    SDK: new Vonage(auth),
  };
};
