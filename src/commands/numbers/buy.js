const YAML = require('yaml');
const yargs = require('yargs');
const { confirm } = require('../../ux/confirm');
const { descriptionList } = require('../../ux/descriptionList');
const { displayCurrency } = require('../../ux/locale');
const { displayFullNumber } = require('../../numbers/display');
const { Client } = require('@vonage/server-client');
const { dumpCommand } = require('../../ux/dump');
const { makeSDKCall } = require('../../utils/makeSDKCall');
const { apiKey, apiSecret } = require('../../credentialFlags');
const { yaml, json, force } = require('../../commonFlags');
const { countryFlag } = require('../../utils/countries');

const flags = {
  'target-api-key': {
    describe: 'Purchase this number for a sub account',
    group: 'Numbers',
  },
  'api-key': apiKey,
  'api-secret': apiSecret,
  'force': force,
  'yaml': yaml,
  'json': json,
};

exports.flags = flags;

exports.command = 'buy <country> <msisdn>';

exports.desc = 'Purchase a number';

exports.builder = (yargs) => yargs
  .positional(
    'country',
    {
      ...countryFlag,
      group: 'Numbers',
    },
  )
  .positional(
    'msisdn',
    {
      describe: 'The number you want to purchase',
      type: 'string',
      group: 'Numbers',
    },
  )
  .options(flags)
  .epilogue(`To search for a number to purchase, use ${dumpCommand('vonage apps search')}.`);


exports.handler = async (argv) => {
  const { SDK, country, msisdn} = argv;
  console.info('Purchase a number');

  const { numbers } = await makeSDKCall(
    SDK.numbers.getAvailableNumbers.bind(SDK.numbers),
    'Searching for numbers',
    {
      pattern: msisdn,
      searchPattern: 1,
      country: country,
      size: 1,
    },
  );

  const numberToPurchase = numbers ? numbers[0] : null;
  console.debug('Nubmer to purchase:', numberToPurchase);

  if (!numberToPurchase) {
    console.log(`The number ${msisdn} is no longer available for purchase`);
    yargs.exit(44);
    return;
  }

  const okToBuy = await confirm(`Are you sure you want to purchase the number ${numberToPurchase.msisdn} for ${displayCurrency(numberToPurchase.cost)}?`);

  if (!okToBuy) {
    console.log('Aborting purchase');
    return;
  }

  console.log('');

  await makeSDKCall(
    SDK.numbers.buyNumber.bind(SDK.numbers),
    'Purchasing number',
    {
      country: country,
      msisdn: msisdn,
    },
  );

  if (argv.yaml) {
    console.log(YAML.stringify(
      Client.transformers.snakeCaseObjectKeys(numberToPurchase, true, false),
      null,
      2,
    ));
    return;
  }

  if (argv.json) {
    console.log(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(numberToPurchase, true, false),
      null,
      2,
    ));
    return;
  }

  console.log(`Number ${numberToPurchase.msisdn} purchased`);
  console.log('');
  console.log(descriptionList(displayFullNumber(numberToPurchase)));
};
