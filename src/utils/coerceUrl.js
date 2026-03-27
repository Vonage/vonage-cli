import { URL } from 'node:url';

const coerceUrl = (argName) => (url) => {
  if (!url) {
    return url;
  }

  try {
    const parsed = new URL(url);
    return parsed.toString();
  } catch (error) {
    throw new Error(`Invalid URL for ${argName}: ${url}`, { cause: error });
  }
};

export { coerceUrl };
