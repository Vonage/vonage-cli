const { confirm } = require('../../ux/confirm');
const { makeSDKCall } = require('../../utils/makeSDKCall');
const { force } = require('../../commonFlags');
const { apiKey, apiSecret } = require('../../credentialFlags');
const { dumpCommand } = require('../../ux/dump');

exports.command = 'delete <id>';

exports.desc = 'Delete application';

/* istanbul ignore next */
exports.builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'The ID of the application to delete',
    },
  ).options({
    'api-key': apiKey,
    'api-secret': apiSecret,
    force: force,
  })
  .example(
    dumpCommand('vonage apps delete 000[...]000'),
    'Delete application with ID 000[...]000',
  );

exports.handler = async (argv) => {
  console.info(`Deleting application: ${argv.id}`);

  const { SDK, id } = argv;

  const app = await makeSDKCall(
    SDK.applications.getApplication.bind(SDK.applications),
    'Fetching Application',
    id,
  );

  const okToDelete = await confirm(`Delete application ${app.name} (${app.id})?`);

  if (!okToDelete) {
    return;
  }

  await makeSDKCall(
    SDK.applications.deleteApplication.bind(SDK.applications),
    'Deleting application',
    id,
  );
};
