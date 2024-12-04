const { confirm } = require('../../ux/confirm');
const { makeSDKCall } = require('../../utils/makeSDKCall');
const { force } = require('../../commonFlags');
const { apiKey, apiSecret } = require('../../credentialFlags');

exports.command = 'delete <id>';

exports.desc = 'Delete application';

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
  });

exports.handler = async (argv) => {
  console.info(`Deleting application: ${argv.id}`);

  const { SDK, id } = argv;

  const app = await makeSDKCall(SDK.applications.getApplication, 'Fetching Application', id);

  const okToDelete = await confirm(`Delete application ${app.name} (${app.id})?`);

  if (!okToDelete) {
    return;
  }

  await makeSDKCall(SDK.applications.deleteApplication, 'Deleting application', id);
};
