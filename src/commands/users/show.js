const { appId, privateKey } = require('../../credentialFlags');
const { makeSDKCall } = require('../../utils/makeSDKCall');
const { displayFullUser } = require('../../users/display');

exports.command = 'show <id>';

exports.desc = 'Show user';

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
  console.info('Showing user details');

  const user = await makeSDKCall(
    SDK.users.getUser.bind(SDK.users),
    'Fetching User',
    id,
  );

  console.log('');
  displayFullUser(user);
};
