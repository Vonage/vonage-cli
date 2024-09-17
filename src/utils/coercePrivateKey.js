const { readFileSync, existsSync } = require('fs');
const { InvalidPrivateKeyError }  = require('../errors/invalidPrivateKey');
const { InvalidPrivateKeyFileError }  = require('../errors/invalidPrivateKeyFile');

exports.coercePrivateKey = (arg) => {
  if (!arg) {
    return arg;
  }

  if (arg.startsWith('-----BEGIN PRIVATE KEY-----')) {
    return arg;
  }

  if (!existsSync(arg)) {
    throw new InvalidPrivateKeyError();
  }

  const fileContents = readFileSync(arg, 'utf-8').toString();

  if (!fileContents.startsWith('-----BEGIN PRIVATE KEY-----')) {
    throw new InvalidPrivateKeyFileError();
  }

  return fileContents;
};
