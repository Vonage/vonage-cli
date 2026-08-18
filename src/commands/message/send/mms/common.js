import { apiKey, apiSecret, appId, privateKey } from '../../../../credentialFlags.js';
import { coerceUrl } from '../../../../utils/coerceUrl.js';
import { from, to, clientRef, webhookUrl, webhookVersion, ttl } from '../../../../messageFlags.js';

export const mmsCommonOptions = {
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

export const mediaUrlOption = {
  describe: 'The publicly accessible media URL',
  type: 'string',
  group: 'MMS Message',
  coerce: coerceUrl('url'),
};

export const captionOption = {
  describe: 'Additional text to accompany the file',
  type: 'string',
  group: 'MMS Message',
};

