const URL = require('url');

const coerceUrl = (argName) => (url) => {
  if (!url) {
    return url;
  }

  console.debug(`URL for ${argName}: ${url}`);
  try {
    const parsed = new URL(url);
    return parsed.toString();
  } catch (error) {
    console.error(`Invalid URL for ${argName}: ${url}`, error);
    throw new Error(`Invalid URL for ${argName}: ${url}`);
  }
};

exports.coerceUrl = coerceUrl;
