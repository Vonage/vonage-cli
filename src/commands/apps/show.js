const yaml = require('yaml');
const { displayApplication } = require('../../apps/display');
const { Client } = require('@vonage/server-client');

exports.command = 'show <id>';

exports.desc = 'Get information for an application';

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
      describe: 'The ID of the application to show',
    },
  );

exports.handler = async (argv) => {
  console.info(`Show information for application ${argv.id}`);

  const { SDK } = argv;

  const application = await SDK.applications.getApplication(argv.id);

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
