const chalk = require('chalk');
const { urlPrompt, prompt } = require('../../../ux/prompts');
const { EOL } = require('os');

const promptWebhookCapability = async (
  videoCapabilities,
  key,
  promptText,
  hint,
) => {
  const { url } = await urlPrompt(
    promptText,
    {
      required: true,
      hint: hint,
    },
  );

  if (!url) {
    process.stderr.write(EOL);
    return;
  }

  videoCapabilities.webhooks = {
    ...(videoCapabilities.webhooks || {}),
  };

  const secret = await prompt(
    'Secret for this WebHook?',
  );

  videoCapabilities.webhooks[key] = {
    address: url,
    secret: secret,
  };

  process.stderr.write(EOL);
};

const promptSession = async (videoCapabilities) => {
  await promptWebhookCapability(
    videoCapabilities,
    'connectionCreated',
    'What is the URL for the connection created webhook?',
    chalk.dim('https://example.com/video/connection_created'),
  );

  await promptWebhookCapability(
    videoCapabilities,
    'connectionDestroyed',
    'What is the URL for the connection destroyed webhook?',
    chalk.dim(
      videoCapabilities?.webhooks?.connectionCreated?.address ||
      'https://example.com/video/connection_destroyed',
    ),
  );

  await promptWebhookCapability(
    videoCapabilities,
    'streamCreated',
    'What is the URL for the stream created webhook?',
    chalk.dim(
      videoCapabilities?.webhooks?.connectionCreated?.address ||
      'https://example.com/video/stream_created',
    ),
  );

  await promptWebhookCapability(
    videoCapabilities,
    'streamDestroyed',
    'What is the URL for the stream destroyed webhook?',
    chalk.dim(
      videoCapabilities?.webhooks?.connectionCreated?.address ||
      'https://example.com/video/stream_destroyed',
    ),
  );

  await promptWebhookCapability(
    videoCapabilities,
    'streamNotification',
    'What is the URL for the stream notification webhook?',
    chalk.dim(
      videoCapabilities?.webhooks?.connectionCreated?.address ||
      'https://example.com/video/stream_notification',
    ),
  );
};

const promptSIP = async (videoCapabilities) => {
  await promptWebhookCapability(
    videoCapabilities,
    'sipCallCreated',
    'What is the URL for the SIP call created webhook?',
    chalk.dim('https://example.com/video/sip_call_created'),
  );

  await promptWebhookCapability(
    videoCapabilities,
    'sipCallDestroyed',
    'What is the URL for the SIP call updated webhook?',
    chalk.dim(
      videoCapabilities?.webhooks?.sipCallCreated?.address ||
      'https://example.com/video/sip_call_updated',
    ),
  );

  await promptWebhookCapability(
    videoCapabilities,
    'streamCreated',
    'What is the URL for the SIP call destroyed webhook?',
    chalk.dim(
      videoCapabilities?.webhooks?.sipCallCreated?.address ||
      'https://example.com/video/spi_call_destroyed',
    ),
  );

  await promptWebhookCapability(
    videoCapabilities,
    'streamDestroyed',
    'What is the URL for the SPI call muted webhook?',
    chalk.dim(
      videoCapabilities?.webhooks?.sipCallCreated?.address ||
      'https://example.com/video/sip_call_muted',
    ),
  );
};

exports.promptVideoCapabilities = async () => {
  process.stderr.write(chalk.bold.underline('Configuring Video API'));
  process.stderr.write(EOL);

  const videoCapabilities = {};

  await promptWebhookCapability(
    videoCapabilities,
    'archiveStatus',
    'What is the URL for the archive status webhook?',
    chalk.dim('https://example.com/video/archive_status'),
  );

  await promptSession(videoCapabilities);

  await promptSIP(videoCapabilities);

  await promptWebhookCapability(
    videoCapabilities,
    'renderStatus',
    'What is the URL for the render status webhook?',
    chalk.dim(
      'https://example.com/video/render_status',
    ),
  );

  await promptWebhookCapability(
    videoCapabilities,
    'broadcastStatus',
    'What is the URL for the broadcast status webhook?',
    chalk.dim(
      'https://example.com/video/broadcast_status',
    ),
  );

  await promptWebhookCapability(
    videoCapabilities,
    'captionStatus',
    'What is the URL for the caption status webhook?',
    chalk.dim(
      'https://example.com/video/caption_status',
    ),
  );

  return videoCapabilities;
};
