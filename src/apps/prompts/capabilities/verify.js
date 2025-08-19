const chalk = require('chalk');
const { urlPrompt } = require('../../../ux/prompts');
const { EOL } = require('os');

exports.promptVerifyCapabilities = async () => {
  process.stderr.write(chalk.bold.underline('Configuring Messages API'));
  process.stderr.write(EOL);

  const { url, method } = await urlPrompt(
    'What is the URL for the verify status webhook?',
    {
      required: true,
      hint: chalk.dim('https://example.com/verify/status'),
    },
  );

  if (!url) {
    return;
  }

  return {
    verify: {
      webhooks: {
        statusUrl: {
          address: url,
          method: method || 'POST',
        },
      },
    },

  };
};
