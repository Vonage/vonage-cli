const yargs = require('yargs');
const yaml = require('yaml');
const { displayNumbers } = require('../../../numbers/display');
const { Client } = require('@vonage/server-client');
const { dumpCommand } = require('../../../ux/dump');
const { loadOwnedNumbersFromSDK } = require('../../../numbers/loadOwnedNumbersFromSDK');
const { loadAppFromSDK } = require('../../../apps/loadAppFromSDK');
const { getAppCapabilities } = require('../../../apps/display');

exports.command = 'list <id>';

exports.desc = 'Show all numbers linked to an application';

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
  'fail': {
    describe: 'Fail with there are numbers linked to the application but the application does not have messages or voice capabilities',
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
  );

exports.handler = async (argv) => {
  const { id, SDK, fail } = argv;
  console.info(`Fetching numbers linked to application ${id}`);

  const application = await loadAppFromSDK(SDK, id);
  if (!application) {
    return;
  }

  const { numbers } = await loadOwnedNumbersFromSDK(
    SDK,
    {
      appId: id,
      message: `Fetching numbers linked to application: ${application.name}`,
    },
  );

  if (numbers === false) {
    return;
  }

  console.debug('Numbers linked to application:', numbers);

  if (argv.yaml) {
    console.log(yaml.stringify(
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

  if (!numbers) {
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
    console.log('');
  }

  console.log('Linked number(s):');
  console.log('');

  displayNumbers(numbers);

  if (numbers.length > 0 && !hasCorrectCapabilities && fail) {
    console.error(
      'This application does not have the voice or messages capability enabled',
    );

    yargs.exit(1);
    return;
  }
};

