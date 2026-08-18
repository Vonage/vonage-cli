import { apiKey, apiSecret, appId, privateKey } from '../../../../credentialFlags.js';
import { coerceUrl } from '../../../../utils/coerceUrl.js';
import { from, to, clientRef, webhookUrl, webhookVersion, ttl } from '../../../../messageFlags.js';

export const whatsappCommonOptions = {
  'context-message-uuid': {
    describe: 'The WhatsApp message UUID to quote, reply to, or react to',
    type: 'string',
    group: 'WhatsApp Message',
  },
  'category': {
    describe: 'Optional WhatsApp message category',
    type: 'string',
    group: 'WhatsApp Message',
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

export const whatsappMediaUrlOption = {
  describe: 'The publicly accessible media URL',
  type: 'string',
  group: 'WhatsApp Message',
  coerce: coerceUrl('url'),
};

export const buildWhatsAppMessage = (argv) => ({
  to: argv.to,
  from: argv.from,
  clientRef: argv.clientRef,
  webhookUrl: argv.webhookUrl,
  webhookVersion: argv.webhookVersion,
  ...(argv.contextMessageUuid
    ? {
      context: {
        messageUUID: argv.contextMessageUuid,
      },
    }
    : {}),
  ...(argv.category ? { category: argv.category } : {}),
});

