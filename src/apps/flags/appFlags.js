const appFlags = {
  'public-key': {
    describe: 'Public Key. This can be either a path to the file or its contents',
    type: 'string',
  },
  'improve-ai': {
    describe: 'Allow this application to be used to improve AI models',
    type: 'boolean',
  },
};

exports.appFlags = appFlags;
