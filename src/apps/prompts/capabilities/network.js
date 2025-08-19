const chalk = require('chalk');
const { prompt, urlPrompt } = require('../../../ux/prompts');
const { EOL } = require('os');

exports.promptNetworkCapabilities = async () => {
  process.stderr.write(chalk.bold.underline('Configuring Network APIs'));
  process.stderr.write(EOL);

  const networkCapabilities = {};

  networkCapabilities.networkApplicationId = await prompt(
    'What is the network Application Id:',
  );

  const { url: redirectUrl } = await urlPrompt(
    'What is the redirect url:',
    {
      hint: chalk.dim('https://example.com/network/redirect'),
    },
  );

  networkCapabilities.redirectUrl = redirectUrl;

  return networkCapabilities;
};
