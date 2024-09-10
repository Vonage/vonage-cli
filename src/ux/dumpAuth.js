const { Client } = require('@vonage/server-client');
const { dumpValue } = require('../ux/dump');
const { truncate } = require('../ux/truncate');
const { descriptionList } = require('../ux/descriptionList');

exports.dumpAuth = (config) => {
  const dumpConfig = Client.transformers.camelCaseObjectKeys(config);
  console.log(descriptionList({
    'API Key': dumpValue(dumpConfig.apiKey),
    'API Secret': dumpValue(dumpConfig.apiSecret),
    'Application ID': dumpValue(dumpConfig.appId),
    'Private Key': dumpValue(truncate(dumpConfig.privateKey, 27, '... truncated')),
  }));
};
