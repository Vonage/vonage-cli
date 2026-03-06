import { coerceKey } from './utils/coerceKey.js';

export const apiKey = {
  describe: 'Your Vonage API key',
  type: 'string',
  group: 'Vonage Credentials:',
  implies: 'api-secret',
};

export const apiSecret = {
  describe: 'Your Vonage API secret',
  type: 'string',
  implies: 'api-key',
  group: 'Vonage Credentials:',
};

export const privateKey = {
  describe: 'Your Vonage private key',
  type: 'string',
  group: 'Vonage Credentials:',
  implies: 'app-id',
  coerce: coerceKey('private'),
};

export const appId = {
  describe: 'Your Vonage application ID',
  group: 'Vonage Credentials:',
  type: 'string',
  implies: 'private-key',
};

