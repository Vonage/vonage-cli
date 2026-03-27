import { Client } from '@vonage/server-client';
import { dumpValue } from './dump.js';
import { descriptionList } from './descriptionList.js';
import { redact } from './redact.js';

const getPrivateKeyDisplay = (key, noRedact) => {
  if (!key) return null;
  if (noRedact) return key;
  return key.startsWith('-----BEGIN PRIVATE KEY-----') ? 'Is Set' : 'INVALID KEY';
};

/**
  * Prints out the auth information
  *
  * @param { Object } config - The auth config
  * @param { boolean } noRedact - Set to true to show the API secret
  */
export const dumpAuth = (config, noRedact=false) => {
  const dumpConfig = Client.transformers.camelCaseObjectKeys(config);
  const privateKey = getPrivateKeyDisplay(dumpConfig.privateKey, noRedact);

  console.debug('privateKey', privateKey);

  const output = {};

  if (dumpConfig.apiKey) {
    output['API Key'] = dumpValue(dumpConfig.apiKey);
  }

  if (dumpConfig.apiSecret) {
    output['API Secret'] = dumpValue(noRedact
      ? dumpConfig.apiSecret
      : redact(dumpConfig.apiSecret),
    );
  }

  if (dumpConfig.appId) {
    output['App ID'] = dumpValue(dumpConfig.appId);
  }

  if (dumpConfig.privateKey) {
    output['Private Key'] = dumpValue(privateKey);
  }

  console.log(descriptionList(output));
};
