import { apiKey, apiSecret, appId, privateKey } from '../../../../credentialFlags.js';
import { coerceUrl } from '../../../../utils/coerceUrl.js';
import { from, to, clientRef, webhookUrl, webhookVersion, ttl } from '../../../../messageFlags.js';

export const rcsCommonOptions = {
  'from': from,
  'to': to,
  'client-ref': clientRef,
  'webhook-url': webhookUrl,
  'webhook-version': webhookVersion,
  'ttl': ttl,
  'rcs-category': {
    describe: 'Optional RCS message category',
    choices: ['authentication', 'transaction', 'promotion', 'service-request', 'acknowledgement'],
    type: 'string',
    group: 'RCS Message',
  },
  'api-key': apiKey,
  'api-secret': apiSecret,
  'app-id': appId,
  'private-key': privateKey,
};

export const rcsMediaUrlOption = {
  describe: 'The publicly accessible media URL',
  type: 'string',
  group: 'RCS Message',
  coerce: coerceUrl('url'),
};

export const buildRCSMessage = (argv) => ({
  to: argv.to,
  from: argv.from,
  clientRef: argv.clientRef,
  webhookUrl: argv.webhookUrl,
  webhookVersion: argv.webhookVersion,
  ttl: argv.ttl,
  ...(argv.rcsCategory
    ? {
      rcs: {
        category: argv.rcsCategory,
      },
    }
    : {}),
});

