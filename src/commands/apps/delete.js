const { sdkError } = require('../../utils/sdkError');
const { spinner } = require('../../ux/spinner');
const { confirm } = require('../../ux/confirm');
const { loadAppFromSDK } = require('../../apps/loadAppFromSDK');
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

  const app = await loadAppFromSDK(SDK, id);

  const okToDelete = await confirm(`Delete application ${app.name} (${app.id})?`);

  if (!okToDelete) {
    return;
  }

  const {stop, fail } = spinner({message: 'Deleting application'});

  try {
    await SDK.applications.deleteApplication(argv.id);
    stop();

    console.log('Application deleted');
  } catch (error) {
    fail();
    sdkError(error);
    return;
  }
};
