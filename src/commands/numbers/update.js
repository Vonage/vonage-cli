import { loadOwnedNumbersFromSDK } from '../../numbers/loadOwnedNumbersFromSDK.js';
import { descriptionList } from '../../ux/descriptionList.js';
import { makeSDKCall } from '../../utils/makeSDKCall.js';
import { displayFullNumber } from '../../numbers/display.js';
import yargs from 'yargs';
import { coerceUrl } from '../../utils/coerceUrl.js';
import { dumpCommand } from '../../ux/dump.js';
import { apiKey, apiSecret } from '../../credentialFlags.js';
import { force } from '../../commonFlags.js';
import { countryFlag } from '../../ux/locale.js';

const y = yargs();

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

export { flags };

export const command = 'update <country> <msisdn>';

export const desc = 'Update a number';

export const builder = (yargs) => yargs
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

export const handler = async (argv) => {
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
    y.exit(44);
    return;
  }

  numberToUpdate.voiceCallbackType = argv.voiceCallbackType;
  numberToUpdate.voiceCallbackValue = argv.voiceCallbackValue;
  numberToUpdate.voiceStatusCallback = argv.voiceStatusCallback;

  await makeSDKCall(
    SDK.numbers.updateNumber.bind(SDK.numbers),
    'Updating number',
    numberToUpdate,
  );

  console.log('');
  console.log('Number updated successfully');
  console.log('');
  console.log(descriptionList(displayFullNumber(numberToUpdate)));
};
