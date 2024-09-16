const crypto = require('crypto');
const { Vonage } = require('@vonage/server-sdk');

const validatePrivateKeyAndAppId = async (appId, privateKey) => {
  console.info('Validating API Key and Secret');

  const vonage = new Vonage({
    applicationId: appId,
    privateKey: privateKey,
  });

  try {
    console.debug('Loading application');
    const application = await vonage.applications.getApplication(appId);
    console.debug('Got Application');

    const publicKey = application.keys.publicKey;

    const encryptedString = crypto.publicEncrypt(publicKey, appId);
    const decryptedString = crypto.privateDecrypt(privateKey, encryptedString);

    console.debug('Confirming public key');
    return decryptedString.toString() === appId;
  } catch (error) {
    console.error('Error:', error);
    console.info('API Key and Secret are invalid');
    return false;
  }

};

const validateApiKeyAndSecret = async (apiKey, apiSecret) => {
  console.info('Validating API Key and Secret');

  const vonage = new Vonage({
    apiKey: apiKey,
    apiSecret: apiSecret,
  });

  try {
    console.debug('Getting an application page');
    await vonage.applications.getApplicationPage({size: 1});
    console.info('API Key and Secret are valid');
    return true;
  } catch (error) {
    console.error('Error:', error);
    console.info('API Key and Secret are invalid');
    return false;
  }
};

exports.validateApiKeyAndSecret = validateApiKeyAndSecret;
exports.validatePrivateKeyAndAppId = validatePrivateKeyAndAppId;
