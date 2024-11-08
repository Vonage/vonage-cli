const { loadOwnedNumbersFromSDK } = require('../../numbers/loadOwnedNumbersFromSDK');
const yargs = require('yargs');
const { spinner } = require('../../ux/spinner');
const { sdkError } = require('../../utils/sdkError');
const { confirm } = require('../../ux/confirm');
const { dumpCommand } = require('../../ux/dump');
const { apiKey, apiSecret } = require('../../credentialFlags');
const { force } = require('../../commonFlags');
const { countryFlag } = require('../../utils/countries');

const flags = {
  'api-key': apiKey,
  'api-secret': apiSecret,
  'force': force,
};

exports.flags = flags;

exports.command = 'cancel <country> <msisdn>';

exports.desc = 'Cancel a number';

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
  .options(flags);


exports.handler = async (argv) => {
  const { SDK, country, msisdn } = argv;
  console.info('Listing owned numbers');

  const { numbers } = await loadOwnedNumbersFromSDK(
    SDK,
    {
      message: 'Searching for number to cancel',
      msisdn: msisdn,
      searchPattern: 'contains',
      country: country,
      limit: 1,
      size: 1,
    },
  );

  const numberToCancel = numbers[0];
  console.debug('Number to cancel:', numberToCancel);
  console.log('');

  if (!numberToCancel) {
    console.error('Number not found. Are you sure you own this number?');
    console.log(`You can run ${dumpCommand('vonage numbers list')} to see your owned numbers`);
    yargs.exit(44);
    return;
  }

  const okToCancel = await confirm(`Are you sure you want to cancel ${numberToCancel.msisdn}?`);

  if (!okToCancel) {
    console.log('Number not cancelled');
    return;
  }

  const { stop, fail } = spinner({message: 'Cancelling number'});
  try {
    await SDK.numbers.cancelNumber({
      country: country,
      msisdn: numberToCancel.msisdn,
    });
    console.info(`Number ${numberToCancel.msisdn} has been cancelled`);
    stop();
  } catch (error) {
    fail();
    sdkError(error);
    return;
  }

  console.log('');
  console.log('Number cancelled');
};
