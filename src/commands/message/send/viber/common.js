import { apiKey, apiSecret, appId, privateKey } from '../../../../credentialFlags.js';
import { from, to, clientRef, webhookUrl, webhookVersion, ttl } from '../../../../messageFlags.js';
import { coerceUrl } from '../../../../utils/coerceUrl.js';

export const viberCommonOptions = {
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

/* node:coverage disable */
export const viberServiceOptions = {
  'viber-type': {
    describe: 'The Viber message type',
    type: 'string',
    group: 'Viber Message',
  },
  'category': {
    describe: 'The Viber message category',
    choices: ['transaction', 'promotion'],
    type: 'string',
    group: 'Viber Message',
  },
  'action-url': {
    describe: 'The URL to open when the Viber action is triggered',
    type: 'string',
    group: 'Viber Message',
    coerce: coerceUrl('action-url'),
  },
  'action-text': {
    describe: 'The text displayed for the Viber action',
    type: 'string',
    group: 'Viber Message',
  },
};
/* node:coverage enable */

export const viberMediaUrlOption = {
  describe: 'The publicly accessible media URL',
  type: 'string',
  group: 'Viber Message',
  coerce: coerceUrl('url'),
};

export const buildViberMessage = (argv) => ({
  to: argv.to,
  from: argv.from,
  clientRef: argv.clientRef,
  webhookUrl: argv.webhookUrl,
  webhookVersion: argv.webhookVersion,
});

export const buildViberService = (argv, extras = {}) => ({
  ttl: argv.ttl,
  type: argv.viberType,
  category: argv.category,
  action: {
    url: argv.actionUrl,
    text: argv.actionText,
  },
  ...extras,
});

