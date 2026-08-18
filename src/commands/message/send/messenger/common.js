import { apiKey, apiSecret, appId, privateKey } from '../../../../credentialFlags.js';
import { coerceUrl } from '../../../../utils/coerceUrl.js';
import { from, to, clientRef, webhookUrl, webhookVersion, ttl } from '../../../../messageFlags.js';

export const messengerCommonOptions = {
  'category': {
    describe: 'The Messenger message category',
    type: 'string',
    group: 'Messenger Message',
  },
  'tag': {
    describe: 'Optional message tag (required for some categories)',
    type: 'string',
    group: 'Messenger Message',
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
};

export const messengerMediaUrlOption = {
  describe: 'The publicly accessible media URL',
  type: 'string',
  group: 'Messenger Message',
  coerce: coerceUrl('url'),
};

export const buildMessengerMessage = (argv) => ({
  to: argv.to,
  from: argv.from,
  messenger: {
    category: argv.category,
    ...(argv.tag ? { tag: argv.tag } : {}),
  },
  clientRef: argv.clientRef,
  webhookUrl: argv.webhookUrl,
  webhookVersion: argv.webhookVersion,
});

