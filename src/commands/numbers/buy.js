import YAML from 'yaml';
import yargs from 'yargs';
import { confirm } from '../../ux/confirm.js';
import { descriptionList } from '../../ux/descriptionList.js';
import { countryFlag, displayCurrency } from '../../ux/locale.js';
import { displayFullNumber } from '../../numbers/display.js';
import { Client } from '@vonage/server-client';
import { dumpCommand } from '../../ux/dump.js';
import { makeSDKCall } from '../../utils/makeSDKCall.js';
import { apiKey, apiSecret } from '../../credentialFlags.js';
import { yaml, json, force } from '../../commonFlags.js';

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

export { flags };

export const command = 'buy <country> <msisdn>';

export const desc = 'Purchase a number';

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
  .epilogue(`To search for a number to purchase, use ${dumpCommand('vonage apps search')}.`);


export const handler = async (argv) => {
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
