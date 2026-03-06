import chalk from 'chalk';
import { confirm } from '../../../ux/confirm.js';
import { urlPrompt } from '../../../ux/prompts.js';
import { EOL } from 'os';

export const promptRTCCapabilities = async () => {
  process.stderr.write(chalk.bold.underline('Configuring RTC APIs'));
  process.stderr.write(EOL);

  const rtcCapabilities = {
    webhooks: {
      eventUrl: {
        address: null,
        httpMethod: 'POST',
      },
    },
    signedCallbacks: false,
  };

  const { url: eventUrl, method = 'POST' } = await urlPrompt(
    'What is the URL for the event webhook?',
    {
      required: true,
      hint: chalk.dim('https://example.com/rtc/event'),
    },
  );

  rtcCapabilities.webhooks.eventUrl.address = eventUrl;
  rtcCapabilities.webhooks.eventUrl.httpMethod = method;

  rtcCapabilities.signedCallbacks = await confirm(
    'Use signed webhooks [y/n]',
    {
      defaultResponse: true,
      hint: chalk.dim('y'),
    },
  );

  return rtcCapabilities;
};
