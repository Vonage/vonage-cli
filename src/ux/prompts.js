const { inputFromTTY } = require('./input');

const prompt = (
  message,
  {
    required = false,
    requiredMessage = '[required]',
    ...options
  } = {},
) => {
  while (true) {
    const result = inputFromTTY({
      ...options,
      message: message,
    });

    if (required && !result) {
      console.log(requiredMessage);
      continue;
    }

    return result;
  }
};

exports.prompt = prompt;

exports.numberPrompt = async (
  message,
  {
    required = false,
    invalidMessage = 'Invalid value',
    minValue = null,
    maxValue = null,
    belowMinMessage = `Value must be above ${minValue}`,
    aboveMaxMessage = `Value must be below ${maxValue}`,
    defaultValue,
    ...options
  } = {},
) => {
  let number;
  while (true) {
    number = parseInt(await prompt(
      message,
      {
        ...options,
        value: number ? number : options.value,
      },
    )) || defaultValue;

    if (required && isNaN(number)) {
      console.log(invalidMessage);
      continue;
    }

    if (minValue !== null && number < minValue) {
      console.log(belowMinMessage);
      continue;
    }

    if (maxValue !== null && number > maxValue) {
      console.log(aboveMaxMessage);
      continue;
    }

    return number;
  };


};

exports.urlPrompt = async (
  message,
  {
    required = false,
    invalidMessage = 'Invalid URL',
    requiredMessage = 'URL is required',
    protocolMessage = 'Incorrect protocol must be http or https',
    allowedProtocols = ['https:', 'http'],
    ...options
  } = {},
) => {
  let input;
  while (true) {
    input = await prompt(
      message,
      {
        ...options,
        value: input ? input : options.value,
      },
    );

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
      continue;
    }

    if (allowedProtocols.includes(url.protocol)) {
      return {
        method: method,
        url: url.toString(),
      };
    }

    console.log(protocolMessage);
  }
};

