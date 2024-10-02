const yaml = require('yaml');
const { Client } = require('@vonage/server-client');
const {capabilities, getAppCapabilities, listApplications } = require('../../apps/display');

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
    throw new Error(`Invalid capability. Only: ${capabilities.join(', ')} are allowed`);
  }

  return [operation, checkCapabilities];
};

const flags = {
  'yaml': {
    describe: 'Output as YAML',
    type: 'boolean', conflicts: 'json',
  },
  'json': {
    describe: 'Output as JSON',
    conflicts: 'yaml',
    type: 'boolean',
  },

  'app-name': {
    describe: 'Filter by application name',
    group: 'Applications',
  },
  'capability': {
    describe: 'Filter by capability',
    group: 'Applications',
    coerce: coerceCapability,
  },
  // Flags from higher level that do not apply to this command
  'api-key': {
    hidden: true,
  },
  'api-secret': {
    hidden: true,
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

exports.builder = (yargs) => yargs.options(flags);

exports.handler = async (argv) => {
  console.info('Listing applications');

  const { SDK } = argv;
  let apps = [];

  // Load in all applications
  for await (const result of SDK.applications.listAllApplications()) {
    apps.push(Client.transformers.snakeCaseObjectKeys(result, true, false));
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
