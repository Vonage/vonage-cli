const { Client } = require('@vonage/server-client');
const { dumpValue } = require('../ux/dump');
const { descriptionList } = require('../ux/descriptionList');
const { redact } = require('../ux/redact');

exports.dumpAuth = (config, noRedact=false) => {
  const dumpConfig = Client.transformers.camelCaseObjectKeys(config);
  let privateKey = dumpConfig.privateKey ? 'Is Set' : null;

  console.debug('privateKey', privateKey);

  switch(true) {
  case noRedact === true:
    privateKey = dumpConfig.privateKey;
    break;

  case privateKey === null:
    privateKey = null;
    break;

  default:
    privateKey = dumpConfig.privateKey.startsWith('-----BEGIN PRIVATE KEY-----')
      ? 'Is Set'
      : 'INVALID KEY';
    break;
  }

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
