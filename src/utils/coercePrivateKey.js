const { readFileSync, existsSync } = require('node:fs');
const { InvalidPrivateKeyError }  = require('../errors/invalidPrivateKey');

exports.coercePrivateKey = (arg) => {
  if (arg.startsWith('-----BEGIN PRIVATE KEY-----')) {
    return arg;
  }

  if (!existsSync(arg)) {
    throw new InvalidPrivateKeyError();
  }

  return readFileSync(arg, 'utf-8').toString();
};
