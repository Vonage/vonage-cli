const { coerceKey } = require('./utils/coerceKey');

exports.apiKey = {
  describe: 'Your Vonage API key',
  type: 'string',
  group: 'Vonage Credentials:',
  implies: 'api-secret',
};

exports.apiSecret = {
  describe: 'Your Vonage API secret',
  type: 'string',
  implies: 'api-key',
  group: 'Vonage Credentials:',
};

exports.privateKey = {
  describe: 'Your Vonage private key',
  type: 'string',
  group: 'Vonage Credentials:',
  implies: 'app-id',
  coerce: coerceKey('private'),
};

exports.appId = {
  describe: 'Your Vonage application ID',
  group: 'Vonage Credentials:',
  type: 'string',
  implies: 'private-key',
};

