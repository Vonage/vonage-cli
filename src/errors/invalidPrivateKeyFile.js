class InvalidPrivateKeyFileError extends Error {
  constructor() {
    super('The private key file does not contain a valid private key string');
  }
}

module.exports = {
  InvalidPrivateKeyFileError:  InvalidPrivateKeyFileError,
};
