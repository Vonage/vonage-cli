const crypto = require('crypto');
const { Vonage } = require('@vonage/server-sdk');
const { spinner } = require('../ux/spinner');

const validateApplicationKey = (application, privateKey) => {
  console.debug('Validating application key');
  const publicKey = application.keys.publicKey;

  console.debug(`Public Key: ${publicKey}`);
  console.debug(`Private Key: ${privateKey}`);

  try {
    const encryptedString = crypto.publicEncrypt(publicKey, application.id);
    const decryptedString = crypto.privateDecrypt(privateKey, encryptedString);

    console.debug('Confirming public key');
    return decryptedString.toString() === application.id;
  } catch (error) {
    console.debug('Error validating application key:', error);
    return false;
  }
};

// We do not want to pass in the SDK here as we rebuild it to ensure we
// are using the correct auth values
const validatePrivateKeyAndAppId = async (apiKey, apiSecret, appId, privateKey) => {
  console.info('Validating API Key and Secret');

  if (!appId || !privateKey) {
    console.debug('App ID and Private Key are required');
    return false;
  }

  const {fail, stop} = spinner({message: 'Checking App ID and Private Key: ...'});

  try {
    const vonage = new Vonage({
      apiKey: apiKey,
      apiSecret: apiSecret,
      applicationId: appId,
      privateKey: privateKey,
    });

    console.debug('Loading application');

    // TODO update to spinner
    const application = await vonage.applications.getApplication(appId);
    console.debug('Got Application');

    console.debug('Confirming public key');
    const correctPublicKey = validateApplicationKey(application, privateKey);
    console.debug(`Public key confirmed: ${correctPublicKey ? 'Yes' : 'No'}`);

    stop();

    return correctPublicKey;
  } catch (error) {
    console.debug('Error validating API Key Secret:', error);
    console.info('API Key and Secret are invalid');
    fail();
    return false;
  }
};

const validateApiKeyAndSecret = async (apiKey, apiSecret) => {
  console.info('Validating API Key and Secret');

  if (!apiKey || !apiSecret) {
    console.debug('API Key and Secret are required');
    return false;
  }

  const {stop, fail} = spinner({message: 'Checking API Key Secret: ...'});

  try {
    const vonage = new Vonage({
      apiKey: apiKey,
      apiSecret: apiSecret,
    });

    console.debug('Getting an application page');
    await vonage.applications.getApplicationPage({size: 1});
    console.info('API Key and Secret are valid');
    stop();
    return true;
  } catch (error) {
    console.debug('Error validating App ID and Private Key', error);
    console.info('API Key and Secret are invalid');

    fail();

    return false;
  }
};

exports.validateApiKeyAndSecret = validateApiKeyAndSecret;
exports.validatePrivateKeyAndAppId = validatePrivateKeyAndAppId;
exports.validateApplicationKey = validateApplicationKey;
