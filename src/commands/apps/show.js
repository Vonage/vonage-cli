const yaml = require('yaml');
const { displayApplication } = require('../../apps/display');
const { Client } = require('@vonage/server-client');

exports.command = 'show <app-id>';

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
  'app-id': {
    hidden: true,
  },
  // app-id requires private-key since we are not using it for this command,
  // default it to __skip__ and hide it
  'private-key': {
    default: '__skip__',
    coerce: (arg) => arg,
    hidden: true,
  },
  // These come from the apps command so we just hide them in all sub commands
  'app-name': {
    hidden: true,
  },
  'capability': {
    hidden: true,
  },
});

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
