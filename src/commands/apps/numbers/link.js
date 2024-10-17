const { loadOwnedNumbersFromSDK } = require('../../../numbers/loadOwnedNumbersFromSDK');
const { loadAppFromSDK } = require('../../../apps/loadAppFromSDK');
const { confirm } = require('../../../ux/confirm');
const { writeNumberToSDK } = require('../../../numbers/writeNumberToSDK');
const { displayExtendedNumber } = require('../../../numbers/display');
const { descriptionList } = require('../../../ux/descriptionList');

exports.command = 'link <id> <msisdn>';

exports.desc = 'Link a number to an application';

exports.builder = (yargs) => yargs.options({
  'yaml': {
    describe: 'Output as YAML',
    type: 'boolean',
    conflicts: 'json',
  },
  'json': {
    describe: 'Output as JSON',
    conflicts: 'yaml',
    type: 'boolean',
  },
  // Flags from higher level that do not apply to this command
  'app-id': {
    hidden: true,
  },
  'private-key': {
    hidden: true,
  },
  'app-name': {
    hidden: true,
  },
  'capability': {
    hidden: true,
  },
})
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
  );

exports.handler = async (argv) => {
  const { id, SDK, msisdn } = argv;
  console.info(`Linking number ${msisdn} to application ${id}`);

  const application = await loadAppFromSDK(SDK, id);
  if (!application) {
    return;
  }

  const { numbers } = await loadOwnedNumbersFromSDK(
    SDK,
    {
      msisdn: msisdn,
    },
  );

  // Error condition
  if (numbers === false) {
    return;
  }

  if (!numbers) {
    console.error('No numbers found');
    return;
  }

  const number = numbers[0];
  console.debug('Current number properties:', number);

  let userConfirmedUpdate = true;

  if (number.appId && number.appId !== id) {
    console.log('');
    userConfirmedUpdate = await confirm(`Number is already linked to application ${number.appId}. Do you want to continue?`);
  }

  console.log('');

  if (!userConfirmedUpdate) {
    console.log('Aborted');
    return;
  }

  if (number.appId === id) {
    console.log('Number is already linked to this application');
    console.log('');
    console.log(descriptionList(displayExtendedNumber(number)));
    return;
  }

  console.info('Linking number to application');

  number.appId = id;
  const ok = await writeNumberToSDK(SDK, number);

  console.log('');
  if (ok !== false) {
    console.log('Number linked');
    console.log(descriptionList(displayExtendedNumber(number)));
    return;
  }
};
