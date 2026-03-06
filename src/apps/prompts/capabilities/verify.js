import chalk from 'chalk';
import { urlPrompt } from '../../../ux/prompts.js';
import { EOL } from 'os';

export const promptVerifyCapabilities = async () => {
  process.stderr.write(chalk.bold.underline('Configuring Verify API'));
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
