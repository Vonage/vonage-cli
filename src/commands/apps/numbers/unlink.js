const YAML = require('yaml');
const { loadOwnedNumbersFromSDK } = require('../../../numbers/loadOwnedNumbersFromSDK');
const { loadAppFromSDK } = require('../../../apps/loadAppFromSDK');
const { confirm } = require('../../../ux/confirm');
const { writeNumberToSDK } = require('../../../numbers/writeNumberToSDK');
const { displayFullNumber } = require('../../../numbers/display');
const { descriptionList } = require('../../../ux/descriptionList');
const { apiKey, apiSecret } = require('../../../credentialFlags');
const { json, yaml } = require('../../../commonFlags');
const { dumpCommand } = require('../../../ux/dump');

exports.command = 'unlink <id> <msisdn>';

exports.desc = 'Unlink a number to an application';

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
      describe: 'The number to unlink to the application',
    },
  )
  .options({
    'api-key': apiKey,
    'api-secret': apiSecret,
    'yaml': yaml,
    'json': json,
  })
  .example(
    dumpCommand('vonage apps unlink 000[...]000 19162255887'),
    'Unlink number 19162255887 to application 000[...]000',
  );

exports.handler = async (argv) => {
  const { id, SDK, msisdn } = argv;
  console.info(`Unlinking number ${msisdn} to application ${id}`);

  const application = await loadAppFromSDK(SDK, id);
  if (!application) {
    return;
  }

  const  numbers  = await loadOwnedNumbersFromSDK(
    SDK,
    {
      msisdn: msisdn,
    },
  );

  const number = numbers.numbers[0];
  if (!number) {
    console.error('Number not found');
    return;
  }

  console.debug('Current number properties:', number);

  if (!number.appId) {
    console.log('Number is not linked to an application');
    return;
  }

  if (number.appId !== id) {
    console.error('Number is not linked to this application');
    return;
  }

  const userConfirmedUnlink= await confirm(`Are you sure you want to unlink ${msisdn} from ${application.name}?`);
  console.log('');

  if (!userConfirmedUnlink) {
    console.log('Aborted');
    return;
  }

  console.info('Unlinking number to application');

  number.appId = null;

  // eslint-disable-next-line no-unused-vars
  const { appId, ...numberWithoutAppId } = number;

  await writeNumberToSDK(
    SDK,
    numberWithoutAppId,
  );

  console.log('');

  if (argv.json) {
    console.log(JSON.stringify(numberWithoutAppId, null, 2));
    return;
  }

  if (argv.yaml) {
    console.log(YAML.stringify(numberWithoutAppId, null, 2));
    return;
  }

  console.log('Number unlinked');
  console.log(descriptionList(displayFullNumber(numberWithoutAppId)));
};
