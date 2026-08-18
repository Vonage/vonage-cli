import { SMS } from '@vonage/messages';
import { apiKey, apiSecret, appId, privateKey } from '../../../credentialFlags.js';
import { dumpCommand } from '../../../ux/dump.js';
import { from, to, clientRef, webhookUrl, webhookVersion, ttl, sendMessage } from '../../../messageFlags.js';

export const command = 'sms';

export const desc = 'Send an SMS message';

/* node:coverage disable */
export const builder = (yargs) => yargs
  .options({
    'text': {
      describe: 'The message text',
      type: 'string',
      group: 'SMS Message',
    },
    'trusted-recipient': {
      describe: 'Override Fraud Defender protections for this message',
      type: 'boolean',
      group: 'SMS Message',
    },
    'encoding-type': {
      describe: 'Encoding to use for the SMS text',
      choices: ['auto', 'text', 'unicode'],
      type: 'string',
      group: 'SMS Message',
    },
    'content-id': {
      describe: 'Regulatory content ID for supported countries',
      type: 'string',
      group: 'SMS Message',
    },
    'entity-id': {
      describe: 'Regulatory entity ID for supported countries',
      type: 'string',
      group: 'SMS Message',
    },
    'from': from,
    'to': to,
    'client-ref': clientRef,
    'webhook-url': webhookUrl,
    'webhook-version': webhookVersion,
    'ttl': ttl,
    'api-key': apiKey,
    'api-secret': apiSecret,
    'app-id': appId,
    'private-key': privateKey,
  })
  .demandOption(['to', 'from', 'text'])
  .example(
    dumpCommand('vonage message send sms --to <number> --from <number> --text <text>'),
    'Send an SMS message',
  )
  .example(
    dumpCommand('vonage message send sms --to <number> --from <number> --text <text> --client-ref <ref>'),
    'Send an SMS message with a client reference',
  );
/* node:coverage enable */

export const handler = async (argv) => {
  const { SDK } = argv;
  console.info(`Sending SMS message to ${argv.to}`);

  const message = new SMS({
    to: argv.to,
    from: argv.from,
    text: argv.text,
    clientRef: argv.clientRef,
    webhookUrl: argv.webhookUrl,
    webhookVersion: argv.webhookVersion,
    ttl: argv.ttl,
    trustedRecipient: argv.trustedRecipient,
    ...(argv.encodingType || argv.contentId || argv.entityId
      ? {
        sms: {
          encodingType: argv.encodingType,
          contentId: argv.contentId,
          entityId: argv.entityId,
        },
      }
      : {}),
  });

  await sendMessage(
    SDK,
    message,
  );
};
