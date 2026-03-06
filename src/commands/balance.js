import YAML from 'yaml';
import { apiKey, apiSecret } from '../credentialFlags.js';
import { json, yaml } from '../commonFlags.js';
import { makeSDKCall } from '../utils/makeSDKCall.js';
import { dumpCommand } from '../ux/dump.js';
import { dumpYesNo } from '../ux/dumpYesNo.js';
import { displayCurrency } from '../ux/locale.js';
import { descriptionList } from '../ux/descriptionList.js';
import { Client } from '@vonage/server-client';

export const command = 'balance';

export const desc = 'Check your account balance';

export const builder = (yargs) => yargs
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

export const handler = async (argv) => {
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
