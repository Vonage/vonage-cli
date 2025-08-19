const chalk = require('chalk');
const { confirm } = require('../../../ux/confirm');
const { urlPrompt, numberPrompt } = require('../../../ux/prompts');
const { EOL } = require('os');


const promptWebhook = async (
  voiceCapabilities,
  which,
  key,
  hint,
) => {
  const { url, method = 'POST' } = await urlPrompt(
    `What is the URL for the ${which} webhook?`,
    {
      hint: hint,
    },
  );

  if (!url) {
    process.stderr.write(EOL);
    return;
  }

  voiceCapabilities.webhooks = {
    ...(voiceCapabilities.webhooks || {}),
  };

  voiceCapabilities.webhooks[key] = {
    address: url,
    method: method,
  };

  const configureTimeouts = await confirm(
    'Would you like to configure timeouts for this webhook? [y/n]',
    {
      defaultResponse: false,
      hint: chalk.dim('n'),
    },
  );

  if (configureTimeouts) {
    voiceCapabilities.webhooks[key].connectionTimeout = await numberPrompt(
      'Connection timeout for the answer webhook hook should be (in ms)?',
      {
        required: true,
        minValue: 300,
        maxValue: 1000,
      },
    );

    voiceCapabilities.webhooks[key].socketTimeout = await numberPrompt(
      'Socket timeout for the answer webhook hook should be (in ms)?',
      {
        required: true,
        minValue: 300,
        maxValue: 1000,
      },
    );
  }
  process.stderr.write(EOL);
};

exports.promptVoiceCapabilities = async () => {
  process.stderr.write(chalk.bold.underline('Configuring Voice APIs'));
  process.stderr.write(EOL);

  const voiceCapabilities = {};

  await promptWebhook(
    voiceCapabilities,
    'event',
    'eventUrl',
    chalk.dim('https://example.com/voice/event'),
  );

  await promptWebhook(
    voiceCapabilities,
    'answer',
    'answerUrl',
    chalk.dim('https://example.com/voice/answer'),
  );

  await promptWebhook(
    voiceCapabilities,
    'fallback',
    'fallbackAnswerUrl',
    chalk.dim('https://example.com/voice/fallback'),
  );

  voiceCapabilities.signedCallbacks = await confirm(
    'Use signed webhooks [y/n]?',
    {
      defaultResponse: true,
      hint: chalk.dim('y'),
    },
  );

  voiceCapabilities.conversationTtl = await numberPrompt(
    'Set a conversations TTL (in days)?',
    {
      maxValue: 9000,
      minValue: 1,
    },
  );

  return voiceCapabilities;
};
