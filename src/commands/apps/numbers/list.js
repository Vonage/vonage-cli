import yargs from 'yargs';
import YAML from 'yaml';
import { displayNumbers } from '../../../numbers/display.js';
import { Client } from '@vonage/server-client';
import { dumpCommand } from '../../../ux/dump.js';
import { loadOwnedNumbersFromSDK } from '../../../numbers/loadOwnedNumbersFromSDK.js';
import { getAppCapabilities } from '../../../apps/capabilities.js';
import { makeSDKCall } from '../../../utils/makeSDKCall.js';
import { apiKey, apiSecret } from '../../../credentialFlags.js';
import { yaml, json } from '../../../commonFlags.js';

export const command = 'list <id>';

export const desc = 'Show all numbers linked to an application';

export const builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'Application ID',
    },
  )
  .options({
    'api-key': apiKey,
    'api-secret': apiSecret,
    'yaml': yaml,
    'json': json,
    'fail': {
      describe: 'Fail when there are numbers linked to the application but the application does not have messages or voice capabilities',
      type: 'boolean',
    },
  })
  .epilogue(['The --fail flag will cause the command to exit with 15 code if the application does not have the voice or messages capability enabled.'].join('\n'));

export const handler = async (argv) => {
  const { id, SDK, fail } = argv;
  console.info(`Listing numbers linked to application ${id}`);

  const application = await makeSDKCall(
    SDK.applications.getApplication.bind(SDK.applications),
    'Fetching Application',
    id,
  );
  const { totalNumbers, numbers } = await loadOwnedNumbersFromSDK(
    SDK,
    {
      appId: id,
      message: `Fetching numbers linked to application ${application?.name}`,
      size: 100,
      all: true,
    },
  ) || {};

  console.debug('Numbers:', numbers);

  if (argv.yaml) {
    console.log(YAML.stringify(
      (numbers || []).map(
        (number) => Client.transformers.snakeCaseObjectKeys(number, true, false),
      ),
      null,
      2,
    ));
    return;
  }

  if (argv.json) {
    console.log(JSON.stringify(
      (numbers || []).map(
        (number) => Client.transformers.snakeCaseObjectKeys(number, true, false),
      ),
      null,
      2,
    ));
    return;
  }

  console.log('');

  if (totalNumbers === 0) {
    console.log('No numbers linked to this application.');
    console.log('');
    console.log(`Use ${dumpCommand('vonage apps link')} to link a number to this application.`);
    return;
  }

  const appCapabilities = getAppCapabilities(application);
  const hasCorrectCapabilities = appCapabilities.includes('messages') || appCapabilities.includes('voice');

  if (numbers.length > 0 && !hasCorrectCapabilities && !fail) {
    console.warn(
      'This application does not have the voice or messages capability enabled',
    );
  }

  console.log(totalNumbers > 1
    ? `There are ${totalNumbers} numbers linked:`
    : 'There is 1 number linked:',
  );
  console.log('');

  displayNumbers(numbers, ['type', 'feature', 'country']);

  if (numbers.length > 0 && !hasCorrectCapabilities && fail) {
    console.error(
      'This application does not have the voice or messages capability enabled',
    );

    yargs.exit(1);
    return;
  }
};

