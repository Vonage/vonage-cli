const { loadOwnedNumbersFromSDK } = require('../../numbers/loadOwnedNumbersFromSDK');
const { writeNumberToSDK } = require('../../numbers/writeNumberToSDK');
const { descriptionList } = require('../../ux/descriptionList');
const { displayFullNumber } = require('../../numbers/display');
const yargs = require('yargs');
const { coerceUrl } = require('../../utils/coerceUrl');
const { dumpCommand } = require('../../ux/dump');
const { apiKey, apiSecret } = require('../../credentialFlags');
const { force } = require('../../commonFlags');
const { countryFlag } = require('../../utils/countries');

const flags = {
  'voice-callback-value': {
    describe: 'A SIP URI or telephone number',
    group: 'Voice callback',
  },
  'voice-status-callback': {
    describe: 'A webhook URI for Vonage to send a request to when a call ends',
    coerce: coerceUrl('voice-status-callback'),
    group: 'Voice callback',
  },
  'voice-callback-type': {
    describe: 'A value to send in the callback request',
    choices: ['app', 'sip', 'tel'],
    group: 'Voice callback',
  },
  'api-key': apiKey,
  'api-secret': apiSecret,
  'force': force,
};

exports.flags = flags;

exports.command = 'update <country> <msisdn>';

exports.desc = 'Update a number';

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
  .epilogue('It is better to use application webhooks as they offer more flexibility and control over the number\'s behavior.');

exports.handler = async (argv) => {
  const { SDK, country, msisdn } = argv;
  console.info('Listing owned numbers');

  const { numbers } = await loadOwnedNumbersFromSDK(
    SDK,
    {
      message: 'Searching for number to update',
      msisdn: msisdn,
      searchPattern: 'contains',
      country: country,
      limit: 1,
      size: 1,
    },
  );

  const numberToUpdate = numbers[0];
  console.debug('Number to update:', numberToUpdate);
  console.log('');

  if (!numberToUpdate) {
    console.error('Number not found. Are you sure you own this number?');
    console.log(`You can run ${dumpCommand('vonage numbers list')} to see your owned numbers`);
    yargs.exit(44);
    return;
  }

  numberToUpdate.voiceCallbackType = argv.voiceCallbackType;
  numberToUpdate.voiceCallbackValue = argv.voiceCallbackValue;
  numberToUpdate.voiceStatusCallback = argv.voiceStatusCallback;

  if (!await writeNumberToSDK(SDK, numberToUpdate)) {
    return;
  }

  console.log('');
  console.log('Number updated successfully');
  console.log('');
  console.log(descriptionList(displayFullNumber(numberToUpdate)));
};
