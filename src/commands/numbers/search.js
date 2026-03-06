import YAML from 'yaml';
import { displayNumbers } from '../../numbers/display.js';
import { Client } from '@vonage/server-client';
import { dumpCommand } from '../../ux/dump.js';
import { searchPatterns } from '../../numbers/loadOwnedNumbersFromSDK.js';
import { makeSDKCall } from '../../utils/makeSDKCall.js';
import { apiKey, apiSecret } from '../../credentialFlags.js';
import { yaml, json } from '../../commonFlags.js';
import { countryFlag, getCountryName } from '../../ux/locale.js';
import { coerceNumber } from '../../utils/coerceNumber.js';
import { featureFlag } from '../../numbers/features.js';
import { typeFlag, typeLabels } from '../../numbers/types.js';

export const command = 'search <country>';

export const desc = 'Search for numbers for purchase';

export const builder = (yargs) => yargs
  .positional(
    'country',
    countryFlag,
  )
  .options({
    'pattern': {
      describe: `The number pattern you want to search for. Use in conjunction with ${dumpCommand('--search-pattern')}`,
      group: 'Numbers',
    },
    'features': {
      ...featureFlag,
      group: 'Numbers',
    },
    'search-pattern': {
      describe: 'The strategy you want to use for matching',
      choices: Object.keys(searchPatterns),
      default: 'contains',
      group: 'Numbers',
    },
    'page': {
      describe: 'The page of results to return',
      default: 1,
      coerce: coerceNumber('page', { min: 1 }),
      group: 'Numbers',
    },
    'type': {
      ...typeFlag,
      group: 'Numbers',
    },
    'limit': {
      describe: 'How many to search for',
      default: 10,
      coerce: coerceNumber('limit', { min: 1, max: 100}),
      group: 'Numbers',
    },
    'api-key': apiKey,
    'api-secret': apiSecret,
    'yaml': yaml,
    'json': json,
  });

export const handler = async (argv) => {
  const { SDK, page, features, country, limit, type, pattern, searchPattern } = argv;
  console.info('Search for numbers');
  console.debug(features);

  const { count, numbers } = await makeSDKCall(
    SDK.numbers.getAvailableNumbers.bind(SDK.numbers),
    'Searching for numbers',
    {
      type: type,
      pattern: pattern,
      searchPattern: searchPatterns[searchPattern],
      country: country,
      features: features?.join(','),
      size: limit,
      index: page,
    },
  );

  const totalNumbers = count || 0;

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

  const typeQualifier = type ? `${typeLabels[type]} ` : '';

  const qualifiers = [
    ` available for purchase in ${getCountryName(country)}`,
    ...((pattern && searchPattern === 'contains' ) && [` containing ${pattern}`]) || [],
    ...((pattern && searchPattern === 'ends' ) && [` ending with ${pattern}`]) || [],
    ...((pattern && searchPattern === 'starts' ) && [` starting with ${pattern}`]) || [],
    ...((features && features.length > 0) && [` having the ${features.join(', ')} ${features.length > 1 ? 'features' : 'feature'}`]) || [],
  ];

  if (totalNumbers === 0) {
    console.log([
      `There are no matching ${typeQualifier}numbers`,
      ...qualifiers,
    ].join(''));
    console.log('Try to broaden your search criteria');
    console.log('');
    return;
  }

  console.log(
    [
      totalNumbers > 1
        ? `There are ${totalNumbers} ${typeQualifier}numbers`
        : `There is 1 ${typeQualifier}number`,
      ...qualifiers,
    ].join(''),
  );

  console.log('');
  const fieldsToShow = [
    ...(type === undefined ? ['type'] : []),
    'feature',
    'monthly_cost',
    'setup_cost',
  ];

  displayNumbers(numbers, fieldsToShow);
  console.log(`Use ${dumpCommand('vonage numbers buy')} to purchase.`);
};

