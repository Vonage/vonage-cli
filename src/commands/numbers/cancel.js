import { loadOwnedNumbersFromSDK } from '../../numbers/loadOwnedNumbersFromSDK.js';
import yargs from 'yargs';
import { makeSDKCall } from '../../utils/makeSDKCall.js';
import { confirm } from '../../ux/confirm.js';
import { dumpCommand } from '../../ux/dump.js';
import { apiKey, apiSecret } from '../../credentialFlags.js';
import { force } from '../../commonFlags.js';
import { countryFlag } from '../../ux/locale.js';

const y = yargs();

const flags = {
  'api-key': apiKey,
  'api-secret': apiSecret,
  'force': force,
};

export { flags };

export const command = 'cancel <country> <msisdn>';

export const desc = 'Cancel a number';

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
  .options(flags);


export const handler = async (argv) => {
  const { SDK, country, msisdn } = argv;
  console.info('Cancelling number');

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
    y.exit(44);
    return;
  }

  const okToCancel = await confirm(`Are you sure you want to cancel ${numberToCancel.msisdn}?`);

  if (!okToCancel) {
    console.log('Number not cancelled');
    return;
  }

  await makeSDKCall(
    SDK.numbers.cancelNumber.bind(SDK.numbers),
    'Cancelling number',
    {
      country: country,
      msisdn: numberToCancel.msisdn,
    });
  console.info(`Number ${numberToCancel.msisdn} has been cancelled`);

  console.log('');
  console.log('Number cancelled');
};
