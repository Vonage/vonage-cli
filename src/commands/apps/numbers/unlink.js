const { loadOwnedNumbersFromSDK } = require('../../../numbers/loadOwnedNumbersFromSDK');
const { loadAppFromSDK } = require('../../../apps/loadAppFromSDK');
const { confirm } = require('../../../ux/confirm');
const { writeNumberToSDK } = require('../../../numbers/writeNumberToSDK');
const { displayExtendedNumber } = require('../../../numbers/display');
const { descriptionList } = require('../../../ux/descriptionList');

exports.command = 'unlink <id> <msisdn>';

exports.desc = 'Unlink a number to an application';

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
      describe: 'The number to unlink to the application',
    },
  );

exports.handler = async (argv) => {
  const { id, SDK, msisdn } = argv;
  console.info(`Unlinking number ${msisdn} to application ${id}`);

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
    console.error('Number not found');
    return;
  }

  const number = numbers[0];
  console.debug('Current number properties:', number);

  if (!number.appId) {
    console.log('Number is not linked to an application');
    return;
  }

  if (number.appId !== id) {
    console.error('Number is not linked to this application');
    return;
  }

  const userConfirmedUnlink= await confirm(`Are you sure you want to unlink ${msisdn} from ${application.name}`);
  console.log('');

  if (!userConfirmedUnlink) {
    console.log('Aborted');
    return;
  }

  console.info('Unlinking number to application');

  number.appId = null;

  // eslint-disable-next-line no-unused-vars
  const { appId, ...numberWithoutAppId } = number;

  const ok = await writeNumberToSDK(
    SDK,
    numberWithoutAppId,
  );

  console.log('');

  if (ok !== false) {
    console.log('Number unlinked');
    console.log(descriptionList(displayExtendedNumber(number)));
    return;
  }
};
