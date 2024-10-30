const yargs = require('yargs');
const { loadOwnedNumbersFromSDK } = require('../../../numbers/loadOwnedNumbersFromSDK');
const { loadAppFromSDK } = require('../../../apps/loadAppFromSDK');
const { confirm } = require('../../../ux/confirm');
const { writeNumberToSDK } = require('../../../numbers/writeNumberToSDK');
const { displayExtendedNumber } = require('../../../numbers/display');
const { descriptionList } = require('../../../ux/descriptionList');
const YAML = require('yaml');
const { apiKey, apiSecret } = require('../../../credentialFlags');
const { json, yaml } = require('../../../commonFlags');
const { dumpCommand } = require('../../../ux/dump');

exports.command = 'link <id> <msisdn>';

exports.desc = 'Link a number to an application';

exports.builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'Application ID',
    },
  )
  .positional(
    'msisdn',
    {
      describe: 'The number to link to the application',
    },
  )
  .options({
    'api-key': apiKey,
    'api-secret': apiSecret,
    'yaml': yaml,
    'json': json,
  })
  .example(
    dumpCommand('vonage apps link 000[...]000 19162255887'),
    'Link number 19162255887 to application 000[...]000',
  );

exports.handler = async (argv) => {
  const { id, SDK, msisdn } = argv;
  console.info(`Linking number ${msisdn} to application ${id}`);

  const app = await loadAppFromSDK(SDK, id);

  const numbers = await loadOwnedNumbersFromSDK(
    SDK,
    {
      msisdn: msisdn,
    },
  );

  const number = numbers.numbers[0];

  if (!number) {
    console.error('Number not found');
    yargs.exit(20);
    return;
  }

  console.debug('Current number properties:', number);

  let userConfirmedUpdate = true;

  if (number.appId && number.appId !== app.id) {
    console.log('');
    userConfirmedUpdate = await confirm(`Number is already linked to application [${number.appId}]. Do you want to continue?`);
  }

  console.log('');

  if (!userConfirmedUpdate) {
    console.log('Aborted');
    return;
  }

  if (number.appId === app.id) {
    console.log('Number is already linked to this application');
    console.log('');
    console.log(descriptionList(displayExtendedNumber(number)));
    return;
  }

  console.info('Linking number to application');

  number.appId = id;
  await writeNumberToSDK(SDK, number);

  if (argv.json) {
    console.log(JSON.stringify(number, null, 2));
    return;
  }

  if (argv.yaml) {
    console.log(YAML.stringify(number, null, 2));
    return;
  }

  console.log('');
  console.log('Number linked');
  console.log(descriptionList(displayExtendedNumber(number)));
  return;
};
