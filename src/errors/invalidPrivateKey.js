class InvalidPrivateKeyError extends Error {
  constructor() {
    super('Private key must be a valid key string or a path to a file containing a private key');
  }
}

module.exports = {
  InvalidPrivateKeyError:  InvalidPrivateKeyError,
};

