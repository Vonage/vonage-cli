const YAML = require('yaml');
const { displayExtendedNumbers } = require('../../numbers/display');
const { Client } = require('@vonage/server-client');
const { dumpCommand } = require('../../ux/dump');
const { loadOwnedNumbersFromSDK, searchPatterns } = require('../../numbers/loadOwnedNumbersFromSDK');
const { apiKey, apiSecret } = require('../../credentialFlags');
const { yaml, json } = require('../../commonFlags');
const { countries, getCountryName } = require('../../utils/countries');
const { coerceNumber } = require('../../utils/coerceNumber');

exports.command = 'list';

exports.desc = 'List all numbers that you own';

exports.builder = (yargs) => yargs
  .options({
    'country': {
      describe: 'Filter by country using the two character country code in ISO 3166-1 alpha-2 format',
      coerce: (arg) => {
        if (!Object.keys(countries).includes(arg.toUpperCase())) {
          throw new Error(`Invalid country code: ${arg}`);
        }

        return arg.toUpperCase();
      },
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
  })
  .epilogue(`To list numbers that are linked to an application, use ${dumpCommand('vonage apps numbers list <id>')}.`);

exports.handler = async (argv) => {
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

  displayExtendedNumbers(numbers);
};

