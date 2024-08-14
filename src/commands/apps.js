const yaml = require('yaml');
const { Client } = require('@vonage/server-client');
const { listApplications, displayFlags } = require('../apps/display');

exports.command = 'apps [command]';

exports.desc = 'List applications';

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
  'page-size': {
    alias: ['s'],
    describe: 'Number of applications to return',
    type: 'number',
    default: 100,
  },
  'page': {
    alias: ['p'],
    describe: 'Page number',
    type: 'number',
  },
  ...displayFlags,
}).commandDir('apps');

exports.handler = async (argv) => {
  console.info('Listing applications');
  const { SDK } = argv;
  const apps = [];

  // Load in all applications
  for await (const result of SDK.applications.listAllApplications({
    page: argv.page,
    pageSize: argv.pageSize,
  })) {
    apps.push(Client.transformers.snakeCaseObjectKeys(result, true, false));
  }

  if (argv.yaml) {
    console.log(yaml.stringify(apps));
    return;
  }

  if (argv.json) {
    console.log(JSON.stringify(apps, null, 2));
    return;
  }

  console.debug(`Found ${apps.length} applications`);
  listApplications(argv, apps);
};
