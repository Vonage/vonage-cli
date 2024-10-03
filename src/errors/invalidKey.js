class InvalidKeyError extends Error {
  constructor() {
    super('Key must be a valid key string or a path to a file containing a key');
  }
}

class InvalidKeyFileError extends Error {
  constructor() {
    super('The key file does not contain a valid key string');
  }
}

module.exports = {
  InvalidKeyError:  InvalidKeyError,
  InvalidKeyFileError:  InvalidKeyFileError,
};

