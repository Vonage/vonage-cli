const { prompt } = require('../input');

exports.urlPrompt = async (
  message,
  {
    required = false,
    invalidMessage = 'Invalid URL',
    requiredMessage = 'URL is required',
    protocolMessage = 'Incorrect protocol must be http or https',
    allowedProtocols = ['https:', 'http'],
  } = {},
) => {
  while(true) {
    const input = await prompt(message);

    const match = /^(?:(GET|POST)\s+)?(.+)$/.exec(input);
    if (required && !match) {
      console.log(requiredMessage);
      continue;
    }

    if (!match) {
      return {};
    }

    const method = (match[1] || '').toUpperCase() || null;

    if (required && !match[2]) {
      console.log(requiredMessage);
      continue;
    }

    let url;

    try {
      url = new URL(match[2]);
    } catch {
      console.log(invalidMessage);
    }

    if (allowedProtocols.includes(url.protocol)) {
      return { method, url };
    }

    console.log(protocolMessage);
  }
};
