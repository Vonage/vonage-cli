const { appId, privateKey } = require('../../credentialFlags');
const { makeSDKCall } = require('../../utils/makeSDKCall');
const { spinner } = require('../../ux/spinner');
const { confirm } = require('../../ux/confirm');
const { sdkError } = require('../../utils/sdkError');

exports.command = 'delete <id>';

exports.desc = 'Delete a user';

/* istanbul ignore next */
exports.builder = (yargs) => yargs
  .positional(
    'id',
    {
      describe: 'The user ID',
    })
  .options({
    'app-id': appId,
    'private-key': privateKey,
  });

exports.handler = async (argv) => {
  const { SDK, id } = argv;
  console.info('Deleting user');

  const user = await makeSDKCall(
    SDK.users.getUser.bind(SDK.users),
    'Fetching User',
    id,
  );

  const okToDelete = await confirm('Are you sure you want to delete this user?');

  if (!okToDelete) {
    console.log('User not deleted');
    return;
  }

  const {stop, fail} = spinner({message: 'Deleting user'});

  try {
    await SDK.users.deleteUser(user.id);
    stop();
    console.log('');
    console.log('User deleted');
  } catch (error) {
    fail();
    sdkError(error);
  }
};
