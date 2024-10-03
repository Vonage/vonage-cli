const { readFileSync, existsSync } = require('fs');
const {
  InvalidKeyFileError,
  InvalidKeyError,
}  = require('../errors/invalidKey');

exports.coerceKey = (which) => (arg) => {
  if (!arg) {
    return arg;
  }

  if (arg.startsWith(`-----BEGIN ${which.toUpperCase()} KEY-----`)) {
    return arg;
  }

  if (!existsSync(arg)) {
    throw new InvalidKeyError();
  }

  const fileContents = readFileSync(arg, 'utf-8').toString();

  if (!fileContents.startsWith(`-----BEGIN ${which.toUpperCase()} KEY-----`)) {
    throw new InvalidKeyFileError();
  }

  return fileContents;
};
