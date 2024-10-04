const { sdkError } = require('../../utils/sdkError');
const { spinner } = require('../../ux/spinner');

exports.command = 'delete <id>';

exports.desc = 'Delete application';

exports.builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'The ID of the application to delete',
    },
  ).options({
    // Flags from higher level that do not apply to this command
    'app-name': {
      hidden: true,
    },
    'capability': {
      hidden: true,
    },
    'app-id': {
      hidden: true,
    },
    'private-key': {
      hidden: true,
    },
  });

exports.handler = async (argv) => {
  console.info(`Deleting application: ${argv.id}`);

  const { SDK } = argv;

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
