const yaml = require('yaml');
const { spinner } = require('../../ux/spinner');
const snakecase = require('snakecase');
const { Client } = require('@vonage/server-client');
const { listApplications } = require('../../apps/display');
const { capabilities, getAppCapabilities } = require('../../apps/capabilities');
const { apiSecret, apiKey } = require('../../credentialFlags');
const { dumpCommand } = require('../../ux/dump');

const coerceCapability = (capability) => {
  // Determine if we are looking for a single capability, multiple
  // capabilities with an OR, or multiple capabilities with an AND
  let operation = 'eq';
  let checkCapabilities = [capability.toLowerCase()];

  if (capability.includes(',')) {
    checkCapabilities = capability.split(',').map((capability) => capability.trim().toLowerCase());
  }

  if (capability.includes('+')) {
    operation = 'and';
    checkCapabilities = capability.split('+').map((capability) => capability.trim().toLowerCase());
  }

  // Check that the list of capabilities is valid
  const validCheckCapabilities = checkCapabilities.every((capability) => capabilities.includes(capability));
  if (!validCheckCapabilities) {
    throw new Error(`Invalid capability. Only: ${capabilities.map(snakecase).join(', ')} are allowed`);
  }

  return [operation, checkCapabilities];
};

const flags = {
  'app-name': {
    describe: 'Filter by application name',
    group: 'Applications',
  },
  'capability': {
    describe: 'Filter by capability (comma separated for OR, plus separated for AND)',
    group: 'Applications',
    coerce: coerceCapability,
  },
};

const matchCapability = (app, [operation, capabilities]) => {
  const appCapabilities = getAppCapabilities(app);

  switch (operation) {
  case 'eq':
    return capabilities.some((capability) => appCapabilities.includes(capability));
  case 'and':
    return capabilities.every((capability) => appCapabilities.includes(capability))
        && capabilities.length === appCapabilities.length;
  }
};

exports.coerceCapability = coerceCapability;

exports.flags = flags;

exports.command = 'list';

exports.desc = 'List applications';

exports.builder = (yargs) => yargs.options({
  'api-key': apiKey,
  'api-secret': apiSecret,
  ...flags,
})
  .example(
    dumpCommand('vonage apps list'),
    'List all applications',
  )
  .example(
    dumpCommand('vonage apps list --app-name=myapp'),
    'List all applications that have "myapp" in the name',
  )
  .example(
    dumpCommand('vonage apps list --capability=voice+messages'),
    'List all applications with that have both voice and messages capability',
  )
  .example(
    dumpCommand('vonage apps list --capability=voice,messages'),
    'List all applications with that have voice and or messages capability',
  );

exports.handler = async (argv) => {
  console.info('Listing applications');

  const { SDK } = argv;
  let apps = [];

  const { stop, fail } = spinner({
    message: 'Loading applications...',
  });

  try {
    let stopped = false;

    // Load in all applications
    for await (const result of SDK.applications.listAllApplications()) {
      !stopped && stop('✅ Loading applications... Done');
      !stopped && console.log('');
      stopped = true;
      apps.push(Client.transformers.snakeCaseObjectKeys(result, true, false));
    }
  } catch (error) {
    fail();
    console.error('❌ Loading applications... Failed');
    console.error(error);
    return;
  }

  if (argv.appName) {
    apps = apps.filter((app) => app.name.match(new RegExp(argv.appName, 'i')));
  }

  if (argv.capability) {
    apps = apps.filter((app) => matchCapability(app, argv.capability));
  }

  if (argv.yaml) {
    console.log(yaml.stringify(apps, null, 2));
    return;
  }

  if (argv.json) {
    console.log(JSON.stringify(apps, null, 2));
    return;
  }

  console.debug(`Found ${apps.length} applications`);

  if (apps.length === 0) {
    console.log('No applications found');
    return;
  }

  listApplications(apps);
};
