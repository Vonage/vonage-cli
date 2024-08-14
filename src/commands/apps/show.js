const yaml = require('yaml');
const { displayApplication } = require('../../apps/display');
const { Client } = require('@vonage/server-client');

exports.command = 'show <app-id>';

exports.desc = 'Get information for an application';

exports.builder = {
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
};

exports.handler = async (argv) => {
  console.info(`Show information for application ${argv.appId}`);
  const { SDK } = argv;

  const application = await SDK.applications.getApplication(argv.appId);

  if (argv.yaml) {
    console.log(yaml.stringify(
      Client.transformers.snakeCaseObjectKeys(application, true, false),
    ));
    return;
  }

  if (argv.json) {
    console.log(JSON.stringify(
      Client.transformers.snakeCaseObjectKeys(application, true, false),
      null,
      2,
    ));
    return;
  }

  console.debug('Found application');
  displayApplication(application);
};
