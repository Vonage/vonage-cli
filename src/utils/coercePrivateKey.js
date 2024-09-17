const { readFileSync, existsSync } = require('fs');
const { InvalidPrivateKeyError }  = require('../errors/invalidPrivateKey');
const { InvalidPrivateKeyFileError }  = require('../errors/invalidPrivateKeyFile');

exports.coercePrivateKey = (arg) => {
  if (!arg) {
    return arg;
  }

  if (arg.startsWith('-----BEGIN PRIVATE KEY-----')) {
    console.debug('Private key provided as a string');
    return arg;
  }

  if (!existsSync(arg)) {
    console.debug('Private key file does not exist');
    throw new InvalidPrivateKeyError();
  }

  const fileContents = readFileSync(arg, 'utf-8').toString();

  if (!fileContents.startsWith('-----BEGIN PRIVATE KEY-----')) {
    console.debug('Private key file does not contain a valid private key string');
    throw new InvalidPrivateKeyFileError();
  }

  console.debug('Private key provided as a file and is valid');

  return fileContents;
};
