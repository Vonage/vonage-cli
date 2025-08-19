const chalk = require('chalk');
const { urlPrompt } = require('../../../ux/prompts');
const { select } = require('../../../ux/select');
const { confirm } = require('../../../ux/confirm');
const { EOL } = require('os');

exports.promptMessageCapabilities = async () => {
  process.stderr.write(chalk.bold.underline('Configuring Messages API'));
  process.stderr.write(EOL);

  const messageCapabilities = {
    version: 'v1',

    webhooks: {
      inboundUrl: {
        address: null,
        method: 'POST',
      },

      statusUrl: {
        address: null,
        method: 'POST',
      },
    },
  };

  const { url: inboundUrl } = await urlPrompt(
    'What is the URL for the inbound webhook?',
    {
      hint: chalk.dim('https://example.com/messages/inbound'),
    },
  );

  const { url: statusUrl } = await urlPrompt(
    'What is the URL for the status webhook?',
    {
      hint: chalk.dim('https://example.com/messages/inbound'),
    },
  );

  messageCapabilities.webhooks.inboundUrl = inboundUrl;
  messageCapabilities.webhooks.statusUrl = statusUrl;

  const version = await select({
    message: 'Which version for the data do you wish to use?',
    items: [
      {
        value: 'v1',
        option: 'v1',
        selected: true,
      },
      {
        value: 'v0.1',
        option: 'v0.1',
      },
    ],
  });

  messageCapabilities.version = version[0].value;
  messageCapabilities.authenticateInboundMedia = await confirm(
    'Do you want inbound media to be authenticated?',
    {
      defaultResponse: true,
      hint: chalk.dim('y'),
    },
  );

  return messageCapabilities;
};
