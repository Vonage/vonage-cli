import YAML from 'yaml';
import { displayNumbers } from '../../numbers/display.js';
import { Client } from '@vonage/server-client';
import { dumpCommand } from '../../ux/dump.js';
import { loadOwnedNumbersFromSDK, searchPatterns } from '../../numbers/loadOwnedNumbersFromSDK.js';
import { apiKey, apiSecret } from '../../credentialFlags.js';
import { yaml, json } from '../../commonFlags.js';
import { countryFlag, getCountryName } from '../../ux/locale.js';
import { coerceNumber } from '../../utils/coerceNumber.js';

const flags = {
  'country': {
    ...countryFlag,
    group: 'Numbers',
  },
  'pattern': {
    describe: `The number pattern you want to search for. Use in conjunction with ${dumpCommand('--search-pattern')}`,
    group: 'Numbers',
  },
  'search-pattern': {
    describe: 'The strategy you want to use for matching',
    choices: Object.keys(searchPatterns),
    default: 'contains',
    group: 'Numbers',
  },
  'limit': {
    describe: 'The maximum number of numbers to return',
    coerce: coerceNumber('limit', { min: 1 }),
    group: 'Numbers',
  },
  'api-key': apiKey,
  'api-secret': apiSecret,
  'yaml': yaml,
  'json': json,
};

export { flags };

export const command = 'list';

export const desc = 'List all numbers that you own';

export const builder = (yargs) => yargs
  .options(flags)
  .epilogue(`To list numbers that are linked to an application, use ${dumpCommand('vonage apps numbers list <id>')}.`);

export const handler = async (argv) => {
  const { SDK, country, limit, pattern, searchPattern } = argv;
  console.info('Listing owned numbers');

  const { totalNumbers, numbers } = await loadOwnedNumbersFromSDK(
    SDK,
    {
      msisdn: pattern,
      searchPattern: searchPattern,
      country: country,
      limit: limit,
      size: 100,
      all: true,
    },
  );

  if (argv.yaml) {
    console.log(YAML.stringify(
      (numbers).map(
        (number) => Client.transformers.snakeCaseObjectKeys(number, true, false),
      ),
      null,
      2,
    ));
    return;
  }

  if (argv.json) {
    console.log(JSON.stringify(
      (numbers).map(
        (number) => Client.transformers.snakeCaseObjectKeys(number, true, false),
      ),
      null,
      2,
    ));
    return;
  }

  console.log('');

  const qualifiers = [
    ...(country && [` in ${getCountryName(country)}`]) || [],
    ...((pattern && searchPattern === 'contains' ) && [` containing ${pattern}`]) || [],
    ...((pattern && searchPattern === 'ends' ) && [` ending with ${pattern}`]) || [],
    ...((pattern && searchPattern === 'starts' ) && [` starting with ${pattern}`]) || [],
  ];

  if (totalNumbers === 0) {
    console.log([
      'You do not have any numbers',
      ...qualifiers,
    ].join(''));
    console.log('');
    console.log(`Use ${dumpCommand('vonage numbers search')} and ${dumpCommand('vonage numbers buy')} to find a number to purchase.`);
    return;
  }

  console.log(
    [
      totalNumbers > 1
        ? `There are ${totalNumbers} numbers`
        : 'There is 1 number',
      ...qualifiers,
    ].join(''),
  );

  console.log('');

  displayNumbers(numbers, ['country', 'type', 'feature', 'app_id']);
};

