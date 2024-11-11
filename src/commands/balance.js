const YAML = require('yaml');
const { apiKey, apiSecret } = require('../credentialFlags');
const { sdkError } = require('../utils/sdkError');
const { json, yaml } = require('../commonFlags');
const { spinner } = require('../ux/spinner'); 
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
  const { stop, fail } = spinner({
    message: 'Checking account balance',
  });

  try {
  // Get the account balance
    const balance = await SDK.accounts.getBalance();
    stop();

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

  } catch (error) {
    fail(error);
    sdkError(error);
  }
};
