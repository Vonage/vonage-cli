const crypto = require('crypto');
const { dumpValidInvalid } = require('../ux/dumpYesNo');
const { Vonage } = require('@vonage/server-sdk');

const validatePrivateKeyAndAppId = async (appId, privateKey, logProgress=true) => {
  console.info('Validating API Key and Secret');

  if (!appId || !privateKey) {
    console.debug('App ID and Private Key are required');
    return false;
  }

  try {
    const vonage = new Vonage({
      applicationId: appId,
      privateKey: privateKey,
    });

    console.debug('Loading application');
    if (logProgress) {
      process.stdout.write('Checking App ID and Private Key: ...');
    }

    const application = await vonage.applications.getApplication(appId);
    console.debug('Got Application');

    const publicKey = application.keys.publicKey;

    const encryptedString = crypto.publicEncrypt(publicKey, appId);
    const decryptedString = crypto.privateDecrypt(privateKey, encryptedString);

    console.debug('Confirming public key');
    const correctPublicKey = decryptedString.toString() === appId;
    console.debug(`Public key confirmed: ${correctPublicKey ? 'Yes' : 'No'}`);

    if (logProgress) {
      process.stdout.write(`\rChecking App ID and Private Key: ${dumpValidInvalid(correctPublicKey, true)}\n`);
    }

    return correctPublicKey;
  } catch (error) {
    console.debug('Error validating API Key Secret:', error);
    console.info('API Key and Secret are invalid');
    if (logProgress) {
      process.stdout.write(`\rChecking App ID and Private Key: ${dumpValidInvalid(false, true)}\n`);
    }
    return false;
  }
};

const validateApiKeyAndSecret = async (apiKey, apiSecret, logProgress=true) => {
  console.info('Validating API Key and Secret');

  if (!apiKey || !apiSecret) {
    console.debug('API Key and Secret are required');
    return false;
  }

  try {
    const vonage = new Vonage({
      apiKey: apiKey,
      apiSecret: apiSecret,
    });

    if (logProgress) {
      process.stdout.write('Checking API Key Secret: ...');
    }

    console.debug('Getting an application page');
    await vonage.applications.getApplicationPage({size: 1});
    console.info('API Key and Secret are valid');
    if (logProgress) {
      process.stdout.write(`\rChecking API Key Secret: ${dumpValidInvalid(true, true)}\n`);
    }
    return true;
  } catch (error) {
    console.debug('Error validating App ID and Private Key', error);
    console.info('API Key and Secret are invalid');

    if (logProgress) {
      process.stdout.write(`\rChecking API Key Secret: ${dumpValidInvalid(false, true)}\n`);
    }

    return false;
  }
};

exports.validateApiKeyAndSecret = validateApiKeyAndSecret;
exports.validatePrivateKeyAndAppId = validatePrivateKeyAndAppId;
