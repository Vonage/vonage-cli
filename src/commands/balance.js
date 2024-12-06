const YAML = require('yaml');
const { apiKey, apiSecret } = require('../credentialFlags');
const { json, yaml } = require('../commonFlags');
const { makeSDKCall } = require('../utils/makeSDKCall');
const { dumpCommand } = require('../ux/dump');
const { dumpYesNo } = require('../ux/dumpYesNo');
const { displayCurrency } = require('../ux/currency');
const { descriptionList } = require('../ux/descriptionList');
const { Client } = require('@vonage/server-client');

exports.command = 'balance';

exports.desc = 'Check your account balance';

exports.builder = (yargs) => yargs
  .options({
    'api-key': apiKey,
    'api-secret': apiSecret,
    'yaml': yaml,
    'json': json,
  })
  .example(
    dumpCommand('vonage balance'),
    'Show your account balance',
  );

exports.handler = async (argv) => {
  const { SDK, yaml, json } = argv;
  console.info('Check your account balance');

  // Get the account balance
  const balance = await makeSDKCall(
    SDK.accounts.getBalance.bind(SDK.accounts),
    'Checking account balance',
  );

  if (yaml) {
    console.log(YAML.stringify(
      Client.transformers.snakeCaseObjectKeys(balance, true, false),
    ));
    return;
  }

  if (json) {
    console.log(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(balance, true, false),
      null,
      2,
    ));
    return;
  }

  console.log('');
  console.log(descriptionList({
    'Account balance': displayCurrency(balance.value, balance.currency),
    'Auto-refill enabled': dumpYesNo(balance.autoReload),
  }));

};
