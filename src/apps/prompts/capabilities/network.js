import chalk from 'chalk';
import { prompt, urlPrompt } from '../../../ux/prompts.js';
import { EOL } from 'os';

export const promptNetworkCapabilities = async () => {
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
